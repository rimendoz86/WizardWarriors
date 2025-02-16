import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

interface ISocketContext {
  ws: WebSocket | null;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
if (!WS_URL) {
  throw new Error("NEXT_PUBLIC_WS_URL environment variable is not set");
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext);

// GAME SOCKET BEING INSTANTIATED TWICE
export function SocketProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const ws = useMemo(
    () => (typeof window !== "undefined" ? new WebSocket(`${WS_URL}`) : null),
    []
  );

  useEffect(() => {
    if (ws) {
      ws.binaryType = "arraybuffer";

      ws.onclose = () => {
        if (ws.readyState === 1) {
          console.log("socket closed");
        }
      };

      ws.onerror = () => {
        console.log("Websocket connection error");
      };

      ws.onopen = () => console.log("Connected to game ws server");
    }

    return () => {
      ws?.close();
    };
  }, [ws]);

  return (
    <SocketContext.Provider value={{ ws }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export default SocketContext;

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

interface ISocketContext {
  ws: WebSocket | null;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
const SocketContext = createContext<ISocketContext>({} as ISocketContext);


// GAME SOCKET BEING INSTANTIATED TWICE
export function SocketProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const ws = useMemo(
    () =>
      typeof window !== "undefined"
        ? new WebSocket(`ws://${WS_URL ? WS_URL : window.location.host}/game`)
        : null,
    []
  );

  useEffect(() => {
    if (ws) {
      ws.binaryType = "arraybuffer";
      (readyState: number) => {
        switch (readyState) {
          case 1:
            console.log("socket closed");
        }
      };
      ws.onerror = () => {
        console.log("Websocket connection error");
      };
      ws.onopen = () => console.log("Connected to game ws server");
    }
  }, [ws]);

  return (
    <SocketContext.Provider value={{ ws }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export default SocketContext;

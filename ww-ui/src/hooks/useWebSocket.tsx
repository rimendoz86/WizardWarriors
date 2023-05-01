import { useEffect, useMemo } from "react";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const useWebSocket = (): WebSocket | null => {
  // USE SOCKET FROM SOCKETPROVIDER, using this hook will result in instanting two websockets
  const ws = useMemo(
    () =>
      typeof window !== "undefined"
        ? new WebSocket(`ws://${WS_URL ? WS_URL : window.location.host}/game`)
        : null,
    []
  );

  useEffect(() => {
    if (ws) {
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

  return ws;
};

export default useWebSocket;

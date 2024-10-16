import { useEffect } from "react";

type webSocketProps = {
  uuid: string;
  onPlayed?: CallableFunction;
};

export default function WebSocketComponent({ uuid, onPlayed }: webSocketProps) {
  console.log("initialized...");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const socket = new WebSocket(`ws://localhost:80/${uuid}`);

      socket.addEventListener("message", (event) => {
        if (event.data === "update") {
          if (onPlayed) onPlayed();
        }
      });
    }
  }, [uuid, onPlayed]);
  return null;
}

import { WebSocketContext } from "@/contexts/WebSocketContext";
import { ReactNode, useCallback, useEffect, useState } from "react";
export default function WebSocketProvider({
  uuid,
  children,
}: {
  uuid: string;
  children: ReactNode;
}) {
  const [shouldFetch, setShouldFetch] = useState(true);

  const resetFetchTrigger = useCallback(() => setShouldFetch(false), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("initialized");
      const socket = new WebSocket(`ws://localhost:80/${uuid}`);

      socket.addEventListener("message", (event) => {
        if (event.data === "update") {
          //   if (onPlayed) onPlayed();
          console.log("updated");
          setShouldFetch(true);
        }
      });

      return () => socket.close();
    }
  }, [uuid]);
  return (
    <WebSocketContext.Provider value={{ uuid, shouldFetch, resetFetchTrigger }}>
      {children}
    </WebSocketContext.Provider>
  );
}

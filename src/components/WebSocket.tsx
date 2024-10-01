import { useEffect } from "react";
import Pusher from "pusher-js";

type webSocketProps = {
  uuid: string;
  onPlayed: CallableFunction;
};

export default function WebSocketComponent({ uuid, onPlayed }: webSocketProps) {
  useEffect(() => {
    // Make sure this runs on the client side
    if (typeof window !== "undefined") {
      const pusher = new Pusher("abec2a31dd56a1cb649d", {
        cluster: "us2",
      });
      const channel = pusher.subscribe(uuid);
      channel.bind("played", () => onPlayed());

      // Clean up WebSocket connection when the component unmounts
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, []);
  return null;
}

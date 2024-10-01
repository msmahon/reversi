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
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
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

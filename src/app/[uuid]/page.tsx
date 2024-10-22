"use client";
import { useRouter } from "next/navigation";
import App from "@/components/App";
import GameListLinks from "@/components/GameListLinks";
import WebSocketProvider from "@/providers/WebSocketProvider";

export default function Home({ params }: { params: { uuid: string } }) {
  const { uuid } = params;

  const router = useRouter();

  function handleNewGame(uuid: string) {
    router.push(`/${uuid}`);
  }

  return (
    <>
      <WebSocketProvider uuid={uuid}>
        <App uuid={uuid} onNewGame={handleNewGame}>
          <GameListLinks />
        </App>
      </WebSocketProvider>
    </>
  );
}

"use client";
import { useRouter } from "next/navigation";
import App from "@/components/App";
import WebSocket from "@/components/WebSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { gameData, token } from "../../../types";
import GameListLinks from "@/components/GameListLinks";

export default function Home({ params }: { params: { uuid: string } }) {
  const { uuid } = params;

  const router = useRouter();

  const [gameData, setGameData] = useState<gameData | null>(null);

  const board = useRef<token[][]>([]);

  const fetchGameData = useCallback(
    async function fetchGameData() {
      fetch(`api/game/${uuid}`)
        .then(async (response: Response) => response.json())
        .then((data) => {
          board.current = data.board;
          setGameData(data);
        });
    },
    [uuid]
  );

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  function handleNewGame(uuid: string) {
    router.push(`/${uuid}`);
  }

  return (
    <>
      <App
        uuid={uuid}
        onNewGame={handleNewGame}
        gameData={gameData}
        board={board.current}
      >
        <GameListLinks />
      </App>
      <WebSocket uuid={uuid} onPlayed={fetchGameData} />
    </>
  );
}

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gameData, gameLog, token } from "../../types";
import GameListLinks from "@/components/GameListLinks";
import Board from "@/components/Board";
import Tools from "@/components/Tools";
import WebSocket from "@/components/WebSocket";
import ScoreCard from "@/components/ScoreCard";

type game = {
  id: string;
  player1Id: string;
  player2Id: string;
  gameStatus: string;
};

export default function App({ uuid }: { uuid?: string }) {
  const router = useRouter();
  const [, setErrors] = useState<string[]>([]);
  const [gameData, setGameData] = useState<gameData | null>(null);
  const [gameList, setGameList] = useState<game[]>([]);

  const activityLog = useRef<gameLog[]>([]);
  const board = useRef<token[][]>([]);
  const turn = useRef<1 | 2>(1);

  const fetchGameData = useCallback(
    async function fetchGameData() {
      fetch(`api/game/${uuid}`)
        .then(async (response: Response) => response.json())
        .then((data) => {
          activityLog.current = data.activityLog;
          board.current = data.board;
          turn.current = data.turn;
          setGameData(data);
        });
    },
    [uuid]
  );

  useEffect(() => {
    if (uuid) {
      fetchGameData();
    }
    fetch("api/game-list")
      .then((response: Response) => response.json())
      .then((data) => {
        setGameList(data);
      });
  }, [uuid, fetchGameData]);

  function handleNewGame(uuid: string) {
    router.push(`/${uuid}`);
  }

  function handlePlayed() {
    fetchGameData();
  }

  return (
    <div className="App flex-col h-screen">
      {uuid && <WebSocket uuid={uuid} onPlayed={handlePlayed} />}

      <Tools onNewGame={handleNewGame} />
      {gameData && uuid && (
        <div className="w-full flex items-center justify-center">
          <ScoreCard gameData={gameData} playerNumber={1} />

          <Board
            board={board.current}
            uuid={uuid}
            gameData={gameData}
            errorSetter={setErrors}
          />

          <ScoreCard gameData={gameData} playerNumber={2} />
        </div>
      )}
      <GameListLinks gameList={gameList} />
    </div>
  );
}

"use client";
import { ReactNode, useState } from "react";
import { gameData, token } from "../../types";
import Board from "@/components/Board";
import Tools from "@/components/Tools";
import ScoreCard from "@/components/ScoreCard";

type game = {
  id: string;
  player1Id: string;
  player2Id: string;
  gameStatus: string;
};

type appProps = {
  uuid?: string;
  onNewGame: CallableFunction;
  gameData: gameData | null;
  board: token[][];
  children: ReactNode;
};

export default function App({
  uuid,
  onNewGame,
  gameData,
  board,
  children,
}: appProps) {
  const [, setErrors] = useState<string[]>([]);

  return (
    <div className="App flex-col h-screen">
      <Tools onNewGame={onNewGame} />
      {gameData && uuid && (
        <div className="w-full flex items-center justify-center">
          <ScoreCard gameData={gameData} playerNumber={1} />

          <Board
            board={board}
            uuid={uuid}
            gameData={gameData}
            errorSetter={setErrors}
          />

          <ScoreCard gameData={gameData} playerNumber={2} />
        </div>
      )}
      {children}
    </div>
  );
}

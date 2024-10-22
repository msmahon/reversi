"use client";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { gameData, token } from "../../types";
import Board from "@/components/Board";
import Tools from "@/components/Tools";
import ScoreCard from "@/components/ScoreCard";
import { WebSocketContext } from "@/contexts/WebSocketContext";

type appProps = {
  uuid?: string;
  onNewGame: CallableFunction;
  children: ReactNode;
};

export default function App({ uuid, onNewGame, children }: appProps) {
  const [, setErrors] = useState<string[]>([]);
  const [gameData, setGameData] = useState<gameData | null>(null);

  const { shouldFetch, resetFetchTrigger } = useContext(WebSocketContext);

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
    if (shouldFetch) {
      fetchGameData();
      if (resetFetchTrigger) resetFetchTrigger();
    }
  }, [shouldFetch, fetchGameData, resetFetchTrigger]);

  return (
    <div className="App flex-col h-screen">
      <Tools onNewGame={onNewGame} />
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
      {children}
    </div>
  );
}

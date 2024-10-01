"use client";
// import useWebSocket from "react-use-websocket";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  gameData as gameDataType,
  gameLog as gameLogType,
  token,
} from "../../types";
import GameListLinks from "@/components/GameListLinks";
// import MoveHistory from "@/components/MoveHistory";
import Board from "@/components/Board";
import Tools from "@/components/Tools";
import GameStatus from "@/components/GameStatus";
import WebSocket from "@/components/WebSocket";

// const socketUrl = "ws://localhost:8081";
// const websocket = socket();

type game = {
  id: string;
  player1Id: string;
  player2Id: string;
  gameStatus: string;
};

export default function App({ uuid }: { uuid: string }) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [gameData, setGameData] = useState<gameDataType | null>(null);
  const [gameList, setGameList] = useState<game[]>([]);

  //   const WebSocketClient = useWebSocket(`${socketUrl}?id=${uuid}`, {
  //     //Will attempt to reconnect on all close events, such as server shutting down
  //     shouldReconnect: (closeEvent) => true,
  //   });

  // useEffect(() => {
  //   // Fetch initial game state using url
  //   setUuid(dataId);
  // }, [dataId]);

  //   useEffect(() => {
  //     // Update state from websocket message
  //     let data: any = WebSocketClient.lastJsonMessage;
  //     if (data) {
  //       setBoard(data.board_data);
  //       setGameData(data.game_data);
  //       setYourTurn(data.game_data.playersTurn === uuid || false);
  //     }
  //   }, [WebSocketClient.lastJsonMessage, uuid]);

  const activityLog = useRef<gameLogType[]>([]);
  const board = useRef<token[][]>([]);
  const turn = useRef<0 | 1>(0);

  async function fetchGameData() {
    fetch(`api/game/${uuid}`)
      .then(async (response: Response) => response.json())
      .then((data) => {
        activityLog.current = data.activityLog;
        board.current = data.board;
        turn.current = data.turn;
        setGameData(data);
      });
  }

  useEffect(() => {
    if (uuid) {
      fetchGameData();
    }
    fetch("api/game-list")
      .then((response: Response) => response.json())
      .then((data) => {
        setGameList(data);
      });
  }, [uuid]);

  function handleNewGame(uuid: string) {
    router.push(`/${uuid}`);
  }

  function handlePlayed() {
    fetchGameData();
  }

  return (
    <div className="App flex flex-row h-screen">
      {uuid && <WebSocket uuid={uuid} onPlayed={handlePlayed} />}
      <div className="basis-1/3 p-4 bg-stone-100 flex flex-col gap-4">
        <Tools onNewGame={handleNewGame} />
        {gameData && <GameStatus data={gameData} errors={errors} />}
        {/* {activityLog && <MoveHistory activityLog={activityLog.current} />} */}
        <GameListLinks gameList={gameList} />
      </div>

      {gameData && (
        <Board
          board={board.current}
          uuid={uuid}
          playableCells={gameData.playableCells}
          errorSetter={setErrors}
        />
      )}
    </div>
  );
}

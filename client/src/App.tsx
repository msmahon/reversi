import useWebSocket from "react-use-websocket";
import { useState, useEffect, useCallback } from "react";
import {
  gameData as gameDataType,
  token as tokenType,
} from "../../server/src/types";
import GameListLinks from "./components/GameListLinks";
import MoveHistory from "./components/MoveHistory";
import Board from "./components/Board";
import Tools from "./components/Tools";
import GameStatus from "./components/GameStatus";

const socketUrl = "ws://localhost:8081";

type game = { id: string; player_0_id: string; player_1_id: string };

function App({ dataId }: { dataId: string }) {
  let [board, setBoard] = useState<tokenType[][]>([]);
  let [uuid, setUuid] = useState<any>("");
  let [errors, setErrors] = useState<string[]>([]);
  let [gameData, setGameData] = useState<gameDataType>({
    player0: 0,
    player1: 0,
    playersTurn: "",
    remaining: 0,
    size: 8,
    activityLog: [],
    winner: false,
  });
  let [yourTurn, setYourTurn] = useState<boolean>(false);
  let [gameList, setGameList] = useState<game[]>([]);

  const WebSocketClient = useWebSocket(`${socketUrl}?id=${uuid}`, {
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    // Fetch initial game state using url
    setUuid(dataId);
  }, [dataId]);

  useEffect(() => {
    // Update state from websocket message
    let data: any = WebSocketClient.lastJsonMessage;
    if (data) {
      setBoard(data.board_data);
      setGameData(data.game_data);
      setYourTurn(data.game_data.playersTurn === uuid || false);
    }
  }, [WebSocketClient.lastJsonMessage, uuid]);

  const fetchBoardStatus = useCallback(() => {
    if (uuid) {
      fetch(`http://localhost:3001/api/show/${uuid}`).then(
        async (response: any) => {
          let result = await response.json();
          setBoard(result.board_data);
          setGameData(result.game_data);
        }
      );
    }
  }, [uuid]);

  useEffect(() => {
    fetchBoardStatus();
  }, [uuid, fetchBoardStatus]);

  useEffect(() => {
    // Get game list
    fetch("http://localhost:3001/api/game-list").then(
      async (response: Response) => {
        const result = await response.json();
        setGameList(result);
      }
    );
  }, [uuid]);

  return (
    <div className="App flex flex-row h-screen">
      <div className="basis-1/3 p-4 bg-stone-100 flex flex-col gap-4">
        <Tools onNewGame={setUuid} />
        <GameStatus data={gameData} yourTurn={yourTurn} errors={errors} />
        <GameListLinks gameList={gameList} />
        <MoveHistory activityLog={gameData.activityLog} />
      </div>

      <Board
        board={board}
        uuid={uuid}
        yourTurn={yourTurn}
        errorSetter={setErrors}
      />
    </div>
  );
}

export default App;

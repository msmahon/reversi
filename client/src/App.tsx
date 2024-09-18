import useWebSocket from "react-use-websocket";
import { useState, useEffect, useCallback } from "react";
import Token from "./components/Token";
import {
  gameData as gameDataType,
  token as tokenType,
} from "../../server/src/types";
import GameListLinks from "./components/GameListLinks";
import MoveHistory from "./components/MoveHistory";
import Board from "./components/Board";

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

  const alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

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

  const newGame = () => {
    let size = null;
    do
      size = parseInt(
        window.prompt(
          "Choose new board size.\nMust be an even number between 4 and 10.",
          "8"
        ) || ""
      );
    while (!(size % 2 === 0 && size <= 10 && size > 3));
    fetch(`http://localhost:3001/api/new/${size}`).then(
      async (response: Response) => {
        const result = await response.json();
        setUuid(result.id);
      }
    );
  };
  const reset = () => {
    fetch(`http://localhost:3001/api/reset`).then(async (response: any) => {
      //
    });
  };

  let size = board && board.length;

  const tokens = () =>
    board.map((row) =>
      row.map((token) => (
        <div key={crypto.randomUUID()}>
          <span
            key={crypto.randomUUID()}
            className="absolute text-xs pl-1 pt-1 text-stone-400"
          >
            {alpha[token.column]}
            {token.row + 1}
          </span>
          <Token
            key={crypto.randomUUID()}
            uuid={uuid}
            token={token}
            yourTurn={yourTurn}
            errorSetter={setErrors}
          />
        </div>
      ))
    );

  const emptyBoard = () => (
    <div className={`grid grid-rows-${size} grid-cols-${size}`}></div>
  );

  return (
    <div className="App flex flex-row h-screen">
      <div className="basis-1/3 p-4 bg-stone-100 flex flex-col gap-4">
        <div id="toolbar" className="bg-stone-400 p-4 rounded-xl">
          <button onClick={() => newGame()} className="mr-2">
            new
          </button>
          <button onClick={() => reset()} className="">
            reset
          </button>
          <div>
            <form action="#">
              <label htmlFor="size">
                Board size: <br />
                <input name="size" type="text" />
              </label>
            </form>
          </div>
        </div>
        <div id="game-status">
          <div className="flex flex-row gap-4 text-6xl">
            <div
              className={`p-4 rounded-xl outline-4 w-1/2 ${
                gameData.playersTurn === "0"
                  ? "outline outline-orange-400 bg-orange-300"
                  : "bg-stone-400"
              }`}
            >
              ⚫ {gameData.player0}
              <span className="text-sm">
                {(yourTurn && gameData.playersTurn === "0") ||
                (!yourTurn && gameData.playersTurn === "1")
                  ? "(You)"
                  : ""}
              </span>
            </div>
            <div
              className={`p-4 rounded-xl outline-4 w-1/2 ${
                gameData.playersTurn === "1"
                  ? "outline outline-orange-400 bg-orange-300"
                  : "bg-stone-400"
              }`}
            >
              ⚪ {gameData.player1}
              <span className="text-sm">
                {(yourTurn && gameData.playersTurn === "1") ||
                (!yourTurn && gameData.playersTurn === "0")
                  ? "(You)"
                  : ""}
              </span>
            </div>
          </div>
          {errors}
        </div>
        <GameListLinks gameList={gameList} />
        <MoveHistory activityLog={gameData.activityLog} />
      </div>

      {/* Board */}

      {/* <div className="basis-2/3 p-4 flex justify-center items-center bg-stone-300"> */}
      <Board
        board={board}
        uuid={uuid}
        yourTurn={yourTurn}
        errorSetter={setErrors}
      />
      {/* <div className="mr-4 p-4 rounded-xl bg-stone-100 h-fit">
          <div className="flex justify-between text-2xl mx-2 mb-2">
            {alpha.slice(0, size).map((a) => (
              <div
                key={crypto.randomUUID()}
                className="top-4 pt-4 text-center w-16 h-16 border border-stone-300"
              >
                {a}
              </div>
            ))}
          </div>
          <div className="border-8 border-stone-400 shadow-md">
            <div
              id="board-container"
              className={`grid grid-rows-${size} grid-cols-${size} content-baseline`}
            >
              {board.length === 0 ? emptyBoard() : tokens()}
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default App;

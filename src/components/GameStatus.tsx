import { gameData } from "../../types";

type gameStatusProps = {
  data: gameData;
  errors: string[];
};

export default function GameStatus({ data, errors }: gameStatusProps) {
  return (
    <div id="game-status">
      <div className="flex flex-row gap-4 text-6xl">
        <div
          className={`p-4 rounded-xl outline-4 w-1/2 ${
            data.playersTurn === 0
              ? "outline outline-orange-400 bg-orange-300"
              : "bg-stone-400"
          }`}
        >
          ⚫ {data.player1.score}
          <span className="text-sm">
            {(data.yourTurn && data.playersTurn === 0) ||
            (!data.yourTurn && data.playersTurn === 1)
              ? "(You)"
              : ""}
          </span>
        </div>
        <div
          className={`p-4 rounded-xl outline-4 w-1/2 ${
            data.playersTurn === 1
              ? "outline outline-orange-400 bg-orange-300"
              : "bg-stone-400"
          }`}
        >
          ⚪ {data.player2.score}
          <span className="text-sm">
            {(data.yourTurn && data.playersTurn === 1) ||
            (!data.yourTurn && data.playersTurn === 0)
              ? "(You)"
              : ""}
          </span>
        </div>
      </div>
      {errors}
    </div>
  );
}

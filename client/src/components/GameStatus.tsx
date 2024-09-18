import { gameData } from "../../../server/src/types";

type gameStatusProps = {
  data: gameData;
  yourTurn: boolean;
  errors: string[];
};

export default function GameStatus({
  data,
  yourTurn,
  errors,
}: gameStatusProps) {
  return (
    <div id="game-status">
      <div className="flex flex-row gap-4 text-6xl">
        <div
          className={`p-4 rounded-xl outline-4 w-1/2 ${
            data.playersTurn === "0"
              ? "outline outline-orange-400 bg-orange-300"
              : "bg-stone-400"
          }`}
        >
          ⚫ {data.player0}
          <span className="text-sm">
            {(yourTurn && data.playersTurn === "0") ||
            (!yourTurn && data.playersTurn === "1")
              ? "(You)"
              : ""}
          </span>
        </div>
        <div
          className={`p-4 rounded-xl outline-4 w-1/2 ${
            data.playersTurn === "1"
              ? "outline outline-orange-400 bg-orange-300"
              : "bg-stone-400"
          }`}
        >
          ⚪ {data.player1}
          <span className="text-sm">
            {(yourTurn && data.playersTurn === "1") ||
            (!yourTurn && data.playersTurn === "0")
              ? "(You)"
              : ""}
          </span>
        </div>
      </div>
      {errors}
    </div>
  );
}

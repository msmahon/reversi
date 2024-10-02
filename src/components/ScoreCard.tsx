import { gameData } from "../../types";

type ScoreCardProps = {
  gameData: gameData;
  playerNumber: number;
};

export default function Token({ gameData, playerNumber }: ScoreCardProps) {
  const playerData = playerNumber === 1 ? gameData.player1 : gameData.player2;
  const otherPlayerNumber = playerNumber === 1 ? 2 : 1;
  const isYou =
    (gameData.yourTurn && gameData.playersTurn === playerNumber) ||
    (!gameData.yourTurn && gameData.playersTurn === otherPlayerNumber);

  let classNames = "p-3 bg-stone-100 rounded-lg border-2";
  if (gameData.playersTurn === playerNumber) {
    if (isYou) {
      classNames += " border-orange-300";
    } else {
      classNames += " border-stone-400";
    }
  }

  return (
    <div className="text-center">
      <div className={classNames}>
        <div className="text-7xl">{playerNumber === 1 ? "⚫️" : "⚪️"}</div>
        <div className="">{playerData.score}</div>
      </div>
      <div>{isYou ? "You" : "Opponent"}</div>
    </div>
  );
}

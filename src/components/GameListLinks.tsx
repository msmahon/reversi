import { useEffect, useState } from "react";
import Anchor from "../components/element-components/Anchor";
import { usePathname } from "next/navigation";

type game = {
  id: string;
  player1Id: string;
  player2Id: string;
  gameStatus: string;
};

export default function GameListLinks() {
  const [gameList, setGameList] = useState<game[]>([]);

  useEffect(function () {
    fetch("api/game-list")
      .then((response: Response) => response.json())
      .then((data) => {
        setGameList(data);
      });
  }, []);

  const pathname = usePathname();
  return (
    <table className="table table-auto border-spacing-4 border-separate">
      <tbody>
        {gameList.map((game) => (
          <tr key={game.id}>
            <td>
              {pathname.match(game.player1Id) ? (
                "Player 1 "
              ) : (
                <Anchor href={`/${game.player1Id}`}>Player 1</Anchor>
              )}
            </td>
            <td>
              {pathname.match(game.player2Id) ? (
                "Player 2 "
              ) : (
                <Anchor href={`/${game.player2Id}`}>Player 2</Anchor>
              )}
            </td>
            <td>{game.gameStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

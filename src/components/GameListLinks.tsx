import Anchor from "../components/element-components/Anchor";
import { usePathname } from "next/navigation";

type gameListLinksProps = {
  gameList: {
    id: string;
    player1Id: string;
    player2Id: string;
    gameStatus: string;
  }[];
};

export default function GameListLinks({ gameList }: gameListLinksProps) {
  const pathname = usePathname();
  return (
    <table className="table-auto">
      <tbody>
        {gameList.map((game) => (
          <tr key={game.id} className="text-red-600">
            <td>
              <a href={`/${game.id}`}>Game</a>
            </td>
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

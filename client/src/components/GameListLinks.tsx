type gameListLinksProps = {
  gameList: { id: string; player_0_id: string; player_1_id: string }[];
};

export default function GameListLinks({ gameList }: gameListLinksProps) {
  return (
    <table className="table-auto">
      <tbody>
        {gameList.map((game) => (
          <tr key={crypto.randomUUID()}>
            <td>
              <a href={game.id}>Game</a>
            </td>
            <td>
              <a href={game.player_0_id}>Player 1</a>
            </td>
            <td>
              <a href={game.player_1_id}>Player 2</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

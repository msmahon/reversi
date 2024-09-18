import Button from "../form-components/Button";

type toolsProps = {
  onNewGame: CallableFunction;
};

export default function Tools({ onNewGame }: toolsProps) {
  function resetDatabase() {
    fetch(`http://localhost:3001/api/reset`).then(async (response: any) => {
      //
    });
  }
  function newGame() {
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
        onNewGame(result.id);
      }
    );
  }
  return (
    <div id="toolbar" className="bg-stone-400 p-4 rounded-xl">
      <div className="space-x-1">
        <Button onClick={newGame}>new</Button>
        <Button onClick={resetDatabase}>reset</Button>
      </div>

      <div>
        <form action="#">
          <label htmlFor="size">
            Board size: <br />
            <input name="size" type="text" />
          </label>
        </form>
      </div>
    </div>
  );
}

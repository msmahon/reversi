import Button from "./form-components/Button";

type toolsProps = {
  onNewGame: CallableFunction;
};

export default function Tools({ onNewGame }: toolsProps) {
  function resetDatabase() {
    fetch(`api/reset`).then(async () => {
      //
    });
  }
  function newGame(size: number | null = null) {
    if (size === null) {
      do
        size = parseInt(
          window.prompt(
            "Choose new board size.\nMust be an even number between 4 and 10.",
            "8"
          ) || ""
        );
      while (!(size % 2 === 0 && size <= 10 && size > 3));
    }
    fetch(`api/new/${size}`).then(async (response: Response) => {
      const result = await response.json();
      onNewGame(result.uuid);
    });
  }
  return (
    <div id="toolbar" className="bg-stone-400 p-4 rounded-xl">
      <div className="flex justify-between">
        <div className="space-x-1">
          <Button onClick={newGame}>New</Button>
          <Button onClick={() => newGame(6)}>6</Button>
          <Button onClick={() => newGame(8)}>8</Button>
          <Button onClick={() => newGame(10)}>10</Button>
        </div>
        <Button isDanger onClick={resetDatabase}>
          reset
        </Button>
      </div>
    </div>
  );
}

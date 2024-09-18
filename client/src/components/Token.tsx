type TokenProps = {
  token: {
    row: Number;
    column: Number;
    value?: 0 | 1;
    playable?: boolean;
  };
  uuid: String;
  yourTurn: boolean;
  errorSetter: CallableFunction;
};

// const Token = (props: TokenProps) => {
export default function Token({
  token,
  uuid,
  yourTurn,
  errorSetter,
}: TokenProps) {
  const playable = token.playable && yourTurn;

  const tokenOnClick = () => {
    fetch(`http://localhost:3001/api/play`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: uuid,
        row: token.row,
        column: token.column,
      }),
    }).then(async (response: Response) => {
      if (!response.ok) {
        response.json().then((error) => {
          errorSetter(
            error.details.map((error: { message: string }) => error.message)
          );
        });
      }
      // fetchBoardStatus()
    });
  };

  const playableClasses = "bg-orange-200 cursor-pointer";

  return (
    <div
      className={`w-16 h-16 text-center text-5xl pt-2 bg-stone-100 border border-stone-300 shadow-inner shadow-stone-400 ${
        playable && playableClasses
      }`}
      onClick={() => (playable ? tokenOnClick() : null)}
    >
      {token.value === 0 && "⚫"}
      {token.value === 1 && "⚪"}
    </div>
  );
}

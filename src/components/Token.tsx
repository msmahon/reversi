import { vectors } from "../../types";

type TokenProps = {
  token: {
    row: number;
    column: number;
    value: 0 | 1 | null;
  };
  uuid: string;
  playableVectors: vectors | never[];
  errorSetter: CallableFunction;
};

// const Token = (props: TokenProps) => {
export default function Token({
  token,
  uuid,
  playableVectors,
  errorSetter,
}: TokenProps) {
  const playable = Object.values(playableVectors).some(
    (vector) => vector.length
  );
  function onTokenClick() {
    fetch(`api/play/${uuid}/${token.row}/${token.column}`, {
      method: "POST",
    }).then(async (response: Response) => {
      if (!response.ok) {
        response.json().then((error) => {
          errorSetter(
            error.details.map((error: { message: string }) => error.message)
          );
        });
      }
    });
  }

  return (
    <div
      className="w-16 h-16 text-center text-5xl pt-2 bg-stone-100 border border-stone-300 shadow-inner shadow-stone-400"
      onClick={() => onTokenClick()}
    >
      {token.value === 0 && "⚫"}
      {token.value === 1 && "⚪"}
      {playable && (
        <span className="cursor-pointer opacity-15 hover:opacity-80">🟠</span>
      )}

      {/* TODO: Preview flippable cardinal directions */}
    </div>
  );
}

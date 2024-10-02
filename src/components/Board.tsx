import { playableVectors, token } from "../../types";
import Token from "./Token";

type boardPropTypes = {
  board: token[][];
  uuid: string;
  playableCells: playableVectors[];
  errorSetter: CallableFunction;
};

const alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

export default function Board({
  board,
  uuid,
  playableCells,
  errorSetter,
}: boardPropTypes) {
  function getPlayableVectors(token: token) {
    const playableCell = playableCells.find(
      (cell) =>
        cell.origin.row === token.row && cell.origin.column === token.column
    );
    return playableCell?.vectors || [];
  }

  return (
    <div className="p-4 flex justify-center items-center">
      {board?.length && (
        <div className="p-4 rounded-xl bg-stone-100 h-fit">
          <div className="border-8 border-stone-400 shadow-md">
            <div
              id="board-container"
              className={`grid grid-rows-${board.length} grid-cols-${board.length} content-baseline`}
            >
              {board.map((row) =>
                row.map((token) => (
                  <div key={crypto.randomUUID()}>
                    <span
                      key={crypto.randomUUID()}
                      className="absolute text-xs pl-1 pt-1 text-stone-400"
                    >
                      {alpha[token.column]}
                      {token.row + 1}
                    </span>
                    <Token
                      key={`${token.row}${token.column}`}
                      uuid={uuid}
                      token={token}
                      playableVectors={getPlayableVectors(token)}
                      errorSetter={errorSetter}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

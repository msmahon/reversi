import { token } from "../../../server/src/types";
import Token from "./Token";

type boardPropTypes = {
  board: token[][];
  uuid: String;
  yourTurn: boolean;
  errorSetter: CallableFunction;
};

const alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

export default function Board({
  board,
  uuid,
  yourTurn,
  errorSetter,
}: boardPropTypes) {
  return (
    <div className="basis-2/3 p-4 flex justify-center items-center bg-stone-300">
      <div className="mr-4 p-4 rounded-xl bg-stone-100 h-fit">
        <div className="flex justify-between text-2xl mx-2 mb-2">
          {alpha.slice(0, board.length).map((a) => (
            <div
              key={crypto.randomUUID()}
              className="top-4 pt-4 text-center w-16 h-16 border border-stone-300"
            >
              {a}
            </div>
          ))}
        </div>
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
                key={crypto.randomUUID()}
                uuid={uuid}
                token={token}
                yourTurn={yourTurn}
                errorSetter={errorSetter}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

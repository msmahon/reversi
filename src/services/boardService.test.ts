import { expect, test } from "vitest";
import {
  getAdjacentCellCoordinates,
  getCellsArrayAtVector,
  getPlayableCells,
} from "./boardService";
import { token as tokenType } from "../../types";

function generateBoardFromString(boardString: string): tokenType[][] {
  const boardArray = boardString
    .trim()
    .split("")
    .filter((char) => ["⚫", "⚪", "⬜"].includes(char));
  const size = Math.sqrt(boardArray.length);
  const tempBoard: tokenType[][] = [];
  for (let i = 0; i < size; i++) {
    const row = boardArray.slice(i * size, i * size + size);
    tempBoard.push(
      row.map((emoji, index) => {
        return {
          row: i,
          column: index,
          value: emoji === "⚫" ? 0 : emoji === "⚪" ? 1 : null,
        };
      })
    );
  }
  return tempBoard;
}

test("generate board from strings works as expected", () => {
  const testBoard = `
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⚫️⚪️⬜⬜
    ⬜⬜⚪️⚫️⬜⬜
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⬜⬜⬜⬜
  `;
  const board = generateBoardFromString(testBoard);
  const valuesOnly = board.map((row) => row.map((token) => token.value));
  expect(valuesOnly).toStrictEqual([
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, 0, 1, null, null],
    [null, null, 1, 0, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ]);
});

test("getPlayableCells", () => {
  const testBoard = `
    ⬜⬜⬜⬜
    ⬜⚫️⚪️⬜
    ⬜⚪️⚫️⬜
    ⬜⬜⬜⬜
  `;
  const board = generateBoardFromString(testBoard);
  const playableCells = getPlayableCells(board, 0);
  // Expected
  // ⬜⬜🟢⬜
  // ⬜⚫️⚪️🟢
  // 🟢⚪️⚫️⬜
  // ⬜🟢⬜⬜
  expect(playableCells).toStrictEqual([
    {
      origin: { row: 0, column: 2, value: null },
      vectors: {
        N: [],
        NE: [],
        E: [],
        SE: [],
        S: [{ row: 1, column: 2, value: 1 }],
        SW: [],
        W: [],
        NW: [],
      },
    },
    {
      origin: { row: 1, column: 3, value: null },
      vectors: {
        N: [],
        NE: [],
        E: [],
        SE: [],
        S: [],
        SW: [],
        W: [{ row: 1, column: 2, value: 1 }],
        NW: [],
      },
    },
    {
      origin: { row: 2, column: 0, value: null },
      vectors: {
        N: [],
        NE: [],
        E: [{ row: 2, column: 1, value: 1 }],
        SE: [],
        S: [],
        SW: [],
        W: [],
        NW: [],
      },
    },
    {
      origin: { row: 3, column: 1, value: null },
      vectors: {
        N: [{ row: 2, column: 1, value: 1 }],
        NE: [],
        E: [],
        SE: [],
        S: [],
        SW: [],
        W: [],
        NW: [],
      },
    },
  ]);
});

test("getCellsArrayAtVector", () => {
  const testBoard = `
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⚫️⬜⬜⬜
    ⬜⬜⚫️⚫️⬜⬜
    ⬜⚪️⚪️⚪️⬜⬜
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⬜⬜⬜⬜
  `;
  const board = generateBoardFromString(testBoard);

  const northVectorArray = getCellsArrayAtVector(
    board,
    { row: 4, column: 2, value: null },
    "N"
  );

  expect(northVectorArray).toStrictEqual([
    { row: 3, column: 2, value: 1 },
    { row: 2, column: 2, value: 0 },
    { row: 1, column: 2, value: 0 },
    { row: 0, column: 2, value: null },
  ]);

  const northEastVectorArray = getCellsArrayAtVector(
    board,
    { row: 4, column: 2, value: null },
    "NE"
  );
  expect(northEastVectorArray).toStrictEqual([
    { row: 3, column: 3, value: 1 },
    { row: 2, column: 4, value: null },
    { row: 1, column: 5, value: null },
  ]);
});

test("getAdjacentCellCoordinates", () => {
  const testBoard = `
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⚫️⬜⬜⬜
    ⬜⬜⚫️⚫️⬜⬜
    ⬜⚪️⚪️⚪️⬜⬜
    ⬜⬜⬜⬜⬜⬜
    ⬜⬜⬜⬜⬜⬜
  `;
  const board = generateBoardFromString(testBoard);
  const adjacentCells = getAdjacentCellCoordinates(board, board[1][2]);

  expect(adjacentCells).toStrictEqual([
    { row: 0, column: 1, value: null },
    { row: 0, column: 2, value: null },
    { row: 0, column: 3, value: null },
    { row: 1, column: 1, value: null },
    { row: 1, column: 3, value: null },
    { row: 2, column: 1, value: null },
    { row: 2, column: 2, value: 0 },
    { row: 2, column: 3, value: 0 },
  ]);
});

import { token, playableVectors, board } from "../../types";

type cardinalDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
const cardinalDirections: cardinalDirection[] = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
];

/**
 * Construct the rows and tokens that hold the initial game data
 * @param size Board size
 * @returns Multidimensional array of tokens
 */
export function generateBoard(size: number): board {
  const board: board = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      const token: token = {
        row: i,
        column: j,
        value: null,
      };
      board[i][j] = token;
    }
  }
  // Starting token state
  // ⬜⬜⬜⬜
  // ⬜⚫️⚪️⬜
  // ⬜⚪️⚫️⬜
  // ⬜⬜⬜⬜
  board[size / 2 - 1][size / 2 - 1].value = 0;
  board[size / 2][size / 2 - 1].value = 1;
  board[size / 2 - 1][size / 2].value = 1;
  board[size / 2][size / 2].value = 0;
  return board;
}

export function getPlayableCells(board: board, turn: 0 | 1) {
  // If player is using black tokens, these are the candidates (red)
  // ⬜⬜⬜⬜⬜⬜ Size 6
  // ⬜⬜🔴🔴🔴⬜
  // ⬜🔴⚫️⚪️🔴⬜
  // ⬜🔴⚪️⚫️🔴⬜
  // ⬜🔴🔴🔴⬜⬜
  // ⬜⬜⬜⬜⬜⬜

  // Empty cells bordering an opponents cells
  const candidateCells = board
    .flat(2)
    .filter((c) => c.value === (turn === 0 ? 1 : 0))
    .reduce((previous, current) => {
      // Get all unplayed cells around token
      const candidateCells = getAdjacentCellCoordinates(board, current).filter(
        (c) => c.value === null
      );
      return [...previous, ...candidateCells];
    }, [] as token[])
    .filter((value, index, self) => {
      // unique cells only
      return (
        self.findIndex(
          (c) => c.row === value.row && c.column === value.column
        ) === index
      );
    });

  // Looking at just one cell, get an array of tokens for each vector (N, NE, E, SE, etc...)
  // ⬜⬜⬜⬜⬜⬜ Size 6
  // ⬜⬜⬜🔴⬜⬜
  // ⬜⬜⚫️⚪️⬜⬜
  // ⬜⬜⚪️⚫️⬜⬜
  // ⬜⬜⬜⬜⬜⬜
  // ⬜⬜⬜⬜⬜⬜

  // [⬜] N
  // [⬜] NE
  // [⬜, ⬜] E
  // [⬜, ⬜] SE
  // [⚪️, ⚫️, ⬜, ⬜] S - This is the only playable vector becuase it sandwiches the opponents token
  // [⚫️, ⬜, ⬜] SW
  // [⬜, ⬜, ⬜] W
  // [⬜] NW

  return candidateCells
    .map((candidate) => {
      const originWithVectors: playableVectors = {
        origin: candidate,
        vectors: {
          N: [],
          NE: [],
          E: [],
          SE: [],
          S: [],
          SW: [],
          W: [],
          NW: [],
        },
      };

      cardinalDirections.forEach((vector) => {
        originWithVectors.vectors[vector] = getFlippableCellsAtVector(
          board,
          candidate,
          turn,
          vector
        );
      });
      return originWithVectors;
    })
    .filter((candidate) =>
      Object.values(candidate.vectors).some((vector) => vector?.length)
    );
}

function getFlippableCellsAtVector(
  board: board,
  origin: token,
  turn: 0 | 1,
  vector: cardinalDirection
) {
  const arr = getCellsArrayAtVector(board, origin, vector);
  // Example array which would return flippable tokens (if playing as black):
  // [⚪️, ⚪️, ⚫️, ⚫️, ⬜]
  if (arr.length === 0) return [];
  // first value must be other players token
  if (arr[0].value !== (turn === 0 ? 1 : 0)) return [];

  const firstMatch = arr.findIndex((token) => token.value === turn);
  if (firstMatch === -1) return [];

  // Get slice up to first match
  const candidateSlice = arr.slice(0, firstMatch);
  // At this point, the arr might look like this: [⚪️, ⚪️, ⬜, ⬜]
  // so reject if there are ANY empty cells in the array
  if (candidateSlice.some((token) => token.value === null)) {
    return [];
  }
  return candidateSlice;
}

export function getCellsArrayAtVector(
  board: board,
  origin: token,
  vector: cardinalDirection
) {
  const vectorMap = new Map();
  vectorMap.set("N", [-1, 0]);
  vectorMap.set("NE", [-1, 1]);
  vectorMap.set("E", [0, 1]);
  vectorMap.set("SE", [1, 1]);
  vectorMap.set("S", [1, 0]);
  vectorMap.set("SW", [1, -1]);
  vectorMap.set("W", [0, -1]);
  vectorMap.set("NW", [-1, -1]);
  const [y, x] = vectorMap.get(vector);
  let inBounds = true;
  const tokenArray: token[] = [];
  let row = origin.row;
  let column = origin.column;
  while (inBounds) {
    row += y;
    column += x;
    if (!isInBounds(board, row, column)) {
      inBounds = false;
    } else {
      tokenArray.push(board[row][column]);
    }
  }
  return tokenArray;
}

function isInBounds(board: board, row: number, column: number) {
  return row >= 0 && row < board.length && column >= 0 && column < board.length;
}

export function getAdjacentCellCoordinates(board: board, cell: token) {
  const adjacentTokens = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) continue;
      const y = cell.row + i;
      const x = cell.column + j;
      if (y < 0 || y === board.length) continue;
      if (x < 0 || x === board.length) continue;
      adjacentTokens.push(board[y][x]);
    }
  }
  return adjacentTokens;
}

export function getScore(board: board, turn: 0 | 1) {
  return board.flat(2).filter((cell) => cell.value == turn).length;
}

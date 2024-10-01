import { expect, test } from "vitest";
import { createTestGame } from "../utilities/db";
import prisma from "../app/client";
import assert from "assert";
import { board } from "../../types";
import { play } from "./gameService";

function generateBoardFromString(boardString: string): board {
  const boardArray = boardString
    .trim()
    .split("")
    .filter((char) => ["⚫", "⚪", "⬜"].includes(char));
  const size = Math.sqrt(boardArray.length);
  const tempBoard: board = [];
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

test("consecutive passes end a game", async () => {
  const testBoard = `
    ⚪️⚪️⚪️⚪️
    ⚪️⚪️⚪️⚪️
    ⚪️⚫️⚫️⚪️
    ⬜⬜⚪️⚪️
  `;
  // If white plays at 3,1 the game will be in
  // a state where neither player can play.
  // This should automatically end the game.
  const game = await createTestGame(4);

  expect(game).toBeDefined();
  assert(game);
  // Update board to test state above
  await prisma.game.update({
    data: {
      board: JSON.stringify(generateBoardFromString(testBoard)),
      turn: 1,
    },
    where: { id: game.id },
  });

  await play(game.player2Id, 3, 1);
  const freshGame = await prisma.game.findUnique({ where: { id: game.id } });
  expect(freshGame).toBeDefined();
  assert(freshGame);
  expect(freshGame.gameStatus).toBe("Player 2 wins!");
});

test("full board ends a game", async () => {
  const testBoard = `
    ⚪️⚪️⚪️⚪️
    ⚪️⚪️⚪️⚪️
    ⚪️⚫️⚫️⚪️
    ⬜⚫️⚪️⚪️
  `;
  const game = await createTestGame(4);

  expect(game).toBeDefined();
  assert(game);
  // Update board to test state above
  await prisma.game.update({
    data: {
      board: JSON.stringify(generateBoardFromString(testBoard)),
      turn: 1,
    },
    where: { id: game.id },
  });

  await play(game.player2Id, 3, 0);
  const freshGame = await prisma.game.findUnique({ where: { id: game.id } });
  expect(freshGame).toBeDefined();
  assert(freshGame);
  expect(freshGame.gameStatus).toBe("Player 2 wins!");
});

test("tie status recorded corretly", async () => {
  const testBoard = `
    ⚫️⚫️⚫️⚫️
    ⚫️⚫️⚫️⚫️
    ⚪️⚪️⚪️⚪️
    ⬜⚫️⚫️⚪️
  `;
  const game = await createTestGame(4);

  expect(game).toBeDefined();
  assert(game);
  // Update board to test state above
  await prisma.game.update({
    data: {
      board: JSON.stringify(generateBoardFromString(testBoard)),
      turn: 1,
    },
    where: { id: game.id },
  });

  await play(game.player2Id, 3, 0);
  const freshGame = await prisma.game.findUnique({ where: { id: game.id } });
  expect(freshGame).toBeDefined();
  assert(freshGame);
  expect(freshGame.gameStatus).toBe("It's a tie!");
});

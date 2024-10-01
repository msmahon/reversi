import prisma from "../app/client";
import { generateBoard, getPlayableCells, getScore } from "./boardService";
import { board, gameData, playableVectors, token } from "../../types";
import { Activity } from "@prisma/client";
import { broadcast } from "../../websocket";

export async function getGameData(id: string): Promise<gameData | null> {
  try {
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id: id }, { player1Id: id }, { player2Id: id }],
      },
    });

    if (!game?.id) {
      throw new Error(`Game ${id} not found`);
    }

    // determine if a player is requesting the data
    // only add playable cells if it is that players turn
    let playableCells: playableVectors[] = [];
    if (game.player1Id === id && game.turn === 0) {
      playableCells = getPlayableCells(JSON.parse(game.board), 0);
    }
    if (game.player2Id === id && game.turn === 1) {
      playableCells = getPlayableCells(JSON.parse(game.board), 1);
    }

    return {
      id: game.id,
      player1: {
        id: game.player1Id,
        score: getScore(JSON.parse(game.board), 0),
      },
      player2: {
        id: game.player1Id,
        score: getScore(JSON.parse(game.board), 1),
      },
      playersTurn: game.turn,
      yourTurn:
        (game.player1Id == id && game.turn == 0) ||
        (game.player2Id == id && game.turn == 1),
      playableCells: playableCells,
      board: JSON.parse(game.board),
      activityLog: await getActivityLog(game.id),
      winner: null,
    };
  } catch (error) {
    console.error("Error fetching game data:", error);
  } finally {
    prisma.$disconnect();
  }
  return null;
}

export async function getActivityLog(id: string): Promise<Activity[]> {
  try {
    return await prisma.activity.findMany({
      where: { gameId: id },
    });
  } catch (error) {
    console.error("Error fetching activity log:", error);
  } finally {
    prisma.$disconnect();
  }
  return [];
}

export async function generateNewGame(size: number): Promise<string | null> {
  try {
    const game = await prisma.game.create({
      select: { id: true },
      data: {
        gameStatus: "in progress",
        board: JSON.stringify(generateBoard(size)),
      },
    });
    return game.id;
  } catch (error) {
    console.error("Error generating game:", error);
  } finally {
    await prisma.$disconnect();
  }
  return null;
}

export async function play(id: string, row: number, column: number) {
  let game;
  try {
    game = await prisma.game.findFirst({
      where: {
        OR: [{ id: id }, { player1Id: id }, { player2Id: id }],
      },
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    prisma.$disconnect();
  }

  if (!game?.id) throw new Error(`Game ${id} not found`);
  if (game.gameStatus !== "in progress") throw new Error("Game already over");
  if (game.id == id) throw new Error("Invalid id");
  if (game.player1Id == id && game.turn != 0)
    throw new Error("It's not your turn");
  if (game.player2Id == id && game.turn != 1)
    throw new Error("It's not your turn");

  // get playable cells and confirm played cell is allowed
  const playableCells = getPlayableCells(
    JSON.parse(game.board),
    game.turn as 0 | 1
  );

  // const candidateCell =
  const playableCell = playableCells.find(
    (cell) => cell.origin.row == row && cell.origin.column == column
  );

  if (playableCell !== undefined) {
    const flippedVectors = Object.values(playableCell.vectors).reduce(
      (carry, current) => {
        if (current.length) {
          return [...carry, ...current];
        }
        return carry;
      },
      [playableCell.origin] as token[]
    );
    await flipCells(game.id, game.turn as 0 | 1, flippedVectors);
  }
}

async function flipCells(id: string, turn: 0 | 1, tokens: token[]) {
  let game;
  try {
    game = await prisma.game.findUniqueOrThrow({
      where: { id: id },
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    prisma.$disconnect();
  }

  if (!game) {
    console.error("Error: Game not found");
    return;
  }
  const board = JSON.parse(game.board) as token[][];
  tokens.forEach((token) => (board[token.row][token.column].value = turn));

  const nextTurn = getNextTurn(board, turn === 1 ? 0 : 1);

  try {
    // console.log(board);
    game = await prisma.game.update({
      data: {
        board: JSON.stringify(board),
        turn: nextTurn,
        gameStatus: nextTurn === null ? checkWinState(board) : "in progress",
      },
      where: { id: id },
    });
    broadcast(game.id);
    broadcast(game.player1Id);
    broadcast(game.player2Id);
    // TODO: wrap in transaction
  } catch (error) {
    console.error("Error:", error);
  } finally {
    prisma.$disconnect();
  }
}

function getNextTurn(board: board, nextTurn: 0 | 1) {
  const allCellsPlayed =
    board.flat(2).filter((cell) => cell.value == null).length === 0;
  if (allCellsPlayed) return null;

  // make sure next player can play
  const nextPlayableCells = getPlayableCells(board, nextTurn);
  if (nextPlayableCells.length === 0) {
    // if the next player cannot play, check if the last player can play again
    const nextNextPlayableCells = getPlayableCells(
      board,
      nextTurn === 1 ? 0 : 1
    );
    if (nextNextPlayableCells.length === 0) {
      return null;
    } else {
      return nextTurn === 1 ? 0 : 1;
    }
  } else {
    return nextTurn;
  }
}

function checkWinState(board: board) {
  const player1Score = getScore(board, 0);
  const player2Score = getScore(board, 1);
  if (player1Score > player2Score) return "Player 1 wins!";
  if (player2Score > player1Score) return "Player 2 wins!";
  if (player1Score === player2Score) return "It's a tie!";
}

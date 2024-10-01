import prisma from "../app/client";
import { generateBoard } from "../services/boardService";

export async function reset() {
  try {
    await prisma.game.deleteMany();
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}

export async function createTestGame(size: number = 8) {
  try {
    const game = await prisma.game.create({
      data: {
        gameStatus: "in progress",
        board: JSON.stringify(generateBoard(size)),
      },
    });
    return game;
  } catch (error) {
    console.error("Error generating test game:", error);
  } finally {
    await prisma.$disconnect();
  }
}

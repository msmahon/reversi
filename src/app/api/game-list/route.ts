import prisma from "@/app/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      select: { id: true, player1Id: true, player2Id: true, gameStatus: true },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching game list:", error);
    return NextResponse.error();
  } finally {
    prisma.$disconnect();
  }
}

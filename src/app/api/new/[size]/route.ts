import { NextResponse } from "next/server";
import { generateNewGame } from "../../../../services/gameService";

export async function GET(
  request: Request,
  { params }: { params: { size: number } }
) {
  const gameId = await generateNewGame(params.size);
  return NextResponse.json({ uuid: gameId });
}

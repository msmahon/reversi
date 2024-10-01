import { NextResponse } from "next/server";
import { play } from "../../../../../../services/gameService";

export async function POST(
  request: Request,
  { params }: { params: { uuid: string; row: number; column: number } }
) {
  await play(params.uuid, params.row, params.column);
  return NextResponse.json({});
}

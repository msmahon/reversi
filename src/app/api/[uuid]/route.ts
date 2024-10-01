import { NextResponse } from "next/server";
import { getGameData } from "../../../services/gameService";

export function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const data = getGameData(params.uuid);
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { getGameData, getActivityLog } from "@/services/gameService";

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const data = await getGameData(params.uuid);
  const activityLog = getActivityLog(params.uuid);
  return NextResponse.json({ ...data, activityLog });
}

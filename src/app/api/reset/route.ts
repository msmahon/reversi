import { reset } from "@/utilities/db";
import { NextResponse } from "next/server";

export async function GET() {
  await reset();
  return new NextResponse();
}

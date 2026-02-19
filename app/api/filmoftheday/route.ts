import { NextResponse } from "next/server";
import { getFilmOfDayCard } from "@/lib/reel/feed";

export async function GET() {
  const item = await getFilmOfDayCard();
  return NextResponse.json({ item });
}

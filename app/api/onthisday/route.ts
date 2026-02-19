import { NextResponse } from "next/server";
import { fetchOnThisDayCards } from "@/lib/reel/on-this-day";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await fetchOnThisDayCards(8);
  return NextResponse.json({ items });
}

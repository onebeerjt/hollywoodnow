import { NextRequest, NextResponse } from "next/server";
import { getFeedPage } from "@/lib/reel/feed";
import type { FeedFilter } from "@/lib/reel/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const filter = (searchParams.get("filter") ?? "all") as FeedFilter;

  const data = await getFeedPage(Number.isFinite(page) && page > 0 ? page : 1, filter);
  return NextResponse.json(data);
}

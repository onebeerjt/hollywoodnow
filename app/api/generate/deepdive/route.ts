import { NextRequest, NextResponse } from "next/server";
import { generateDeepDive } from "@/lib/reel/anthropic";

export async function GET(request: NextRequest) {
  const topic = new URL(request.url).searchParams.get("topic")?.trim();
  if (!topic) {
    return NextResponse.json({ error: "Missing topic" }, { status: 400 });
  }

  try {
    const article = await generateDeepDive(topic);
    return NextResponse.json({ topic, ...article });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate deep dive" },
      { status: 500 }
    );
  }
}

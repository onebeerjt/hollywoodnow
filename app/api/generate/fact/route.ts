import { NextRequest, NextResponse } from "next/server";
import { generateFact } from "@/lib/reel/anthropic";

export async function GET(request: NextRequest) {
  const topic = new URL(request.url).searchParams.get("topic")?.trim();
  if (!topic) {
    return NextResponse.json({ error: "Missing topic" }, { status: 400 });
  }

  try {
    const fact = await generateFact(topic);
    return NextResponse.json({ topic, fact });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate fact" },
      { status: 500 }
    );
  }
}

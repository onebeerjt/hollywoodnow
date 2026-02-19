import { NextRequest, NextResponse } from "next/server";
import { getDirectorSpotlight } from "@/lib/reel/tmdb";
import { seedContent } from "@/lib/reel/seed";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid director id" }, { status: 400 });
  }

  const seed = seedContent.directors.find((director) => director.id === id);
  const fallback = seed?.funFact ?? "A defining voice in film form and tone.";

  const payload = await getDirectorSpotlight(id, fallback);
  if (!payload) {
    return NextResponse.json(
      {
        id,
        name: seed?.name ?? "Unknown Director",
        timeline: [],
        funFact: fallback,
        quote: "This director's career arc is unavailable without TMDB API access."
      },
      { status: 200 }
    );
  }

  return NextResponse.json(payload);
}

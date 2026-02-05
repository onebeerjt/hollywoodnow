import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "Latest Film integration is not configured yet."
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300"
      }
    }
  );
}

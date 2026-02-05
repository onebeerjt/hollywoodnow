import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "Now Playing integration is not configured yet."
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

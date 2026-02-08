import { NextResponse } from "next/server";
import { getCategories } from "@/lib/bigcommerce";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ data: categories });
}

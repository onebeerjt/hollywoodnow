import { NextResponse } from "next/server";
import { z } from "zod";
import { getProducts } from "@/lib/bigcommerce";

const querySchema = z.object({
  category: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    page: searchParams.get("page") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const products = await getProducts({
    categoryId: parsed.data.category,
    page: parsed.data.page
  });

  return NextResponse.json({ data: products });
}

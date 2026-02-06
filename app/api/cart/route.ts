import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createCart, getCart } from "@/lib/bigcommerce";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  line_items: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        variant_id: z.number().int().positive().optional(),
        quantity: z.number().int().positive()
      })
    )
    .optional()
});

const CART_COOKIE = "bc_cart_id";

export async function POST(request: Request) {
  const limiter = rateLimit({
    key: `cart:create:${getClientIp(request.headers)}`,
    limit: 10,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limiter.resetAt - Date.now()) / 1000))
        }
      }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cart = await createCart(parsed.data);

  cookies().set({
    name: CART_COOKIE,
    value: cart.id,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return NextResponse.json({ data: cart });
}

export async function GET(request: Request) {
  const limiter = rateLimit({
    key: `cart:read:${getClientIp(request.headers)}`,
    limit: 30,
    windowMs: 60_000
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limiter.resetAt - Date.now()) / 1000))
        }
      }
    );
  }

  const cartId = cookies().get(CART_COOKIE)?.value;
  if (!cartId) {
    return NextResponse.json({ data: null });
  }

  const cart = await getCart(cartId);
  return NextResponse.json({ data: cart });
}

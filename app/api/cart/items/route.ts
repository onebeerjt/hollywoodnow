import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { addToCart, updateCartItem, removeCartItem } from "@/lib/bigcommerce";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const CART_COOKIE = "bc_cart_id";

const addSchema = z.object({
  line_items: z.array(
    z.object({
      product_id: z.number().int().positive(),
      variant_id: z.number().int().positive().optional(),
      quantity: z.number().int().positive()
    })
  )
});

const updateSchema = z.object({
  item_id: z.string().min(1),
  quantity: z.number().int().positive()
});

const removeSchema = z.object({
  item_id: z.string().min(1)
});

function getCartId() {
  return cookies().get(CART_COOKIE)?.value;
}

function rateLimitOrThrow(request: Request, action: string) {
  const limiter = rateLimit({
    key: `cart:${action}:${getClientIp(request.headers)}`,
    limit: 20,
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

  return null;
}

export async function POST(request: Request) {
  const limited = rateLimitOrThrow(request, "add");
  if (limited) return limited;

  const cartId = getCartId();
  if (!cartId) {
    return NextResponse.json({ error: "Missing cart" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cart = await addToCart({ cartId, line_items: parsed.data.line_items });
  return NextResponse.json({ data: cart });
}

export async function PATCH(request: Request) {
  const limited = rateLimitOrThrow(request, "update");
  if (limited) return limited;

  const cartId = getCartId();
  if (!cartId) {
    return NextResponse.json({ error: "Missing cart" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cart = await updateCartItem({
    cartId,
    itemId: parsed.data.item_id,
    quantity: parsed.data.quantity
  });

  return NextResponse.json({ data: cart });
}

export async function DELETE(request: Request) {
  const limited = rateLimitOrThrow(request, "remove");
  if (limited) return limited;

  const cartId = getCartId();
  if (!cartId) {
    return NextResponse.json({ error: "Missing cart" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const cart = await removeCartItem({
    cartId,
    itemId: parsed.data.item_id
  });

  return NextResponse.json({ data: cart });
}

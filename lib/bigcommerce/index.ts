import "server-only";
import { env } from "../env";

type BigCommerceResponse<T> = {
  data: T;
  meta?: unknown;
};

type Category = {
  id: number;
  name: string;
  is_visible?: boolean;
};

type Product = {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  brand_id?: number;
  custom_url?: { url?: string };
  description?: string;
  images?: Array<{ url_standard?: string; url_thumbnail?: string }>;
};

type Cart = {
  id: string;
  line_items?: {
    physical_items?: Array<{
      id: string;
      product_id: number;
      name: string;
      quantity: number;
      list_price?: number;
    }>;
    digital_items?: Array<{
      id: string;
      product_id: number;
      name: string;
      quantity: number;
      list_price?: number;
    }>;
    custom_items?: Array<{
      id: string;
      name: string;
      quantity: number;
      list_price?: number;
    }>;
  };
};

const API_BASE = `${env.BIGCOMMERCE_API_URL}/stores/${env.BIGCOMMERCE_STORE_HASH}/v3`;

async function bcFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`BigCommerce error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  const result = await bcFetch<BigCommerceResponse<Category[]>>(
    `/catalog/categories?is_visible=true&limit=250`
  );
  return result.data;
}

export async function getProducts(options?: {
  categoryId?: number;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const params = new URLSearchParams({
    is_visible: "true",
    include: "images",
    page: String(options?.page ?? 1),
    limit: String(options?.limit ?? 12)
  });

  if (options?.categoryId) {
    params.set("categories:in", String(options.categoryId));
  }

  if (env.BIGCOMMERCE_CHANNEL_ID) {
    params.set("channel_id", String(env.BIGCOMMERCE_CHANNEL_ID));
  }

  const result = await bcFetch<BigCommerceResponse<Product[]>>(
    `/catalog/products?${params.toString()}`
  );
  return result.data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  const limit = 250;
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      is_visible: "true",
      include: "images",
      page: String(page),
      limit: String(limit)
    });

    if (env.BIGCOMMERCE_CHANNEL_ID) {
      params.set("channel_id", String(env.BIGCOMMERCE_CHANNEL_ID));
    }

    const result = await bcFetch<BigCommerceResponse<Product[]>>(
      `/catalog/products?${params.toString()}`
    );

    const match = result.data.find(
      (product) => product.custom_url?.url === normalized
    );
    if (match) {
      return match;
    }

    if (!result.data.length || result.data.length < limit) {
      return null;
    }

    page += 1;
  }
}

export async function createCart(input?: {
  line_items?: Array<{ product_id: number; variant_id?: number; quantity: number }>;
}): Promise<Cart> {
  const payload = {
    channel_id: env.BIGCOMMERCE_CHANNEL_ID,
    line_items: input?.line_items ?? []
  };

  const result = await bcFetch<BigCommerceResponse<Cart>>(`/carts`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return result.data;
}

export async function getCart(cartId: string): Promise<Cart> {
  const include = [
    "line_items.physical_items",
    "line_items.digital_items",
    "line_items.custom_items"
  ].join(",");
  const result = await bcFetch<BigCommerceResponse<Cart>>(
    `/carts/${cartId}?include=${encodeURIComponent(include)}`
  );
  return result.data;
}

export async function addToCart(input: {
  cartId: string;
  line_items: Array<{ product_id: number; variant_id?: number; quantity: number }>;
}): Promise<Cart> {
  const result = await bcFetch<BigCommerceResponse<Cart>>(
    `/carts/${input.cartId}/items`,
    {
      method: "POST",
      body: JSON.stringify({ line_items: input.line_items })
    }
  );

  return result.data;
}

export async function updateCartItem(input: {
  cartId: string;
  itemId: string;
  quantity: number;
}): Promise<Cart> {
  const result = await bcFetch<BigCommerceResponse<Cart>>(
    `/carts/${input.cartId}/items/${input.itemId}`,
    {
      method: "PUT",
      body: JSON.stringify({ line_item: { quantity: input.quantity } })
    }
  );

  return result.data;
}

export async function removeCartItem(input: {
  cartId: string;
  itemId: string;
}): Promise<Cart> {
  const result = await bcFetch<BigCommerceResponse<Cart>>(
    `/carts/${input.cartId}/items/${input.itemId}`,
    { method: "DELETE" }
  );

  return result.data;
}

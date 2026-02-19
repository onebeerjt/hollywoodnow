import { kv } from "@vercel/kv";

const localCache = new Map<string, string>();

export async function getCachedText(key: string): Promise<string | null> {
  if (localCache.has(key)) return localCache.get(key) ?? null;

  try {
    const value = await kv.get<string>(key);
    if (value) localCache.set(key, value);
    return value ?? null;
  } catch {
    return null;
  }
}

export async function setCachedText(key: string, value: string, ttlSeconds = 60 * 60 * 24 * 30): Promise<void> {
  localCache.set(key, value);
  try {
    await kv.set(key, value, { ex: ttlSeconds });
  } catch {
    // No-op fallback when KV is unavailable locally.
  }
}

import { z } from "zod";

const envSchema = z.object({
  BIGCOMMERCE_STORE_HASH: z.string().min(1, "Missing BIGCOMMERCE_STORE_HASH"),
  BIGCOMMERCE_ACCESS_TOKEN: z.string().min(1, "Missing BIGCOMMERCE_ACCESS_TOKEN"),
  BIGCOMMERCE_CHANNEL_ID: z.coerce
    .number()
    .int()
    .positive("BIGCOMMERCE_CHANNEL_ID must be a positive integer"),
  BIGCOMMERCE_API_URL: z
    .string()
    .default("https://api.bigcommerce.com")
    .transform((value) => value.replace(/\/$/, "")),
  NODE_ENV: z.enum(["development", "test", "production"]).optional()
});

export const env = envSchema.parse(process.env);

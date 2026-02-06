# Headless BigCommerce Store (Next.js App Router)

Minimal scaffold for a headless BigCommerce storefront running on Next.js (App Router) and Vercel. It provides a server-only BigCommerce client, API routes that proxy browser requests, and basic pages for products + cart testing.

## BigCommerce API Requirements
- API type: BigCommerce REST Management API (v3)
- Scopes (minimum):
  - `store_v2_products_read_only` (catalog read)
  - `store_cart` (create/update carts and line items)

## Environment Variables
Required:
- `BIGCOMMERCE_STORE_HASH`
- `BIGCOMMERCE_ACCESS_TOKEN`
- `BIGCOMMERCE_CHANNEL_ID`

Optional:
- `BIGCOMMERCE_API_URL` (defaults to `https://api.bigcommerce.com`)

Local setup:
1. Copy `.env.example` to `.env.local`.
2. Fill in the values from your BigCommerce store and API account.

Vercel setup:
1. Add the same keys in Vercel Project Settings → Environment Variables.
2. Never commit real values to git.

## What Must NEVER Reach the Client
- `BIGCOMMERCE_ACCESS_TOKEN`
- `BIGCOMMERCE_STORE_HASH`
- Any future checkout or admin secrets

These values are only read in server-only code under `lib/bigcommerce` and API route handlers.

## Cart + Checkout Strategy
This scaffold only handles cart creation and updates. When you are ready to take payments, redirect shoppers to BigCommerce’s hosted checkout to remain PCI-compliant. No payment handling is implemented here.

## Commands
- `npm install`
- `npm run dev`

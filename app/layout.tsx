import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Headless BigCommerce Store",
  description: "Minimal storefront scaffold for BigCommerce + Next.js"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  void env;
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

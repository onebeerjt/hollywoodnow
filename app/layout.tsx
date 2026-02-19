import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Reel",
  description: "An infinite film-history feed for cinema obsessives."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <div className="grain-overlay" aria-hidden />
        <nav className="top-nav">
          <Link href="/">Feed</Link>
          <Link href="/saved">Saved</Link>
          <Link href="/directors">Directors</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}

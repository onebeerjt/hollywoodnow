import type { Metadata } from "next";
import Link from "next/link";
import { NowPlayingBar } from "@/components/now-playing-bar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onebeer.io"),
  title: {
    default: "onebeer",
    template: "%s | onebeer"
  },
  description: "What JT has been writing, watching, and listening to lately.",
  openGraph: {
    title: "onebeer",
    description: "A lightweight personal hub for JT's latest writing, films, and music.",
    url: "https://onebeer.io",
    siteName: "onebeer"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <NowPlayingBar />
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-8 pt-6 sm:px-6">
          <header className="mb-10 border-b border-zinc-200 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link
                  href="/"
                  className="font-serif text-3xl font-semibold tracking-tight text-zinc-900"
                >
                  onebeer
                </Link>
                <p className="mt-1 text-sm text-zinc-600">JT (@onebeerjt)</p>
              </div>
              <nav className="flex items-center gap-5 text-sm font-medium text-zinc-700">
                <Link href="/" className="transition-colors hover:text-zinc-900">
                  Home
                </Link>
                <Link href="/blog" className="transition-colors hover:text-zinc-900">
                  Blog
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
            <p>Built with Next.js + Notion-first publishing workflow.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

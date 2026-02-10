import type { Metadata } from "next";
import { Bebas_Neue, Sora } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display"
});

const sans = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "ReelPulse Miami",
  description: "Miami showtimes, upcoming releases, and confidential screening radar."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  void env;
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

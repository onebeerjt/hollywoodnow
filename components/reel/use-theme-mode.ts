"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "broadsheet";

const STORAGE_KEY = "the-reel:theme";

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const next = stored === "broadsheet" ? "broadsheet" : "dark";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const updateMode = (next: ThemeMode) => {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return { mode, setMode: updateMode };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReelCard } from "@/lib/reel/types";

const STORAGE_KEY = "the-reel:saved-cards";

function parseSaved(input: string | null): ReelCard[] {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input) as ReelCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSavedCards() {
  const [saved, setSaved] = useState<ReelCard[]>([]);

  useEffect(() => {
    setSaved(parseSaved(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const sync = useCallback((next: ReelCard[]) => {
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("reel:saved-updated"));
  }, []);

  useEffect(() => {
    const onSavedUpdate = () => setSaved(parseSaved(localStorage.getItem(STORAGE_KEY)));
    window.addEventListener("reel:saved-updated", onSavedUpdate);
    return () => window.removeEventListener("reel:saved-updated", onSavedUpdate);
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return saved.some((item) => item.id === id);
    },
    [saved]
  );

  const toggleSaved = useCallback(
    (card: ReelCard) => {
      const exists = saved.some((item) => item.id === card.id);
      const next = exists ? saved.filter((item) => item.id !== card.id) : [card, ...saved];
      sync(next);
    },
    [saved, sync]
  );

  const groupedCount = useMemo(() => saved.length, [saved]);

  return { saved, groupedCount, isSaved, toggleSaved };
}

export function exportSavedDigest(cards: ReelCard[]): string {
  const byType = cards.reduce<Record<string, ReelCard[]>>((acc, card) => {
    const key = card.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {});

  const lines: string[] = ["THE REEL - SAVED DIGEST", ""];

  Object.entries(byType).forEach(([type, entries]) => {
    lines.push(type.toUpperCase());
    entries.forEach((entry) => {
      lines.push(`- ${entry.title}`);
      lines.push(`  ${entry.summary}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

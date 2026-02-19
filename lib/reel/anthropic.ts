import { getCachedText, setCachedText } from "@/lib/reel/cache";
import { readingTimeMinutes, slugify } from "@/lib/reel/utils";

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function callAnthropic(prompt: string, cacheKey: string): Promise<string> {
  const cached = await getCachedText(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Anthropic API key missing. Add ANTHROPIC_API_KEY to generate this content.";
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1200,
      temperature: 0.8,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic error (${response.status}): ${error}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content?.find((item) => item.type === "text")?.text?.trim();
  if (!text) throw new Error("Anthropic response missing text content");

  await setCachedText(cacheKey, text);
  return text;
}

export async function generateFact(topic: string): Promise<string> {
  const cleanTopic = topic.trim();
  const prompt = `Write a 3 sentence surprising and engaging film history fact about ${cleanTopic}. Write in a punchy, editorial tone. No filler. Start with the most interesting detail first.`;
  return callAnthropic(prompt, `reel:fact:${slugify(cleanTopic)}`);
}

export async function generateDeepDive(topic: string): Promise<{ body: string; readTime: number; slug: string }> {
  const cleanTopic = topic.trim();
  const prompt = `Write a 500 word editorial article about ${cleanTopic} in film history. Engaging, opinionated, written for a film nerd audience. Include specific names, dates, and details. No generic intros.`;
  const body = await callAnthropic(prompt, `reel:deepdive:${slugify(cleanTopic)}`);
  return { body, readTime: readingTimeMinutes(body), slug: slugify(cleanTopic) };
}

export async function generateWhyItMatters(filmTitle: string): Promise<string> {
  const prompt = `Write a 2-3 sentence "Why It Matters" blurb for the film ${filmTitle}. Focus on film history impact, style influence, and cultural legacy. Punchy editorial tone.`;
  return callAnthropic(prompt, `reel:why:${slugify(filmTitle)}`);
}

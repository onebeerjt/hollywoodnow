import type { BlogPost, BlogPostSummary } from "@/lib/types/content";

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  return [];
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  return [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  void slug;
  return null;
}

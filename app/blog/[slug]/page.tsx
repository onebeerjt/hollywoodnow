import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/notion/posts";

type BlogPostPageProps = {
  params: { slug: string };
};

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Blog post</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900">
          {post.title}
        </h1>
        <p className="text-sm text-zinc-600">Published {post.publishedAt ?? "TBD"}</p>
      </header>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
        <p className="text-sm leading-relaxed text-zinc-700">
          Full Notion block rendering will be added in the next integration step.
        </p>
      </div>
    </article>
  );
}

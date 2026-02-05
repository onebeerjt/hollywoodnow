import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest writing from JT"
};

export const revalidate = 300;

export default function BlogIndexPage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Blog</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-900">
          Latest writing
        </h1>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6">
        <p className="text-sm leading-relaxed text-zinc-700">
          This index will render published posts from the Notion database. No local mock posts are used in
          this scaffold so we can connect the real CMS cleanly.
        </p>
      </div>
    </section>
  );
}

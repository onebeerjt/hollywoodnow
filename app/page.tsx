export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          What&apos;s up lately
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Writing first. Watching and listening alongside it.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-700">
          onebeer is JT&apos;s personal hub at <span className="font-medium">onebeer.io</span>.
          Posts are published from Notion, and activity indicators keep the site feeling current.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-zinc-900">
            Latest writing
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Blog posts from the Notion CMS will appear here as the primary content stream.
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-zinc-900">
            Latest film
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            The most recent Letterboxd entry will be shown here with a direct link out.
          </p>
        </article>
      </section>
    </div>
  );
}

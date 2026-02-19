export default function Loading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-6 h-20 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--card)]/60" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--card)]/60" />
        ))}
      </div>
    </main>
  );
}

export function NowPlayingBar() {
  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-100 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <p className="font-medium uppercase tracking-[0.14em]">Now playing</p>
        <p className="truncate text-zinc-300">Waiting for Last.fm integration</p>
      </div>
    </div>
  );
}

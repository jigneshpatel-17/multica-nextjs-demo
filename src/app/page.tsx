export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Multica TODO</h1>
      <p className="text-slate-600">
        Scaffold ready. App Router + TypeScript strict + Tailwind v4.
      </p>
      <a
        href="/api/health"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Check /api/health
      </a>
    </main>
  );
}

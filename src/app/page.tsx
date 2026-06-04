import Link from "next/link";

const features = [
  {
    title: "Stay organized",
    description: "Group tasks by category and priority. Track due dates at a glance.",
  },
  {
    title: "See progress",
    description: "Dashboard with completion trends and overdue counts.",
  },
  {
    title: "Fast & accessible",
    description: "Server-rendered Next.js with keyboard navigation and ARIA support.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-base font-semibold text-slate-900">
            Multica TODO
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-slate-900 px-3 py-2 font-medium text-white hover:bg-slate-800"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              The simple, focused task manager.
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Capture tasks, set priorities, and watch your progress. Built with Next.js
              and MongoDB.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>
          </div>

          <ul className="mt-16 grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <h2 className="text-base font-semibold text-slate-900">{f.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Multica TODO
        </div>
      </footer>
    </div>
  );
}

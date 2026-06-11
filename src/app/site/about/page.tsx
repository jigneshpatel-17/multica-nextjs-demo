import type { Metadata } from "next";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.hero.lede,
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="site-reveal text-xs font-semibold uppercase tracking-[0.22em] text-clay-deep">
            {about.hero.eyebrow}
          </p>
          <h1
            className="site-reveal mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
            style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
          >
            {about.hero.title}
          </h1>
          <p
            className="site-reveal mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
          >
            {about.hero.lede}
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Our story
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            {about.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-parchment">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            What we stand for
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {about.values.map((value, i) => (
              <li
                key={value.title}
                className="rounded-lg border border-ink/10 bg-paper p-6"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-sm text-clay-deep"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {value.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            The team
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Placeholder people. Swap in real names, roles, and photos when ready.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {about.team.map((person) => (
              <li key={person.name}>
                <div
                  aria-hidden="true"
                  className="flex aspect-square items-center justify-center rounded-lg bg-fern/10 font-display text-3xl font-semibold text-fern"
                >
                  {person.initials}
                </div>
                <h3 className="mt-3 text-base font-semibold">{person.name}</h3>
                <p className="text-sm text-ink-soft">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

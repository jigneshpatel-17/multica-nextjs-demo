import Link from "next/link";
import { home, services } from "@/content/site";

export default function SiteHomePage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p
            className="site-reveal text-xs font-semibold uppercase tracking-[0.22em] text-clay-deep"
            style={{ "--reveal-delay": "0s" } as React.CSSProperties}
          >
            {home.hero.eyebrow}
          </p>
          <h1
            className="site-reveal mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
          >
            {home.hero.titleLead}{" "}
            <em className="font-light italic text-clay">{home.hero.titleAccent}</em>
          </h1>
          <p
            className="site-reveal mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
          >
            {home.hero.lede}
          </p>
          <div
            className="site-reveal mt-9 flex flex-wrap items-center gap-3"
            style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}
          >
            <Link
              href={home.hero.primaryCta.href}
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-clay-deep"
            >
              {home.hero.primaryCta.label}
            </Link>
            <Link
              href={home.hero.secondaryCta.href}
              className="inline-flex h-12 items-center rounded-full border border-ink/25 px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-parchment"
            >
              {home.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Studio facts" className="border-b border-ink/10 bg-parchment">
        <dl className="mx-auto grid max-w-6xl gap-px sm:grid-cols-3">
          {home.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-2 px-4 py-8 sm:px-6 sm:py-10"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                {stat.label}
              </dt>
              <dd className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {home.servicesHeading}
            </h2>
            <Link
              href="/site/services"
              className="hidden text-sm font-medium text-clay-deep underline decoration-clay/40 underline-offset-4 transition-colors hover:text-clay sm:inline"
            >
              All services
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/site/services#${service.slug}`}
                  className="group grid gap-2 py-6 transition-colors hover:bg-parchment sm:grid-cols-[4rem_1fr_2fr_auto] sm:items-baseline sm:gap-6 sm:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-sm text-clay-deep"
                  >
                    {service.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {service.summary}
                  </p>
                  <span
                    aria-hidden="true"
                    className="hidden text-clay-deep transition-transform group-hover:translate-x-1 sm:inline"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/site/services"
            className="mt-6 inline-block text-sm font-medium text-clay-deep underline decoration-clay/40 underline-offset-4 sm:hidden"
          >
            All services
          </Link>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            {home.ctaBand.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-paper/70">
            {home.ctaBand.body}
          </p>
          <Link
            href={home.ctaBand.cta.href}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-clay px-7 text-sm font-medium text-paper transition-colors hover:bg-clay-deep"
          >
            {home.ctaBand.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}

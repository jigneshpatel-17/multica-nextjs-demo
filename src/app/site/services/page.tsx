import type { Metadata } from "next";
import Link from "next/link";
import { services, servicesPage } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description: servicesPage.hero.lede,
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="site-reveal text-xs font-semibold uppercase tracking-[0.22em] text-clay-deep">
            {servicesPage.hero.eyebrow}
          </p>
          <h1
            className="site-reveal mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
            style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
          >
            {servicesPage.hero.title}
          </h1>
          <p
            className="site-reveal mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
          >
            {servicesPage.hero.lede}
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="divide-y divide-ink/10">
            {services.map((service) => (
              <li
                key={service.slug}
                id={service.slug}
                className="grid gap-6 py-12 scroll-mt-24 sm:py-16 md:grid-cols-[4rem_1fr_1fr]"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-lg text-clay-deep"
                >
                  {service.number}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
                    {service.summary}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Deliverables
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 text-sm text-ink"
                      >
                        <span aria-hidden="true" className="text-clay">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-parchment">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {servicesPage.process.heading}
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicesPage.process.steps.map((step) => (
              <li
                key={step.number}
                className="rounded-lg border border-ink/10 bg-paper p-6"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-sm text-clay-deep"
                >
                  {step.number}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Not sure which one you need?
          </p>
          <Link
            href="/site/contact"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-clay-deep"
          >
            Talk it through with us
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.hero.lede,
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="site-reveal text-xs font-semibold uppercase tracking-[0.22em] text-clay-deep">
            {contact.hero.eyebrow}
          </p>
          <h1
            className="site-reveal mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
            style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
          >
            {contact.hero.title}
          </h1>
          <p
            className="site-reveal mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
          >
            {contact.hero.lede}
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-24 lg:grid-cols-4">
          {contact.channels.map((channel) => (
            <div
              key={channel.label}
              className="rounded-lg border border-ink/10 bg-parchment p-6"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                {channel.label}
              </h2>
              <a
                href={channel.href}
                className="mt-3 block font-display text-lg font-semibold tracking-tight text-clay-deep underline decoration-clay/40 underline-offset-4 transition-colors hover:text-clay"
              >
                {channel.value}
              </a>
            </div>
          ))}

          <div className="rounded-lg border border-ink/10 bg-parchment p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {contact.office.label}
            </h2>
            <address className="mt-3 font-display text-lg font-semibold not-italic tracking-tight">
              {contact.office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="rounded-lg border border-ink/10 bg-parchment p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {contact.hours.label}
            </h2>
            <p className="mt-3 font-display text-lg font-semibold tracking-tight">
              {contact.hours.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-sm text-ink-soft">{contact.note}</p>
        </div>
      </section>
    </>
  );
}

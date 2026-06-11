import Link from "next/link";
import { brand, contact, footer, nav } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/15 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] md:py-16">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">
            {brand.name}
            <span aria-hidden="true" className="text-clay">
              .
            </span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
            {footer.blurb}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
            Pages
          </h2>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-paper/80 transition-colors hover:text-paper hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            {contact.channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} className="transition-colors hover:text-paper hover:underline">
                  {c.value}
                </a>
              </li>
            ))}
            {contact.office.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/50 sm:px-6">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}

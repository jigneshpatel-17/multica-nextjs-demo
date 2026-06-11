import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { brand } from "@/content/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${archivo.variable} flex min-h-screen flex-col bg-paper font-body text-ink`}
    >
      <a
        href="#site-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="site-main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

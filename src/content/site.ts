// All copy for the static site lives here so real content can be swapped in
// without touching page markup.

export const brand = {
  name: "Foxglove Studio",
  shortName: "Foxglove",
  tagline: "A digital studio for considered software",
  description:
    "Foxglove Studio is a placeholder brand for a design & engineering studio. Swap this copy with real content when it arrives.",
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Home", href: "/site" },
  { label: "About", href: "/site/about" },
  { label: "Services", href: "/site/services" },
  { label: "Contact", href: "/site/contact" },
];

export const home = {
  hero: {
    eyebrow: "Design & engineering studio",
    titleLead: "Software built with",
    titleAccent: "a point of view.",
    lede: "We design and build digital products that are fast, accessible, and unmistakably yours. Placeholder copy — your story goes here.",
    primaryCta: { label: "Start a project", href: "/site/contact" },
    secondaryCta: { label: "See our services", href: "/site/services" },
  },
  stats: [
    { value: "12+", label: "Years in practice" },
    { value: "80", label: "Projects shipped" },
    { value: "100%", label: "Static, no servers" },
  ],
  servicesHeading: "What we do",
  ctaBand: {
    title: "Have a project in mind?",
    body: "Tell us where you want to go. We'll help you chart the route.",
    cta: { label: "Get in touch", href: "/site/contact" },
  },
} as const;

export const services = [
  {
    slug: "strategy",
    number: "01",
    title: "Product strategy",
    summary:
      "Workshops and research that turn a vague idea into a roadmap your team can actually execute.",
    deliverables: ["Discovery workshops", "User research", "Roadmaps & briefs"],
  },
  {
    slug: "design",
    number: "02",
    title: "Interface design",
    summary:
      "Design systems and interfaces with typographic care — built to be implemented, not just admired.",
    deliverables: ["Design systems", "Prototypes", "Accessibility reviews"],
  },
  {
    slug: "engineering",
    number: "03",
    title: "Web engineering",
    summary:
      "Production-grade sites and apps on modern frameworks. Performance budgets are part of the contract.",
    deliverables: ["Next.js & React builds", "Static & edge delivery", "Performance audits"],
  },
  {
    slug: "content",
    number: "04",
    title: "Content systems",
    summary:
      "Structured content that editors enjoy using and that survives the next redesign.",
    deliverables: ["Content modelling", "CMS integration", "Migration support"],
  },
] as const;

export const about = {
  hero: {
    eyebrow: "About the studio",
    title: "Small studio, sharp focus.",
    lede: "Placeholder narrative: who you are, why you exist, and what you refuse to compromise on.",
  },
  story: [
    "Foxglove Studio began as a two-person practice with one rule: ship work we would sign our names to. This paragraph is placeholder copy waiting for your real origin story.",
    "Today the studio remains deliberately small. Fewer projects, deeper involvement, and a bias for the simplest thing that works — usually a fast, static site like this one.",
  ],
  values: [
    {
      title: "Clarity first",
      body: "If a sentence, screen, or system can be simpler, it should be.",
    },
    {
      title: "Accessible by default",
      body: "Semantic HTML, keyboard support, and real contrast — not bolted on later.",
    },
    {
      title: "Performance is design",
      body: "A slow site is a broken site. We treat speed as a feature with a budget.",
    },
    {
      title: "Honest scope",
      body: "We would rather cut scope than cut corners, and we say so early.",
    },
  ],
  team: [
    { name: "Avery Lane", role: "Principal, Design", initials: "AL" },
    { name: "Rowan Hart", role: "Principal, Engineering", initials: "RH" },
    { name: "Sam Reyes", role: "Producer", initials: "SR" },
    { name: "Jules Park", role: "Engineer", initials: "JP" },
  ],
} as const;

export const servicesPage = {
  hero: {
    eyebrow: "Services",
    title: "Four disciplines, one team.",
    lede: "Engagements are scoped around outcomes, not hours. Placeholder copy — describe your real offerings here.",
  },
  process: {
    heading: "How an engagement runs",
    steps: [
      { number: "01", title: "Listen", body: "A short discovery sprint to understand goals, constraints, and users." },
      { number: "02", title: "Shape", body: "We propose the smallest version of the work that delivers the outcome." },
      { number: "03", title: "Build", body: "Weekly demos of working software — no big reveals, no surprises." },
      { number: "04", title: "Hand over", body: "Documentation, training, and a codebase your team can own." },
    ],
  },
} as const;

export const contact = {
  hero: {
    eyebrow: "Contact",
    title: "Say hello.",
    lede: "This page is informational only — there is no form backend. Reach us through any channel below.",
  },
  channels: [
    { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
    { label: "Phone", value: "+1 (555) 010-0199", href: "tel:+15550100199" },
  ],
  office: {
    label: "Studio",
    lines: ["100 Placeholder Lane", "Suite 4", "Portland, OR 97201"],
  },
  hours: {
    label: "Hours",
    lines: ["Monday – Friday", "9:00 – 17:00 PT"],
  },
  note: "Replace these details with real contact information before launch.",
} as const;

export const footer = {
  blurb: "A placeholder studio site built as a static foundation. Every word on it is ready to be replaced.",
  legal: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
} as const;

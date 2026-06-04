"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";

interface Item {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (path: string) => boolean;
}

const items: Item[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
        <path d="M3 10l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9v8h10V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
        <path d="M5 5h10M5 10h10M5 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    match: (p) => p === "/tasks" || p.startsWith("/tasks/"),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface Props {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-slate-200 px-5">
        <Link href="/dashboard" className="text-base font-semibold text-slate-900">
          Multica TODO
        </Link>
      </div>
      <ul className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.match
            ? item.match(pathname ?? "")
            : pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

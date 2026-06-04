"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Dropdown } from "@/components/ui/Dropdown";

interface Props {
  onOpenSidebar: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopBar({ onOpenSidebar }: Props) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="inline-flex size-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:hidden"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-5">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/dashboard" className="text-base font-semibold text-slate-900 md:hidden">
          Multica TODO
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <Dropdown
            label="Account menu"
            trigger={
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {initials(user.name) || "?"}
                </span>
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  {user.name}
                </span>
              </span>
            }
            items={[
              {
                key: "profile",
                label: "Profile",
                onSelect: () => {
                  window.location.assign("/profile");
                },
              },
              {
                key: "logout",
                label: "Sign out",
                onSelect: () => {
                  void logout();
                },
              },
            ]}
          />
        )}
      </div>
    </header>
  );
}

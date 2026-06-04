"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";

export interface DropdownItem {
  key: string;
  label: ReactNode;
  onSelect: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  label?: string;
}

export function Dropdown({ trigger, items, align = "right", label = "Menu" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-md px-2 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-30 mt-1 min-w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((it) => (
            <button
              key={it.key}
              role="menuitem"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false);
                it.onSelect();
              }}
              className={cn(
                "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
                it.danger ? "text-rose-600" : "text-slate-700",
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

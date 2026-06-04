"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "./cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative w-full overflow-hidden rounded-lg bg-white shadow-xl outline-none",
          sizes[size],
        )}
      >
        <div className="px-5 pt-5">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-1 text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
        {children && <div className="px-5 py-4">{children}</div>}
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

const base =
  "block w-full appearance-none rounded-md border bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          base,
          invalid
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
            : "border-slate-300 focus:border-slate-500 focus:ring-slate-200",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        fill="currentColor"
      >
        <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});

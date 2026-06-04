import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const base =
  "block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, className, rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          base,
          invalid
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
            : "border-slate-300 focus:border-slate-500 focus:ring-slate-200",
          className,
        )}
        {...rest}
      />
    );
  },
);

import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type Tone = "error" | "warning" | "success" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}

const tones: Record<Tone, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export function Alert({ tone = "info", title, children, className, ...rest }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-3 py-2 text-sm", tones[tone], className)}
      {...rest}
    >
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={cn(title && "mt-1")}>{children}</div>}
    </div>
  );
}

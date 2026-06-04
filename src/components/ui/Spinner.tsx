import { cn } from "./cn";

export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const dim = size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-6";
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-slate-300 border-r-slate-700",
        dim,
        className,
      )}
    />
  );
}

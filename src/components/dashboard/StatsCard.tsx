import { Card } from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

interface Props {
  label: string;
  value: number;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
}

const tones = {
  neutral: "text-slate-900",
  info: "text-sky-700",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
} as const;

export function StatsCard({ label, value, tone = "neutral" }: Props) {
  return (
    <Card className="px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn("mt-1 text-3xl font-semibold tabular-nums", tones[tone])}>
        {value}
      </p>
    </Card>
  );
}

import type { CompletionTrendPoint } from "@/types/api";
import { EmptyState } from "@/components/ui/EmptyState";

interface Props {
  data: CompletionTrendPoint[];
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return WEEKDAY[d.getUTCDay()] ?? "";
}

export function WeeklyTrendChart({ data }: Props) {
  const total = data.reduce((acc, p) => acc + p.count, 0);
  if (total === 0) {
    return (
      <EmptyState
        title="No completions yet this week"
        description="Mark a task complete to see your weekly trend."
      />
    );
  }

  const max = Math.max(...data.map((p) => p.count), 1);
  const width = 560;
  const height = 200;
  const padding = { top: 16, right: 16, bottom: 28, left: 28 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const barW = innerW / data.length;

  return (
    <figure>
      <figcaption className="sr-only">
        Completed tasks by day, last 7 days
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Weekly completion trend"
        className="h-48 w-full"
      >
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - t)}
            y2={padding.top + innerH * (1 - t)}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        ))}
        {data.map((p, i) => {
          const h = (p.count / max) * innerH;
          const x = padding.left + i * barW + barW * 0.15;
          const y = padding.top + innerH - h;
          const w = barW * 0.7;
          return (
            <g key={p.date}>
              <rect x={x} y={y} width={w} height={h} rx={3} fill="#0f172a">
                <title>{`${p.date}: ${p.count} completed`}</title>
              </rect>
              <text
                x={x + w / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {dayLabel(p.date)}
              </text>
            </g>
          );
        })}
        <text x={padding.left - 6} y={padding.top + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
          {max}
        </text>
        <text x={padding.left - 6} y={padding.top + innerH} textAnchor="end" fontSize="10" fill="#94a3b8">
          0
        </text>
      </svg>
      <ul className="sr-only">
        {data.map((p) => (
          <li key={p.date}>
            {p.date}: {p.count} completed
          </li>
        ))}
      </ul>
    </figure>
  );
}

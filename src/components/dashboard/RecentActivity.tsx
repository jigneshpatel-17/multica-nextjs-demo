import Link from "next/link";
import type { PublicTask } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { statusTone, priorityTone, formatDateTime } from "@/components/tasks/format";

interface Props {
  tasks: PublicTask[];
}

export function RecentActivity({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        description="Create your first task to get started."
      />
    );
  }
  return (
    <ul className="divide-y divide-slate-200">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-start justify-between gap-3 py-3">
          <div className="min-w-0">
            <Link
              href={`/tasks/${t.id}`}
              className="block truncate text-sm font-medium text-slate-900 hover:underline"
            >
              {t.title}
            </Link>
            <p className="mt-0.5 text-xs text-slate-500">
              Updated {formatDateTime(t.updatedAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
            <Badge tone={statusTone(t.status)}>{t.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}

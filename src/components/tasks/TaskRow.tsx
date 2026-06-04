"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ApiError } from "@/services/api";
import { toggleTaskStatus } from "@/services/tasks";
import type { PublicTask } from "@/types/api";
import { cn } from "@/components/ui/cn";
import {
  formatDate,
  isOverdue,
  priorityTone,
  statusTone,
} from "./format";

interface Props {
  task: PublicTask;
  onUpdated: (task: PublicTask) => void;
  onDelete: (task: PublicTask) => void;
  onError: (message: string) => void;
}

export function TaskRow({ task, onUpdated, onDelete, onError }: Props) {
  const [toggling, setToggling] = useState(false);
  const completed = task.status === "Completed";
  const overdue = isOverdue(task);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { task: updated } = await toggleTaskStatus(task.id);
      onUpdated(updated);
    } catch (e) {
      onError(e instanceof ApiError ? e.message : "Failed to update task");
    } finally {
      setToggling(false);
    }
  };

  return (
    <li className="flex items-start gap-3 p-4 hover:bg-slate-50 sm:items-center">
      <input
        type="checkbox"
        checked={completed}
        disabled={toggling}
        onChange={handleToggle}
        aria-label={completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
        className="mt-1 size-4 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-slate-500 sm:mt-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/tasks/${task.id}`}
            className={cn(
              "truncate text-sm font-medium hover:underline",
              completed ? "text-slate-400 line-through" : "text-slate-900",
            )}
          >
            {task.title}
          </Link>
          {task.category && (
            <Badge tone="neutral">{task.category}</Badge>
          )}
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
          <Badge tone={statusTone(task.status)}>{task.status}</Badge>
          <span className={cn("inline-flex items-center gap-1", overdue && "text-rose-600")}>
            Due {formatDate(task.dueDate)}
            {overdue && <span className="font-medium">· overdue</span>}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Link href={`/tasks/${task.id}`}>
          <Button size="sm" variant="ghost" aria-label={`Edit ${task.title}`}>
            Edit
          </Button>
        </Link>
        <Dropdown
          label={`Actions for ${task.title}`}
          trigger={
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5">
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          }
          items={[
            {
              key: "edit",
              label: "Edit",
              onSelect: () => {
                window.location.assign(`/tasks/${task.id}`);
              },
            },
            {
              key: "delete",
              label: "Delete",
              danger: true,
              onSelect: () => onDelete(task),
            },
          ]}
        />
      </div>
    </li>
  );
}

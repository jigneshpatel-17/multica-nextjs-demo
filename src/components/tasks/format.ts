import type { TaskPriority, TaskStatus } from "@/types/api";

export function statusTone(status: TaskStatus): "neutral" | "info" | "success" | "warning" {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    case "Pending":
    default:
      return "warning";
  }
}

export function priorityTone(priority: TaskPriority): "neutral" | "info" | "warning" | "danger" {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
    default:
      return "neutral";
  }
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFmt.format(d);
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dateTimeFmt.format(d);
}

export function isOverdue(task: { dueDate: string | null; status: TaskStatus }): boolean {
  if (!task.dueDate) return false;
  if (task.status === "Completed") return false;
  return new Date(task.dueDate).getTime() < Date.now();
}

export function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function fromDateInputValue(value: string): string | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

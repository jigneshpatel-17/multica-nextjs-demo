import type { TaskDocument } from "@/models/Task";

export interface PublicTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toPublicTask(task: TaskDocument): PublicTask {
  return {
    id: String(task._id),
    userId: String(task.userId),
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    category: task.category ?? null,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

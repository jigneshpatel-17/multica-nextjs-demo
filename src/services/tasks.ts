import { apiFetch, buildQuery } from "./api";
import type {
  PublicTask,
  TaskCreatePayload,
  TaskListQuery,
  TaskListResponse,
  TaskStatus,
  TaskUpdatePayload,
} from "@/types/api";

export function listTasks(query: TaskListQuery = {}, signal?: AbortSignal) {
  return apiFetch<TaskListResponse>(
    `/api/tasks${buildQuery(query as Record<string, unknown>)}`,
    { signal },
  );
}

export function getTask(id: string, signal?: AbortSignal) {
  return apiFetch<{ task: PublicTask }>(`/api/tasks/${id}`, { signal });
}

export function createTask(payload: TaskCreatePayload) {
  return apiFetch<{ task: PublicTask }>("/api/tasks", {
    method: "POST",
    body: payload,
  });
}

export function updateTask(id: string, payload: TaskUpdatePayload) {
  return apiFetch<{ task: PublicTask }>(`/api/tasks/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteTask(id: string) {
  return apiFetch<{ success: true }>(`/api/tasks/${id}`, { method: "DELETE" });
}

export function toggleTaskStatus(id: string, status?: TaskStatus) {
  return apiFetch<{ task: PublicTask }>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: status ? { status } : {},
  });
}

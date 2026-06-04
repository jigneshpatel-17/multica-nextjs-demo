import { apiFetch } from "./api";
import type { DashboardResponse } from "@/types/api";

export function getDashboard(signal?: AbortSignal) {
  return apiFetch<DashboardResponse>("/api/dashboard/stats", { signal });
}

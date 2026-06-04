"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import * as tasksService from "@/services/tasks";
import type {
  Pagination,
  PublicTask,
  TaskListQuery,
} from "@/types/api";

interface State {
  tasks: PublicTask[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initial: State = {
  tasks: [],
  pagination: null,
  loading: true,
  error: null,
};

export function useTasks(query: TaskListQuery) {
  const [state, setState] = useState<State>(initial);

  const fetchTasks = useCallback(
    async (signal?: AbortSignal) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await tasksService.listTasks(query, signal);
        setState({
          tasks: data.tasks,
          pagination: data.pagination,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg =
          e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed to load tasks";
        setState((s) => ({ ...s, loading: false, error: msg }));
      }
    },
    [query],
  );

  useEffect(() => {
    const ctl = new AbortController();
    fetchTasks(ctl.signal);
    return () => ctl.abort();
  }, [fetchTasks]);

  const refresh = useCallback(() => fetchTasks(), [fetchTasks]);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.filter((t) => t.id !== id),
      pagination: s.pagination
        ? { ...s.pagination, total: Math.max(0, s.pagination.total - 1) }
        : s.pagination,
    }));
  }, []);

  const replaceTask = useCallback((updated: PublicTask) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  }, []);

  return { ...state, refresh, removeTask, replaceTask };
}

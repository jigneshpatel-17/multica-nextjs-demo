"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import {
  TaskFilters,
  EMPTY_FILTERS,
  filtersToQuery,
  type FilterValues,
} from "@/components/tasks/TaskFilters";
import { TaskRow } from "@/components/tasks/TaskRow";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { useTasks } from "@/hooks/useTasks";
import type { PublicTask } from "@/types/api";

export default function TasksPage() {
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicTask | null>(null);

  const query = useMemo(
    () => ({ ...filtersToQuery(filters), page, limit: 10 }),
    [filters, page],
  );

  const { tasks, pagination, loading, error, refresh, removeTask, replaceTask } =
    useTasks(query);

  const onFiltersChange = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-600">
            Filter, search, and manage all your tasks.
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>New task</Button>
        </Link>
      </div>

      <TaskFilters values={filters} onChange={onFiltersChange} />

      {actionError && <Alert tone="error">{actionError}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      <Card>
        <CardHeader>
          <CardTitle>All tasks</CardTitle>
          <Button variant="ghost" size="sm" onClick={refresh} aria-label="Refresh tasks">
            Refresh
          </Button>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No tasks match your filters"
                description="Try clearing filters or creating a new task."
                action={
                  <Link href="/tasks/new">
                    <Button>New task</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onUpdated={replaceTask}
                  onDelete={(t) => setDeleteTarget(t)}
                  onError={(m) => setActionError(m)}
                />
              ))}
            </ul>
          )}
        </CardBody>
        {pagination && (
          <div className="border-t border-slate-200 px-5 py-3">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <DeleteTaskDialog
        open={Boolean(deleteTarget)}
        taskId={deleteTarget?.id ?? null}
        taskTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(id) => removeTask(id)}
      />
    </div>
  );
}

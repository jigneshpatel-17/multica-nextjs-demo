"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskListQuery,
  type TaskPriority,
  type TaskSort,
  type TaskStatus,
} from "@/types/api";

const SORTS: { value: TaskSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
];

export interface FilterValues {
  q: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  category: string;
  dueBefore: string;
  sort: TaskSort;
}

export const EMPTY_FILTERS: FilterValues = {
  q: "",
  status: "",
  priority: "",
  category: "",
  dueBefore: "",
  sort: "latest",
};

export function filtersToQuery(values: FilterValues): TaskListQuery {
  const q: TaskListQuery = { sort: values.sort };
  if (values.q.trim()) q.q = values.q.trim();
  if (values.status) q.status = values.status;
  if (values.priority) q.priority = values.priority;
  if (values.category.trim()) q.category = values.category.trim();
  if (values.dueBefore) {
    const d = new Date(`${values.dueBefore}T23:59:59.999Z`);
    if (!Number.isNaN(d.getTime())) q.dueBefore = d.toISOString();
  }
  return q;
}

interface Props {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

export function TaskFilters({ values, onChange }: Props) {
  const [search, setSearch] = useState(values.q);

  useEffect(() => {
    setSearch(values.q);
  }, [values.q]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (search !== values.q) onChange({ ...values, q: search });
    }, 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasActive =
    values.q || values.status || values.priority || values.category || values.dueBefore;

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <FormField label="Search" className="lg:col-span-2">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title or description"
          />
        </FormField>
        <FormField label="Status">
          <Select
            value={values.status}
            onChange={(e) =>
              onChange({ ...values, status: e.target.value as TaskStatus | "" })
            }
          >
            <option value="">All</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Priority">
          <Select
            value={values.priority}
            onChange={(e) =>
              onChange({ ...values, priority: e.target.value as TaskPriority | "" })
            }
          >
            <option value="">All</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Category">
          <Input
            value={values.category}
            onChange={(e) => onChange({ ...values, category: e.target.value })}
            placeholder="e.g. Work"
          />
        </FormField>
        <FormField label="Due before">
          <Input
            type="date"
            value={values.dueBefore}
            onChange={(e) => onChange({ ...values, dueBefore: e.target.value })}
          />
        </FormField>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FormField label="Sort by" className="min-w-40">
          <Select
            value={values.sort}
            onChange={(e) =>
              onChange({ ...values, sort: e.target.value as TaskSort })
            }
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>
        {hasActive && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

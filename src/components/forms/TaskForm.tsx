"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type PublicTask,
  type TaskCreatePayload,
  type TaskPriority,
  type TaskStatus,
  type TaskUpdatePayload,
} from "@/types/api";
import { fromDateInputValue, toDateInputValue } from "@/components/tasks/format";

interface Props {
  mode: "create" | "edit";
  initial?: PublicTask | null;
  submitting: boolean;
  error: string | null;
  fields: Record<string, string>;
  onSubmit: (payload: TaskCreatePayload | TaskUpdatePayload) => Promise<void> | void;
  onCancel: () => void;
}

export function TaskForm({
  mode,
  initial,
  submitting,
  error,
  fields,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? "Medium");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "Pending");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [dueDate, setDueDate] = useState<string>(toDateInputValue(initial?.dueDate ?? null));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: TaskCreatePayload | TaskUpdatePayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category: category.trim() ? category.trim() : null,
      dueDate: fromDateInputValue(dueDate),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      <FormField label="Title" error={fields.title} required>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          autoFocus
          invalid={Boolean(fields.title)}
        />
      </FormField>

      <FormField label="Description" error={fields.description}>
        <Textarea
          name="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          invalid={Boolean(fields.description)}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Priority" error={fields.priority}>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Status" error={fields.status}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Category" error={fields.category} hint="Optional grouping (max 50 chars)">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={50}
            invalid={Boolean(fields.category)}
          />
        </FormField>
        <FormField label="Due date" error={fields.dueDate}>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            invalid={Boolean(fields.dueDate)}
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {mode === "create" ? "Create task" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { TaskForm } from "@/components/forms/TaskForm";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { ApiError } from "@/services/api";
import { getTask, updateTask } from "@/services/tasks";
import type { PublicTask, TaskCreatePayload, TaskUpdatePayload } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTaskPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<PublicTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true);
    setLoadError(null);
    getTask(id, ctl.signal)
      .then(({ task }) => setTask(task))
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setLoadError(e instanceof ApiError ? e.message : "Failed to load task");
      })
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, [id]);

  const handleSubmit = async (payload: TaskCreatePayload | TaskUpdatePayload) => {
    setSubmitting(true);
    setError(null);
    setFields({});
    try {
      const { task: updated } = await updateTask(id, payload as TaskUpdatePayload);
      setTask(updated);
      router.push("/tasks");
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        if (e.fields) setFields(e.fields);
      } else {
        setError(e instanceof Error ? e.message : "Failed to save task");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Edit task</h1>
        {task && (
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : loadError ? (
        <Alert tone="error">{loadError}</Alert>
      ) : task ? (
        <Card>
          <CardHeader>
            <CardTitle>Task details</CardTitle>
          </CardHeader>
          <CardBody>
            <TaskForm
              key={task.id}
              mode="edit"
              initial={task}
              submitting={submitting}
              error={error}
              fields={fields}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/tasks")}
            />
          </CardBody>
        </Card>
      ) : null}

      <DeleteTaskDialog
        open={deleteOpen}
        taskId={task?.id ?? null}
        taskTitle={task?.title}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => router.push("/tasks")}
      />
    </div>
  );
}

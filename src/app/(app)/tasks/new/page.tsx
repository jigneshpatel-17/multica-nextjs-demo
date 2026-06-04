"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { TaskForm } from "@/components/forms/TaskForm";
import { ApiError } from "@/services/api";
import { createTask } from "@/services/tasks";
import type { TaskCreatePayload, TaskUpdatePayload } from "@/types/api";

export default function NewTaskPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  const handleSubmit = async (payload: TaskCreatePayload | TaskUpdatePayload) => {
    setSubmitting(true);
    setError(null);
    setFields({});
    try {
      await createTask(payload as TaskCreatePayload);
      router.push("/tasks");
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        if (e.fields) setFields(e.fields);
      } else {
        setError(e instanceof Error ? e.message : "Failed to create task");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">New task</h1>
      <Card>
        <CardHeader>
          <CardTitle>Task details</CardTitle>
        </CardHeader>
        <CardBody>
          <TaskForm
            mode="create"
            submitting={submitting}
            error={error}
            fields={fields}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/tasks")}
          />
        </CardBody>
      </Card>
    </div>
  );
}

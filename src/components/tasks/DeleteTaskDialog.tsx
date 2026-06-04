"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Alert } from "@/components/ui/Alert";
import { ApiError } from "@/services/api";
import { deleteTask } from "@/services/tasks";

interface Props {
  open: boolean;
  taskId: string | null;
  taskTitle?: string;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function DeleteTaskDialog({ open, taskId, taskTitle, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!taskId) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteTask(taskId);
      onDeleted(taskId);
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? () => undefined : onClose}
      title="Delete task"
      description={
        taskTitle
          ? `Delete "${taskTitle}"? This action cannot be undone.`
          : "Delete this task? This action cannot be undone."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={submitting}>
            Delete
          </Button>
        </>
      }
    >
      {error && <Alert tone="error">{error}</Alert>}
    </Dialog>
  );
}

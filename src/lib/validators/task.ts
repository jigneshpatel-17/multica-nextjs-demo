import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/models/Task";

const isoDate = z
  .string()
  .datetime({ offset: true, message: "Must be ISO 8601 timestamp" });

const nullableIsoDate = z.union([isoDate, z.null()]);

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().default(""),
  priority: z.enum(TASK_PRIORITIES).optional().default("Medium"),
  status: z.enum(TASK_STATUSES).optional().default("Pending"),
  category: z.string().trim().max(50).optional().nullable(),
  dueDate: nullableIsoDate.optional(),
});

export const taskUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    status: z.enum(TASK_STATUSES).optional(),
    category: z.string().trim().max(50).nullable().optional(),
    dueDate: nullableIsoDate.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field is required",
  });

export const taskStatusSchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
});

const sortValues = ["latest", "oldest", "dueDate", "priority"] as const;

export const taskListSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  category: z.string().trim().min(1).optional(),
  dueBefore: isoDate.optional(),
  q: z.string().trim().min(1).optional(),
  sort: z.enum(sortValues).optional().default("latest"),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type TaskListQuery = z.infer<typeof taskListSchema>;

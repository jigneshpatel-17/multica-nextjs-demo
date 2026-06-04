import { NextResponse } from "next/server";
import type { FilterQuery, SortOrder } from "mongoose";
import { connectMongo } from "@/lib/mongodb";
import Task, { type ITask } from "@/models/Task";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  errorResponse,
  handleUnknown,
  zodErrorResponse,
} from "@/lib/apiError";
import { taskCreateSchema, taskListSchema } from "@/lib/validators/task";
import { toPublicTask } from "@/lib/taskView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRIORITY_ORDER: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const parsed = taskListSchema.safeParse(params);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { page, limit, status, priority, category, dueBefore, q, sort } =
      parsed.data;

    const filter: FilterQuery<ITask> = {
      userId: auth.userId,
      isDeleted: false,
    };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (dueBefore) filter.dueDate = { $lte: new Date(dueBefore) };
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: rx }, { description: rx }];
    }

    let sortSpec: Record<string, SortOrder>;
    switch (sort) {
      case "oldest":
        sortSpec = { createdAt: 1 };
        break;
      case "dueDate":
        sortSpec = { dueDate: 1, createdAt: -1 };
        break;
      case "priority":
        sortSpec = { createdAt: -1 };
        break;
      default:
        sortSpec = { createdAt: -1 };
    }

    await connectMongo();
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Task.find(filter).sort(sortSpec).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    let tasks = docs.map(toPublicTask);
    if (sort === "priority") {
      tasks = tasks.sort(
        (a, b) =>
          (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0),
      );
    }

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    return handleUnknown(err);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const raw = await req.json().catch(() => null);
    if (!raw) return errorResponse("Invalid JSON body", 400);

    const parsed = taskCreateSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const data = parsed.data;

    await connectMongo();
    const task = await Task.create({
      userId: auth.userId,
      title: data.title,
      description: data.description ?? "",
      priority: data.priority ?? "Medium",
      status: data.status ?? "Pending",
      category: data.category ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });

    return NextResponse.json({ task: toPublicTask(task) }, { status: 201 });
  } catch (err) {
    return handleUnknown(err);
  }
}

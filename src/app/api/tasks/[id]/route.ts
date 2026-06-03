import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectMongo } from "@/lib/mongodb";
import Task from "@/models/Task";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  errorResponse,
  handleUnknown,
  zodErrorResponse,
} from "@/lib/apiError";
import { taskUpdateSchema } from "@/lib/validators/task";
import { toPublicTask } from "@/lib/taskView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function loadTask(userId: Types.ObjectId, id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return Task.findOne({ _id: id, userId, isDeleted: false });
}

export async function GET(_req: Request, ctx: RouteContext) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const { id } = await ctx.params;
    await connectMongo();
    const task = await loadTask(auth.userId, id);
    if (!task) return errorResponse("Task not found", 404);

    return NextResponse.json({ task: toPublicTask(task) });
  } catch (err) {
    return handleUnknown(err);
  }
}

export async function PUT(req: Request, ctx: RouteContext) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const { id } = await ctx.params;
    const raw = await req.json().catch(() => null);
    if (!raw) return errorResponse("Invalid JSON body", 400);

    const parsed = taskUpdateSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    await connectMongo();
    const task = await loadTask(auth.userId, id);
    if (!task) return errorResponse("Task not found", 404);

    const u = parsed.data;
    if (u.title !== undefined) task.title = u.title;
    if (u.description !== undefined) task.description = u.description;
    if (u.priority !== undefined) task.priority = u.priority;
    if (u.status !== undefined) task.status = u.status;
    if (u.category !== undefined) task.category = u.category ?? undefined;
    if (u.dueDate !== undefined)
      task.dueDate = u.dueDate ? new Date(u.dueDate) : null;

    await task.save();
    return NextResponse.json({ task: toPublicTask(task) });
  } catch (err) {
    return handleUnknown(err);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const { id } = await ctx.params;
    await connectMongo();
    const task = await loadTask(auth.userId, id);
    if (!task) return errorResponse("Task not found", 404);

    task.isDeleted = true;
    await task.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleUnknown(err);
  }
}

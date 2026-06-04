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
import { taskStatusSchema } from "@/lib/validators/task";
import { toPublicTask } from "@/lib/taskView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const { id } = await ctx.params;
    if (!Types.ObjectId.isValid(id))
      return errorResponse("Task not found", 404);

    const raw = await req.json().catch(() => ({}));
    const parsed = taskStatusSchema.safeParse(raw ?? {});
    if (!parsed.success) return zodErrorResponse(parsed.error);

    await connectMongo();
    const task = await Task.findOne({
      _id: id,
      userId: auth.userId,
      isDeleted: false,
    });
    if (!task) return errorResponse("Task not found", 404);

    if (parsed.data.status) {
      task.status = parsed.data.status;
    } else {
      task.status = task.status === "Completed" ? "Pending" : "Completed";
    }

    await task.save();
    return NextResponse.json({ task: toPublicTask(task) });
  } catch (err) {
    return handleUnknown(err);
  }
}

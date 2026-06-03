import { Types, type PipelineStage } from "mongoose";
import Task from "@/models/Task";

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export function buildDashboardStatsPipeline(
  userId: Types.ObjectId,
  now: Date = new Date(),
): PipelineStage[] {
  return [
    { $match: { userId, isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$status", "Completed"] },
                  { $ne: ["$dueDate", null] },
                  { $lt: ["$dueDate", now] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        pending: 1,
        inProgress: 1,
        completed: 1,
        overdue: 1,
      },
    },
  ];
}

export async function getDashboardStats(
  userId: Types.ObjectId | string,
): Promise<DashboardStats> {
  const id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
  const [row] = await Task.aggregate<DashboardStats>(
    buildDashboardStatsPipeline(id),
  );
  return (
    row ?? { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 }
  );
}

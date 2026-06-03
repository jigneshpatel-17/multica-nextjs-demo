import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Task from "@/models/Task";
import { getDashboardStats } from "@/lib/aggregations/dashboardStats";
import { isAuthError, requireAuth } from "@/lib/auth";
import { handleUnknown } from "@/lib/apiError";
import { toPublicTask } from "@/lib/taskView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CompletionTrendRow {
  _id: string;
  count: number;
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    await connectMongo();
    const now = new Date();
    const trendStart = new Date(now);
    trendStart.setUTCHours(0, 0, 0, 0);
    trendStart.setUTCDate(trendStart.getUTCDate() - 6);

    const [stats, recentDocs, trendRows] = await Promise.all([
      getDashboardStats(auth.userId),
      Task.find({ userId: auth.userId, isDeleted: false })
        .sort({ updatedAt: -1 })
        .limit(5),
      Task.aggregate<CompletionTrendRow>([
        {
          $match: {
            userId: auth.userId,
            isDeleted: false,
            status: "Completed",
            updatedAt: { $gte: trendStart },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const trendMap = new Map(trendRows.map((r) => [r._id, r.count]));
    const trend: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(trendStart);
      d.setUTCDate(trendStart.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      trend.push({ date: key, count: trendMap.get(key) ?? 0 });
    }

    return NextResponse.json({
      stats,
      recentActivity: recentDocs.map(toPublicTask),
      completionTrend: trend,
    });
  } catch (err) {
    return handleUnknown(err);
  }
}

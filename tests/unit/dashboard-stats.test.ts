import { describe, expect, it } from "vitest";
import { Types } from "mongoose";
import { buildDashboardStatsPipeline } from "@/lib/aggregations/dashboardStats";

describe("buildDashboardStatsPipeline", () => {
  const uid = new Types.ObjectId();
  const now = new Date("2026-06-01T00:00:00.000Z");

  it("scopes match to userId and isDeleted=false", () => {
    const [stageMatch] = buildDashboardStatsPipeline(uid, now);
    expect(stageMatch).toEqual({ $match: { userId: uid, isDeleted: false } });
  });

  it("emits group with counters for each status + overdue", () => {
    const [, stageGroup] = buildDashboardStatsPipeline(uid, now);
    const group = stageGroup as { $group: Record<string, unknown> };
    expect(group.$group._id).toBeNull();
    expect(group.$group).toHaveProperty("total");
    expect(group.$group).toHaveProperty("pending");
    expect(group.$group).toHaveProperty("inProgress");
    expect(group.$group).toHaveProperty("completed");
    expect(group.$group).toHaveProperty("overdue");
  });

  it("overdue counter excludes Completed and null dueDates", () => {
    const stages = buildDashboardStatsPipeline(uid, now);
    const json = JSON.stringify(stages);
    expect(json).toContain("Completed");
    expect(json).toContain("dueDate");
    expect(json).toContain("$ne");
    expect(json).toContain("$lt");
  });

  it("project stage drops _id", () => {
    const stages = buildDashboardStatsPipeline(uid, now);
    const proj = stages[stages.length - 1] as { $project: Record<string, number> };
    expect(proj.$project._id).toBe(0);
    expect(proj.$project.total).toBe(1);
  });
});

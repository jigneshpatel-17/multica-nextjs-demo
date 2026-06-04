import { describe, expect, it } from "vitest";
import { asSession, createTask, registerUser } from "./_helpers";
import { jsonRequest } from "../setup/http";
import { clearCookies } from "../setup/cookies";

describe("dashboard stats", () => {
  it("401 when unauthenticated", async () => {
    clearCookies();
    const { GET } = await import("@/app/api/dashboard/stats/route");
    expect((await GET()).status).toBe(401);
  });

  it("aggregates stats scoped to the current user", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    await createTask({ title: "p1", status: "Pending" });
    await createTask({ title: "p2", status: "Pending" });
    await createTask({ title: "i1", status: "In Progress" });
    await createTask({ title: "c1", status: "Completed" });
    await createTask({
      title: "overdue",
      status: "Pending",
      dueDate: "2020-01-01T00:00:00.000Z",
    });

    const bob = await registerUser({ email: "bob@example.com", password: "supersecret1" });
    asSession(bob);
    await createTask({ title: "noise", status: "Pending" });

    asSession(alice);
    const { GET } = await import("@/app/api/dashboard/stats/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.stats.total).toBe(5);
    expect(body.stats.pending).toBe(3);
    expect(body.stats.inProgress).toBe(1);
    expect(body.stats.completed).toBe(1);
    expect(body.stats.overdue).toBe(1);
    expect(Array.isArray(body.recentActivity)).toBe(true);
    expect(body.completionTrend).toHaveLength(7);
  });
});

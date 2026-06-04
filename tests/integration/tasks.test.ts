import { describe, expect, it } from "vitest";
import { asSession, createTask, registerUser } from "./_helpers";
import { jsonRequest, params } from "../setup/http";
import { clearCookies } from "../setup/cookies";

describe("tasks API", () => {
  it("rejects unauthenticated GET /api/tasks", async () => {
    clearCookies();
    const { GET } = await import("@/app/api/tasks/route");
    const res = await GET(jsonRequest("http://localhost/api/tasks", "GET"));
    expect(res.status).toBe(401);
  });

  it("creates and retrieves a task", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);

    const created = await createTask({
      title: "Write tests",
      description: "Cover the happy path",
      priority: "High",
      dueDate: "2026-12-01T00:00:00.000Z",
    });
    expect(created.id).toBeTruthy();
    expect(created.userId).toBe(alice.userId);
    expect(created.title).toBe("Write tests");

    const { GET } = await import("@/app/api/tasks/[id]/route");
    const res = await GET(
      jsonRequest(`http://localhost/api/tasks/${created.id}`, "GET"),
      params({ id: String(created.id) }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.task.id).toBe(created.id);
  });

  it("validates task body on POST", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { POST } = await import("@/app/api/tasks/route");
    const res = await POST(jsonRequest("http://localhost/api/tasks", "POST", { title: "" }));
    expect(res.status).toBe(400);
  });

  it("supports filter + search + sort + pagination", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);

    await createTask({ title: "Buy milk", priority: "Low", status: "Pending", category: "Home" });
    await createTask({ title: "Ship feature", priority: "High", status: "In Progress", category: "Work" });
    await createTask({ title: "Old chore", priority: "Medium", status: "Completed", category: "Home" });

    const { GET } = await import("@/app/api/tasks/route");

    const listAll = await GET(jsonRequest("http://localhost/api/tasks?limit=2&page=1", "GET"));
    const bodyAll = await listAll.json();
    expect(bodyAll.tasks).toHaveLength(2);
    expect(bodyAll.pagination.total).toBe(3);
    expect(bodyAll.pagination.pages).toBe(2);

    const filtered = await GET(jsonRequest("http://localhost/api/tasks?status=Completed", "GET"));
    const bf = await filtered.json();
    expect(bf.tasks).toHaveLength(1);
    expect(bf.tasks[0].title).toBe("Old chore");

    const byCat = await GET(jsonRequest("http://localhost/api/tasks?category=Home", "GET"));
    const bc = await byCat.json();
    expect(bc.tasks.map((t: { title: string }) => t.title).sort()).toEqual([
      "Buy milk",
      "Old chore",
    ]);

    const search = await GET(jsonRequest("http://localhost/api/tasks?q=feature", "GET"));
    const bs = await search.json();
    expect(bs.tasks).toHaveLength(1);
    expect(bs.tasks[0].title).toBe("Ship feature");

    const byPriority = await GET(jsonRequest("http://localhost/api/tasks?sort=priority", "GET"));
    const bp = await byPriority.json();
    expect(bp.tasks[0].priority).toBe("High");
  });

  it("PUT updates fields and clears dueDate when null", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const t = await createTask({
      title: "Original",
      dueDate: "2026-12-01T00:00:00.000Z",
    });

    const { PUT } = await import("@/app/api/tasks/[id]/route");
    const res = await PUT(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "PUT", {
        title: "Updated",
        dueDate: null,
      }),
      params({ id: String(t.id) }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.task.title).toBe("Updated");
    expect(body.task.dueDate).toBeNull();
  });

  it("PUT 400 on empty body", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const t = await createTask({ title: "x" });
    const { PUT } = await import("@/app/api/tasks/[id]/route");
    const res = await PUT(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "PUT", {}),
      params({ id: String(t.id) }),
    );
    expect(res.status).toBe(400);
  });

  it("DELETE soft-deletes and the task vanishes from list/get", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const t = await createTask({ title: "Disposable" });

    const { DELETE, GET: GET_ONE } = await import("@/app/api/tasks/[id]/route");
    const del = await DELETE(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "DELETE"),
      params({ id: String(t.id) }),
    );
    expect(del.status).toBe(200);

    const after = await GET_ONE(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "GET"),
      params({ id: String(t.id) }),
    );
    expect(after.status).toBe(404);

    const { GET: GET_LIST } = await import("@/app/api/tasks/route");
    const list = await GET_LIST(jsonRequest("http://localhost/api/tasks", "GET"));
    const body = await list.json();
    expect(body.tasks).toHaveLength(0);
  });

  it("PATCH /status toggles Pending ↔ Completed and accepts explicit status", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const t = await createTask({ title: "Toggle me" });

    const { PATCH } = await import("@/app/api/tasks/[id]/status/route");

    const r1 = await PATCH(
      jsonRequest(`http://localhost/api/tasks/${t.id}/status`, "PATCH", {}),
      params({ id: String(t.id) }),
    );
    const b1 = await r1.json();
    expect(b1.task.status).toBe("Completed");

    const r2 = await PATCH(
      jsonRequest(`http://localhost/api/tasks/${t.id}/status`, "PATCH", {}),
      params({ id: String(t.id) }),
    );
    const b2 = await r2.json();
    expect(b2.task.status).toBe("Pending");

    const r3 = await PATCH(
      jsonRequest(`http://localhost/api/tasks/${t.id}/status`, "PATCH", {
        status: "In Progress",
      }),
      params({ id: String(t.id) }),
    );
    const b3 = await r3.json();
    expect(b3.task.status).toBe("In Progress");
  });

  it("404 on invalid id format", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { GET } = await import("@/app/api/tasks/[id]/route");
    const res = await GET(
      jsonRequest("http://localhost/api/tasks/not-an-objectid", "GET"),
      params({ id: "not-an-objectid" }),
    );
    expect(res.status).toBe(404);
  });

  it("enforces cross-user isolation: B cannot read/update/delete A's task", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const t = await createTask({ title: "Alice secret" });

    const bob = await registerUser({ email: "bob@example.com", password: "supersecret1" });
    asSession(bob);

    const { GET, PUT, DELETE } = await import("@/app/api/tasks/[id]/route");
    const { PATCH } = await import("@/app/api/tasks/[id]/status/route");

    const get = await GET(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "GET"),
      params({ id: String(t.id) }),
    );
    expect(get.status).toBe(404);

    const put = await PUT(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "PUT", { title: "Hijacked" }),
      params({ id: String(t.id) }),
    );
    expect(put.status).toBe(404);

    const del = await DELETE(
      jsonRequest(`http://localhost/api/tasks/${t.id}`, "DELETE"),
      params({ id: String(t.id) }),
    );
    expect(del.status).toBe(404);

    const pat = await PATCH(
      jsonRequest(`http://localhost/api/tasks/${t.id}/status`, "PATCH", {}),
      params({ id: String(t.id) }),
    );
    expect(pat.status).toBe(404);

    const { GET: LIST } = await import("@/app/api/tasks/route");
    const list = await LIST(jsonRequest("http://localhost/api/tasks", "GET"));
    const body = await list.json();
    expect(body.tasks).toHaveLength(0);
  });
});

import { describe, expect, it } from "vitest";
import {
  taskCreateSchema,
  taskListSchema,
  taskStatusSchema,
  taskUpdateSchema,
} from "@/lib/validators/task";

describe("taskCreateSchema", () => {
  it("accepts minimum input and applies defaults", () => {
    const r = taskCreateSchema.parse({ title: "Do thing" });
    expect(r.title).toBe("Do thing");
    expect(r.description).toBe("");
    expect(r.priority).toBe("Medium");
    expect(r.status).toBe("Pending");
  });

  it("trims title and rejects empty after trim", () => {
    expect(taskCreateSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects unknown priority enum", () => {
    const r = taskCreateSchema.safeParse({ title: "x", priority: "Urgent" });
    expect(r.success).toBe(false);
  });

  it("accepts ISO dueDate and null", () => {
    expect(taskCreateSchema.parse({ title: "x", dueDate: "2026-01-01T00:00:00.000Z" }).dueDate).toBe(
      "2026-01-01T00:00:00.000Z",
    );
    expect(taskCreateSchema.parse({ title: "x", dueDate: null }).dueDate).toBeNull();
  });

  it("rejects non-ISO dueDate", () => {
    expect(taskCreateSchema.safeParse({ title: "x", dueDate: "2026-01-01" }).success).toBe(false);
  });

  it("rejects 1001+ char description", () => {
    expect(taskCreateSchema.safeParse({ title: "x", description: "a".repeat(1001) }).success).toBe(
      false,
    );
  });
});

describe("taskUpdateSchema", () => {
  it("requires at least one field", () => {
    expect(taskUpdateSchema.safeParse({}).success).toBe(false);
  });

  it("accepts partial update", () => {
    const r = taskUpdateSchema.parse({ status: "Completed" });
    expect(r.status).toBe("Completed");
  });

  it("permits null category", () => {
    const r = taskUpdateSchema.parse({ category: null });
    expect(r.category).toBeNull();
  });
});

describe("taskStatusSchema", () => {
  it("allows empty body (toggle)", () => {
    expect(taskStatusSchema.parse({}).status).toBeUndefined();
  });

  it("rejects unknown status", () => {
    expect(taskStatusSchema.safeParse({ status: "Done" }).success).toBe(false);
  });
});

describe("taskListSchema", () => {
  it("coerces numeric strings and applies defaults", () => {
    const r = taskListSchema.parse({ page: "3", limit: "25" });
    expect(r.page).toBe(3);
    expect(r.limit).toBe(25);
    expect(r.sort).toBe("latest");
  });

  it("rejects page < 1", () => {
    expect(taskListSchema.safeParse({ page: "0" }).success).toBe(false);
  });

  it("rejects limit > 100", () => {
    expect(taskListSchema.safeParse({ limit: "101" }).success).toBe(false);
  });

  it("rejects unknown sort", () => {
    expect(taskListSchema.safeParse({ sort: "alpha" }).success).toBe(false);
  });

  it("trims q and category", () => {
    const r = taskListSchema.parse({ q: "  hello  ", category: "  work " });
    expect(r.q).toBe("hello");
    expect(r.category).toBe("work");
  });
});

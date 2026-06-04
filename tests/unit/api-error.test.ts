import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errorResponse, handleUnknown, zodFields } from "@/lib/apiError";

describe("errorResponse", () => {
  it("serializes error + status with optional fields", async () => {
    const res = errorResponse("bad", 422, { name: "required" });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: "bad", fields: { name: "required" } });
  });
});

describe("zodFields", () => {
  it("maps ZodError issues to {path: message}", () => {
    const schema = z.object({ a: z.string(), b: z.number() });
    const res = schema.safeParse({ a: 1, b: "x" });
    if (res.success) throw new Error("expected failure");
    const fields = zodFields(res.error);
    expect(fields.a).toBeTruthy();
    expect(fields.b).toBeTruthy();
  });

  it("keeps first error per path", () => {
    const schema = z.string().min(3).max(2);
    const res = schema.safeParse("a");
    if (res.success) throw new Error("expected failure");
    const fields = zodFields(res.error);
    expect(Object.keys(fields)).toHaveLength(1);
  });
});

describe("handleUnknown", () => {
  it("converts ZodError to 400", async () => {
    const schema = z.string();
    const r = schema.safeParse(1);
    if (r.success) throw new Error("expected failure");
    const res = handleUnknown(r.error);
    expect(res.status).toBe(400);
  });

  it("falls back to 500 for arbitrary errors", () => {
    expect(handleUnknown(new Error("boom")).status).toBe(500);
  });
});

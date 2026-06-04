import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validators/auth";

describe("registerSchema", () => {
  it("accepts valid input and normalizes email", () => {
    const r = registerSchema.parse({
      name: "  Alice  ",
      email: "  ALICE@Example.com ",
      password: "supersecret1",
      confirmPassword: "supersecret1",
    });
    expect(r.name).toBe("Alice");
    expect(r.email).toBe("alice@example.com");
  });

  it("rejects mismatched passwords on confirmPassword path", () => {
    const r = registerSchema.safeParse({
      name: "A",
      email: "a@b.co",
      password: "supersecret1",
      confirmPassword: "differentpw1",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "confirmPassword")).toBe(true);
    }
  });

  it("rejects empty name", () => {
    const r = registerSchema.safeParse({
      name: "   ",
      email: "a@b.co",
      password: "supersecret1",
      confirmPassword: "supersecret1",
    });
    expect(r.success).toBe(false);
  });

  it("rejects short password (<8)", () => {
    const r = registerSchema.safeParse({
      name: "A",
      email: "a@b.co",
      password: "short",
      confirmPassword: "short",
    });
    expect(r.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = registerSchema.safeParse({
      name: "A",
      email: "not-an-email",
      password: "supersecret1",
      confirmPassword: "supersecret1",
    });
    expect(r.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid input with default rememberMe=false", () => {
    const r = loginSchema.parse({ email: "a@b.co", password: "x" });
    expect(r.rememberMe).toBe(false);
    expect(r.email).toBe("a@b.co");
  });

  it("preserves rememberMe when supplied", () => {
    const r = loginSchema.parse({ email: "a@b.co", password: "x", rememberMe: true });
    expect(r.rememberMe).toBe(true);
  });

  it("rejects empty password", () => {
    const r = loginSchema.safeParse({ email: "a@b.co", password: "" });
    expect(r.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(r.success).toBe(false);
  });
});

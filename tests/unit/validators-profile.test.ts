import { describe, expect, it } from "vitest";
import { profileUpdateSchema } from "@/lib/validators/profile";

describe("profileUpdateSchema", () => {
  it("accepts a name-only update", () => {
    expect(profileUpdateSchema.parse({ name: "Bob" }).name).toBe("Bob");
  });

  it("rejects an empty update", () => {
    expect(profileUpdateSchema.safeParse({}).success).toBe(false);
  });

  it("requires currentPassword when newPassword present", () => {
    const r = profileUpdateSchema.safeParse({ newPassword: "longenough1" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "currentPassword")).toBe(true);
    }
  });

  it("accepts password change pair", () => {
    expect(
      profileUpdateSchema.safeParse({
        currentPassword: "oldpassword1",
        newPassword: "newpassword1",
      }).success,
    ).toBe(true);
  });

  it("rejects too-short newPassword", () => {
    expect(
      profileUpdateSchema.safeParse({
        currentPassword: "x",
        newPassword: "short",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid profileImage url", () => {
    expect(profileUpdateSchema.safeParse({ profileImage: "not-a-url" }).success).toBe(false);
  });

  it("accepts null profileImage (clear)", () => {
    expect(profileUpdateSchema.safeParse({ profileImage: null }).success).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/lib/auth";

describe("signSession + verifySession", () => {
  it("round-trips payload", () => {
    const { token, maxAge } = signSession({ sub: "abc", email: "a@b.co" });
    expect(maxAge).toBeGreaterThan(0);
    const p = verifySession(token);
    expect(p).toEqual({ sub: "abc", email: "a@b.co" });
  });

  it("uses longer maxAge with rememberMe", () => {
    const { maxAge: short } = signSession({ sub: "a", email: "a@b.co" }, false);
    const { maxAge: long } = signSession({ sub: "a", email: "a@b.co" }, true);
    expect(long).toBeGreaterThan(short);
  });

  it("returns null for tampered token", () => {
    expect(verifySession("not.a.token")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { asSession, registerUser } from "./_helpers";
import { jsonRequest } from "../setup/http";
import { clearCookies } from "../setup/cookies";

describe("profile API", () => {
  it("rejects unauthenticated GET and PUT", async () => {
    clearCookies();
    const { GET, PUT } = await import("@/app/api/profile/route");
    expect((await GET()).status).toBe(401);
    expect(
      (await PUT(jsonRequest("http://localhost/api/profile", "PUT", { name: "X" }))).status,
    ).toBe(401);
  });

  it("returns current profile", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { GET } = await import("@/app/api/profile/route");
    const res = await GET();
    const body = await res.json();
    expect(body.user.email).toBe("alice@example.com");
  });

  it("updates name", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { PUT } = await import("@/app/api/profile/route");
    const res = await PUT(
      jsonRequest("http://localhost/api/profile", "PUT", { name: "Alice Smith" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.name).toBe("Alice Smith");
  });

  it("rejects empty update body", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { PUT } = await import("@/app/api/profile/route");
    const res = await PUT(jsonRequest("http://localhost/api/profile", "PUT", {}));
    expect(res.status).toBe(400);
  });

  it("changes password with correct currentPassword and lets new password log in", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { PUT } = await import("@/app/api/profile/route");
    const ok = await PUT(
      jsonRequest("http://localhost/api/profile", "PUT", {
        currentPassword: "supersecret1",
        newPassword: "brandnewpw9",
      }),
    );
    expect(ok.status).toBe(200);

    clearCookies();
    const { POST: login } = await import("@/app/api/auth/login/route");
    const oldLogin = await login(
      jsonRequest("http://localhost/api/auth/login", "POST", {
        email: "alice@example.com",
        password: "supersecret1",
      }),
    );
    expect(oldLogin.status).toBe(401);

    const newLogin = await login(
      jsonRequest("http://localhost/api/auth/login", "POST", {
        email: "alice@example.com",
        password: "brandnewpw9",
      }),
    );
    expect(newLogin.status).toBe(200);
  });

  it("rejects password change with wrong currentPassword (400)", async () => {
    const alice = await registerUser({ email: "alice@example.com", password: "supersecret1" });
    asSession(alice);
    const { PUT } = await import("@/app/api/profile/route");
    const res = await PUT(
      jsonRequest("http://localhost/api/profile", "PUT", {
        currentPassword: "wrongpassword",
        newPassword: "brandnewpw9",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fields?.currentPassword).toBeTruthy();
  });
});

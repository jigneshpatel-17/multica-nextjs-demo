import { describe, expect, it } from "vitest";
import { clearCookies, getCookie, setCookie } from "../setup/cookies";
import { jsonRequest } from "../setup/http";

const goodRegister = {
  name: "Alice",
  email: "alice@example.com",
  password: "supersecret1",
  confirmPassword: "supersecret1",
};

describe("auth: register → login → me → logout", () => {
  it("registers a user, sets cookie, returns 201", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    const res = await POST(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.email).toBe("alice@example.com");
    expect(body.user.id).toBeTruthy();
    expect(body.user).not.toHaveProperty("password");
    expect(getCookie("tf_session")).toBeTruthy();
  });

  it("rejects duplicate email with 409", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    await POST(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    clearCookies();
    const res = await POST(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    expect(res.status).toBe(409);
  });

  it("rejects mismatched password with 400 and field errors", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    const res = await POST(
      jsonRequest("http://localhost/api/auth/register", "POST", {
        ...goodRegister,
        confirmPassword: "different1",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fields?.confirmPassword).toBeTruthy();
  });

  it("/me returns 401 when no session", async () => {
    const { GET } = await import("@/app/api/auth/me/route");
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("/me returns current user after register", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    await POST(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    const { GET } = await import("@/app/api/auth/me/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("alice@example.com");
  });

  it("login flow: bad password → 401, good password → 200 + cookie", async () => {
    const { POST: register } = await import("@/app/api/auth/register/route");
    await register(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    clearCookies();

    const { POST: login } = await import("@/app/api/auth/login/route");
    const bad = await login(
      jsonRequest("http://localhost/api/auth/login", "POST", {
        email: "alice@example.com",
        password: "wrongpassword",
      }),
    );
    expect(bad.status).toBe(401);
    expect(getCookie("tf_session")).toBeFalsy();

    const ok = await login(
      jsonRequest("http://localhost/api/auth/login", "POST", {
        email: "alice@example.com",
        password: "supersecret1",
      }),
    );
    expect(ok.status).toBe(200);
    expect(getCookie("tf_session")).toBeTruthy();
  });

  it("logout clears the session cookie", async () => {
    const { POST: register } = await import("@/app/api/auth/register/route");
    await register(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    expect(getCookie("tf_session")).toBeTruthy();

    const { POST: logout } = await import("@/app/api/auth/logout/route");
    const res = await logout();
    expect(res.status).toBe(200);
    expect(getCookie("tf_session")).toBeFalsy();
  });

  it("/me rejects forged JWT", async () => {
    const { POST: register } = await import("@/app/api/auth/register/route");
    await register(jsonRequest("http://localhost/api/auth/register", "POST", goodRegister));
    clearCookies();
    setCookie("tf_session", "not.a.valid.token");
    const { GET } = await import("@/app/api/auth/me/route");
    const res = await GET();
    expect(res.status).toBe(401);
  });
});

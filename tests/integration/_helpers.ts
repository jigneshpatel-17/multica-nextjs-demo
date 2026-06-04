import { clearCookies, getCookie, setCookie } from "../setup/cookies";
import { jsonRequest } from "../setup/http";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
}

export interface Session {
  userId: string;
  email: string;
  cookie: string;
}

export async function registerUser(input: RegisterInput): Promise<Session> {
  clearCookies();
  const { POST } = await import("@/app/api/auth/register/route");
  const res = await POST(
    jsonRequest("http://localhost/api/auth/register", "POST", {
      name: input.name ?? "Test User",
      email: input.email,
      password: input.password,
      confirmPassword: input.password,
    }),
  );
  if (res.status !== 201) {
    throw new Error(`register failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  const cookie = getCookie("tf_session");
  if (!cookie) throw new Error("session cookie missing after register");
  return { userId: body.user.id, email: body.user.email, cookie };
}

export function asSession(session: Session): void {
  clearCookies();
  setCookie("tf_session", session.cookie);
}

export async function createTask(
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { POST } = await import("@/app/api/tasks/route");
  const res = await POST(jsonRequest("http://localhost/api/tasks", "POST", payload));
  if (res.status !== 201) {
    throw new Error(`createTask failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  return body.task as Record<string, unknown>;
}

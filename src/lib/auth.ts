import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { type SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { connectMongo } from "@/lib/mongodb";
import User, { type UserDocument } from "@/models/User";
import { errorResponse } from "@/lib/apiError";

export const SESSION_COOKIE = "tf_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 1 day
const REMEMBER_ME_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  sub: string;
  email: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export function signSession(
  payload: SessionPayload,
  rememberMe = false,
): { token: string; maxAge: number } {
  const maxAge = rememberMe ? REMEMBER_ME_TTL_SECONDS : DEFAULT_TTL_SECONDS;
  const opts: SignOptions = { expiresIn: maxAge };
  const token = jwt.sign(payload, getSecret(), opts);
  return { token, maxAge };
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      typeof (decoded as SessionPayload).sub === "string" &&
      typeof (decoded as SessionPayload).email === "string"
    ) {
      const { sub, email } = decoded as SessionPayload;
      return { sub, email };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(
  token: string,
  maxAge: number,
): Promise<void> {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export type AuthSuccess = { user: UserDocument; userId: Types.ObjectId };
export type AuthResult = AuthSuccess | { response: NextResponse };

export async function requireAuth(): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session) return { response: errorResponse("Unauthorized", 401) };

  if (!Types.ObjectId.isValid(session.sub)) {
    return { response: errorResponse("Unauthorized", 401) };
  }

  await connectMongo();
  const user = await User.findById(session.sub);
  if (!user) return { response: errorResponse("Unauthorized", 401) };

  return { user, userId: user._id as Types.ObjectId };
}

export function isAuthError(
  result: AuthResult,
): result is { response: NextResponse } {
  return "response" in result;
}

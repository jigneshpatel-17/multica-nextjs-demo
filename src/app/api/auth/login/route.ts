import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators/auth";
import {
  errorResponse,
  handleUnknown,
  zodErrorResponse,
} from "@/lib/apiError";
import { setSessionCookie, signSession } from "@/lib/auth";
import { toPublicUser } from "@/lib/userView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw) return errorResponse("Invalid JSON body", 400);

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { email, password, rememberMe } = parsed.data;

    await connectMongo();
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse("Invalid credentials", 401);

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return errorResponse("Invalid credentials", 401);

    const { token, maxAge } = signSession(
      { sub: String(user._id), email: user.email },
      rememberMe,
    );
    await setSessionCookie(token, maxAge);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (err) {
    return handleUnknown(err);
  }
}

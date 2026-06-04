import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators/auth";
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

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const { name, email, password } = parsed.data;

    await connectMongo();
    const existing = await User.findOne({ email }).lean();
    if (existing) return errorResponse("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const { token, maxAge } = signSession({
      sub: String(user._id),
      email: user.email,
    });
    await setSessionCookie(token, maxAge);

    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  } catch (err) {
    return handleUnknown(err);
  }
}

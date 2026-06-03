import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  errorResponse,
  handleUnknown,
  zodErrorResponse,
} from "@/lib/apiError";
import { profileUpdateSchema } from "@/lib/validators/profile";
import { toPublicUser } from "@/lib/userView";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;
    return NextResponse.json({ user: toPublicUser(auth.user) });
  } catch (err) {
    return handleUnknown(err);
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth.response;

    const raw = await req.json().catch(() => null);
    if (!raw) return errorResponse("Invalid JSON body", 400);

    const parsed = profileUpdateSchema.safeParse(raw);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const data = parsed.data;

    await connectMongo();
    const user = await User.findById(auth.userId).select("+password");
    if (!user) return errorResponse("Unauthorized", 401);

    if (data.name !== undefined) user.name = data.name;
    if (data.profileImage !== undefined)
      user.profileImage = data.profileImage ?? undefined;

    if (data.newPassword) {
      const ok = await bcrypt.compare(data.currentPassword ?? "", user.password);
      if (!ok)
        return errorResponse("Current password is incorrect", 400, {
          currentPassword: "Current password is incorrect",
        });
      user.password = await bcrypt.hash(data.newPassword, 10);
    }

    await user.save();
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (err) {
    return handleUnknown(err);
  }
}

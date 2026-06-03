import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { handleUnknown } from "@/lib/apiError";
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

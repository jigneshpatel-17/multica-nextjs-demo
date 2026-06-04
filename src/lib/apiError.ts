import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiErrorBody {
  error: string;
  fields?: Record<string, string>;
}

export function errorResponse(
  error: string,
  status: number,
  fields?: Record<string, string>,
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { error };
  if (fields) body.fields = fields;
  return NextResponse.json(body, { status });
}

export function zodFields(err: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "_";
    if (!(path in out)) out[path] = issue.message;
  }
  return out;
}

export function zodErrorResponse(
  err: ZodError,
  message = "Validation failed",
): NextResponse<ApiErrorBody> {
  return errorResponse(message, 400, zodFields(err));
}

export function handleUnknown(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof ZodError) return zodErrorResponse(err);
  console.error("[api] unexpected error", err);
  return errorResponse("Internal server error", 500);
}

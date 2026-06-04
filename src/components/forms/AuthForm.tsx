"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

type Mode = "login" | "register";

interface Props {
  mode: Mode;
}

const DEFAULT_REDIRECT = "/dashboard";

function safeRedirect(value: string | null): string {
  if (!value) return DEFAULT_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_REDIRECT;
  return value;
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = safeRedirect(search.get("next"));
  const { login, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFields({});
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email, password, rememberMe });
      } else {
        await register({ name, email, password, confirmPassword });
      }
      router.push(redirect);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fields) setFields(err.fields);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const heading = mode === "login" ? "Sign in" : "Create your account";
  const subheading =
    mode === "login"
      ? "Welcome back. Sign in to manage your tasks."
      : "Sign up to start organizing your tasks.";

  return (
    <Card>
      <CardBody className="space-y-5 p-6 sm:p-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{heading}</h1>
          <p className="mt-1 text-sm text-slate-600">{subheading}</p>
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <FormField label="Name" error={fields.name} required>
              <Input
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                invalid={Boolean(fields.name)}
              />
            </FormField>
          )}

          <FormField label="Email" error={fields.email} required>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              invalid={Boolean(fields.email)}
            />
          </FormField>

          <FormField label="Password" error={fields.password} required>
            <Input
              type="password"
              name="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : undefined}
              invalid={Boolean(fields.password)}
            />
          </FormField>

          {mode === "register" && (
            <FormField label="Confirm password" error={fields.confirmPassword} required>
              <Input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                invalid={Boolean(fields.confirmPassword)}
              />
            </FormField>
          )}

          {mode === "login" && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          )}

          <Button type="submit" className="w-full" loading={submitting}>
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href="/login">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardBody>
    </Card>
  );
}

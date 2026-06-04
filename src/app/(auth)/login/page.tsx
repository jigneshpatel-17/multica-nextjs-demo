import { Suspense } from "react";
import { AuthForm } from "@/components/forms/AuthForm";
import { Spinner } from "@/components/ui/Spinner";

export const metadata = { title: "Sign in · Multica TODO" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}

import { apiFetch } from "./api";
import type {
  LoginPayload,
  PublicUser,
  RegisterPayload,
} from "@/types/api";

export function register(payload: RegisterPayload) {
  return apiFetch<{ user: PublicUser }>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<{ user: PublicUser }>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function logout() {
  return apiFetch<{ success: true }>("/api/auth/logout", { method: "POST" });
}

export function getMe(signal?: AbortSignal) {
  return apiFetch<{ user: PublicUser }>("/api/auth/me", { signal });
}

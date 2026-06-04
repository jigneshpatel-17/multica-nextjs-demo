import { apiFetch } from "./api";
import type { ProfileUpdatePayload, PublicUser } from "@/types/api";

export function getProfile(signal?: AbortSignal) {
  return apiFetch<{ user: PublicUser }>("/api/profile", { signal });
}

export function updateProfile(payload: ProfileUpdatePayload) {
  return apiFetch<{ user: PublicUser }>("/api/profile", {
    method: "PUT",
    body: payload,
  });
}

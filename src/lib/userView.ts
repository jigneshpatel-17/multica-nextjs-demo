import type { UserDocument } from "@/models/User";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    profileImage: user.profileImage ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

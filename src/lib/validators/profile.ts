import { z } from "zod";

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    profileImage: z
      .union([z.string().url("Must be a valid URL"), z.null()])
      .optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .optional(),
  })
  .refine(
    (d) => {
      if (d.newPassword && !d.currentPassword) return false;
      return true;
    },
    {
      message: "currentPassword is required when changing password",
      path: ["currentPassword"],
    },
  )
  .refine(
    (d) =>
      d.name !== undefined ||
      d.profileImage !== undefined ||
      d.newPassword !== undefined,
    { message: "At least one field is required" },
  );

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

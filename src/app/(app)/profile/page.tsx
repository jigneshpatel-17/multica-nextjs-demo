"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/services/api";
import { updateProfile } from "@/services/profile";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, loading: authLoading, setUser } = useAuth();

  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileFields, setProfileFields] = useState<Record<string, string>>({});
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwFields, setPwFields] = useState<Record<string, string>>({});
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfileImage(user.profileImage ?? "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileFields({});
    setProfileSuccess(null);
    try {
      const trimmedImage = profileImage.trim();
      const { user: updated } = await updateProfile({
        name: name.trim(),
        profileImage: trimmedImage === "" ? null : trimmedImage,
      });
      setUser(updated);
      setProfileSuccess("Profile updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileError(err.message);
        if (err.fields) setProfileFields(err.fields);
      } else {
        setProfileError(err instanceof Error ? err.message : "Failed to update profile");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingPassword(true);
    setPwError(null);
    setPwFields({});
    setPwSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPwFields({ confirmNewPassword: "Passwords do not match" });
      setSavingPassword(false);
      return;
    }

    try {
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPwSuccess("Password updated.");
    } catch (err) {
      if (err instanceof ApiError) {
        setPwError(err.message);
        if (err.fields) setPwFields(err.fields);
      } else {
        setPwError(err instanceof Error ? err.message : "Failed to update password");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleProfileSubmit} className="space-y-5" noValidate>
            <div className="flex items-center gap-4">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt=""
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white"
                >
                  {initials(user.name) || "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">{user.email}</p>
                <p className="text-xs text-slate-500">Email cannot be changed.</p>
              </div>
            </div>

            {profileError && <Alert tone="error">{profileError}</Alert>}
            {profileSuccess && <Alert tone="success">{profileSuccess}</Alert>}

            <FormField label="Name" error={profileFields.name} required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                invalid={Boolean(profileFields.name)}
              />
            </FormField>

            <FormField
              label="Profile image URL"
              hint="Paste a URL to an image. Leave blank to remove."
              error={profileFields.profileImage}
            >
              <Input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://..."
                invalid={Boolean(profileFields.profileImage)}
              />
            </FormField>

            <div className="flex justify-end">
              <Button type="submit" loading={savingProfile}>
                Save profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-5" noValidate>
            {pwError && <Alert tone="error">{pwError}</Alert>}
            {pwSuccess && <Alert tone="success">{pwSuccess}</Alert>}

            <FormField label="Current password" error={pwFields.currentPassword} required>
              <Input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                invalid={Boolean(pwFields.currentPassword)}
              />
            </FormField>
            <FormField label="New password" error={pwFields.newPassword} hint="At least 8 characters" required>
              <Input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                invalid={Boolean(pwFields.newPassword)}
              />
            </FormField>
            <FormField label="Confirm new password" error={pwFields.confirmNewPassword} required>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}
                invalid={Boolean(pwFields.confirmNewPassword)}
              />
            </FormField>

            <div className="flex justify-end">
              <Button type="submit" loading={savingPassword}>
                Update password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

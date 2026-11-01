"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

export type ProfileUser = {
  name?: string;
  email?: string;
  image?: string | null;
  createdAt?: string;
};

function isHttpUrl(value: string) {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

type ProfileFormProps = {
  user: ProfileUser;
  onUpdated: () => Promise<void> | void;
};

export default function ProfileForm({ user, onUpdated }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync the fields when the refreshed session comes back (React's
  // documented "adjusting state when a prop changes" pattern).
  const [lastUser, setLastUser] = useState(user);
  if (lastUser !== user) {
    setLastUser(user);
    setName(user.name ?? "");
    setImage(user.image ?? "");
    setPreviewFailed(false);
  }

  const isDirty = name !== (user.name ?? "") || image !== (user.image ?? "");
  const previewValue = image.trim();
  const showPreview = isHttpUrl(previewValue) && !previewFailed;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextNameError =
      name.trim().length < 2
        ? "Please enter your full name (at least 2 characters)."
        : "";
    const nextImageError =
      previewValue && !isHttpUrl(previewValue)
        ? "Please enter a valid URL starting with http:// or https://."
        : "";

    setNameError(nextNameError);
    setImageError(nextImageError);
    if (nextNameError || nextImageError) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), image: previewValue }),
      });
      const result: { message?: string; error?: { message?: string } } =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error?.message || "Could not update your profile."
        );
      }

      toast.success("Profile updated successfully.");
      await onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="rounded-2xl border-emerald-950/10 bg-white shadow-sm dark:border-emerald-100/10 dark:bg-[#18251e]">
        <CardHeader className="px-6 pb-1 pt-6">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            Update profile
          </CardTitle>
          <CardDescription className="text-sm">
            Change your display name or profile photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="profile-name">
                Full name <span className="text-rose-600">*</span>
              </label>
              <Input
                aria-invalid={nameError ? true : undefined}
                className="h-11 rounded-lg text-sm"
                id="profile-name"
                name="name"
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) setNameError("");
                }}
                required
                value={name}
              />
              {nameError && (
                <p className="text-xs text-rose-700 dark:text-rose-300" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="profile-email">
                Email
              </label>
              <Input
                className="h-11 rounded-lg text-sm"
                disabled
                id="profile-email"
                readOnly
                value={user.email ?? ""}
              />
              <p className="text-[11px] text-muted-foreground">
                Your email is used to sign in and cannot be changed.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="profile-image">
                Profile photo URL
              </label>
              <div className="flex items-center gap-3">
                <Input
                  aria-invalid={imageError ? true : undefined}
                  className="h-11 min-w-0 flex-1 rounded-lg text-sm"
                  id="profile-image"
                  name="image"
                  onChange={(event) => {
                    setImage(event.target.value);
                    setPreviewFailed(false);
                    if (imageError) setImageError("");
                  }}
                  placeholder="https://example.com/your-photo.jpg"
                  type="url"
                  value={image}
                />
                <span
                  className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-emerald-950/10 bg-emerald-50 dark:border-emerald-100/10 dark:bg-emerald-950"
                  aria-hidden="true"
                >
                  {showPreview ? (
                    // Preview of a user-entered URL; falls back if it fails to load.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="size-full object-cover"
                      onError={() => setPreviewFailed(true)}
                      src={previewValue}
                    />
                  ) : (
                    <ImageIcon className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                  )}
                </span>
              </div>
              {imageError && (
                <p className="text-xs text-rose-700 dark:text-rose-300" role="alert">
                  {imageError}
                </p>
              )}
            </div>

            <Button
              className="h-10 w-full rounded-lg bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800"
              disabled={isSaving || !isDirty}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}

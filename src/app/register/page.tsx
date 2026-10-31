"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinimumLength = password.length >= 8;
  const canSubmit = hasUppercase && hasLowercase && hasMinimumLength;

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          image: photoUrl.trim() || undefined,
        }),
      });

      const result: { message?: string; error?: { message?: string } } =
        await response.json();

      if (!response.ok) {
        setMessage(result.message || result.error?.message || "Could not create account.");
        return;
      }

      setMessage("Account created successfully. You can return to the home page.");
      setName("");
      setEmail("");
      setPhotoUrl("");
      setPassword("");
    } catch {
      setMessage("Could not connect to the server. Please check that it is running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-[calc(100vh-86px)] items-center justify-center bg-[#f6f8f7] px-4 py-9 dark:bg-[#111a16] sm:px-6">
        <Card className="w-full max-w-[430px] rounded-2xl border-emerald-950/10 bg-white shadow-[0_16px_50px_-28px_rgba(20,70,48,0.28)] dark:bg-[#18251e]">
          <CardHeader className="items-center gap-2 px-7 pb-5 pt-7 text-center sm:px-9 sm:pt-9">
            <div className="mb-1 flex w-full justify-center">
              <img
                className="block size-12 rounded-2xl"
                src="/goodneighbor-symbol.svg"
                alt="GoodNeighbor logo"
                width="48"
                height="48"
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
              Create Account
            </CardTitle>
            <CardDescription className="max-w-xs text-xs leading-5">
              Join the community and start helping your neighbours.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-7 pb-7 sm:px-9 sm:pb-9">
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="name">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoComplete="name"
                    className="h-10 rounded-lg border-emerald-950/10 bg-[#fbfcfb] pl-10 text-xs dark:bg-[#111a16]"
                    id="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    required
                    value={name}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoComplete="email"
                    className="h-10 rounded-lg border-emerald-950/10 bg-[#fbfcfb] pl-10 text-xs dark:bg-[#111a16]"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="photoUrl">
                  Profile photo URL <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 rounded-lg border-emerald-950/10 bg-[#fbfcfb] pl-10 text-xs dark:bg-[#111a16]"
                    id="photoUrl"
                    onChange={(event) => setPhotoUrl(event.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    type="url"
                    value={photoUrl}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Leave empty to use the default profile image.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoComplete="new-password"
                    className="h-10 rounded-lg border-emerald-950/10 bg-[#fbfcfb] pl-10 pr-10 text-xs dark:bg-[#111a16]"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="mt-1 flex flex-col gap-1">
                  <p className={hasUppercase ? "flex items-center gap-1.5 text-[10px] text-emerald-700" : "flex items-center gap-1.5 text-[10px] text-muted-foreground"}>
                    {hasUppercase ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    At least one uppercase letter (A-Z)
                  </p>
                  <p className={hasLowercase ? "flex items-center gap-1.5 text-[10px] text-emerald-700" : "flex items-center gap-1.5 text-[10px] text-muted-foreground"}>
                    {hasLowercase ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    At least one lowercase letter (a-z)
                  </p>
                  <p className={hasMinimumLength ? "flex items-center gap-1.5 text-[10px] text-emerald-700" : "flex items-center gap-1.5 text-[10px] text-muted-foreground"}>
                    {hasMinimumLength ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    At least 8 characters
                  </p>
                </div>
              </div>

              {message && (
                <p
                  aria-live="polite"
                  className="rounded-lg bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                >
                  {message}
                </p>
              )}

              <Button
                className="mt-1 h-10 w-full rounded-lg bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800"
                disabled={isLoading || !canSubmit}
                type="submit"
              >
                {isLoading ? "Creating account..." : "Register"}
                {!isLoading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200"
                href="/login"
              >
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

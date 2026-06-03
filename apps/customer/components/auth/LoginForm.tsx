"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, useToast } from "@zoomoff/ui";
import { loginSchema, type LoginInput } from "@zoomoff/validators";
import { authApi } from "@zoomoff/api-client";
import { setAuthTokens } from "@zoomoff/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [attempts, setAttempts] = React.useState(0);
  const [lockedUntil, setLockedUntil] = React.useState<Date | null>(null);
  const [showCaptcha, setShowCaptcha] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const isLocked = lockedUntil ? new Date() < lockedUntil : false;

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: ({ user, tokens, requiresMfa }) => {
      if (requiresMfa) {
        router.push("/verify-mfa");
        return;
      }
      setAuthTokens(tokens.accessToken, user);
      const next = params.get("next") ?? "/dashboard";
      router.replace(next);
    },
    onError: () => {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 10) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        setLockedUntil(lockUntil);
        toast({
          type: "error",
          title: "Account temporarily locked",
          description: `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
        });
        return;
      }

      if (newAttempts >= MAX_ATTEMPTS) {
        setShowCaptcha(true);
      }

      toast({
        type: "error",
        title: "Invalid credentials",
        description: "Check your email/phone and password and try again.",
      });
    },
  });

  if (isLocked) {
    return (
      <div className="text-center py-4">
        <p className="text-sm font-semibold text-zo-error">Account Locked</p>
        <p className="mt-1 text-xs text-zo-muted">
          Too many failed attempts. Try again after{" "}
          {lockedUntil?.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((d) => login(d))} noValidate className="space-y-4">
      <Input
        label="Email or Phone"
        type="text"
        autoComplete="username"
        placeholder="you@example.com or 08012345678"
        error={errors.identifier?.message}
        {...register("identifier")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register("password")}
      />

      {showCaptcha && (
        <div className="rounded-xl border border-zo-warning bg-zo-warning-light p-3 text-xs text-zo-warning">
          Too many failed attempts. Please complete the security check.
          {/* Cloudflare Turnstile widget would be embedded here */}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-zo-muted cursor-pointer">
          <input type="checkbox" className="h-4 w-4 rounded border-zo-border accent-brand-gold" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm text-zo-muted hover:text-brand-charcoal">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
        Log In
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-zo-border" />
        <span className="text-xs text-zo-muted">or continue with</span>
        <div className="flex-1 border-t border-zo-border" />
      </div>

      <Button type="button" variant="outline" size="lg" className="w-full" disabled={isPending}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}

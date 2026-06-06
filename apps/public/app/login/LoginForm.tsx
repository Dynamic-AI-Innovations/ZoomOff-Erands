"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function LoginForm() {
  const [email, setEmail]       = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors]     = React.useState<{ email?: string; password?: string; global?: string }>({});
  const [loading, setLoading]   = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!isEmail(email)) e.email = "Enter a valid email address.";
    if (password.length < 1) e.password = "Password is required.";
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-brand-gold" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Welcome back!</h1>
        <p className="text-sm text-zo-muted mt-2">You&apos;re logged in. Taking you to your dashboard…</p>
        <Button variant="primary" size="lg" className="mt-8 w-full" asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mb-8">
        <Image src="/logo.png" alt="ZoomOff Errand Services" width={160} height={64} className="h-16 w-auto object-contain mb-4" priority />
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Welcome back</h1>
        <p className="text-sm text-zo-muted mt-1">Log in to your ZoomOff account</p>
      </div>

      {errors.global && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.global}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="login-email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className={cn("h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.email ? "border-red-400" : "border-zo-border")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-brand-charcoal" htmlFor="login-password">Password</label>
            <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Your password"
              className={cn("h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.password ? "border-red-400" : "border-zo-border")}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Logging in…</> : "Log In"}
        </Button>
      </div>

      <p className="text-center text-sm text-zo-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-gold font-medium hover:underline">Sign up free</Link>
      </p>
      <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
        Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
      </p>
    </div>
  );
}

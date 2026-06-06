"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@zoomoff/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function handleSubmit() {
    if (!email.trim()) { setError("Email address is required."); return; }
    if (!isValidEmail(email)) { setError("Please enter a valid email address."); return; }
    setError("");
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
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Check your inbox</h1>
        <p className="text-sm text-zo-muted mt-2 leading-relaxed">
          We sent a password reset link to <span className="font-semibold text-brand-charcoal">{email}</span>.
          It expires in 30 minutes.
        </p>
        <div className="mt-8 space-y-3">
          <p className="text-xs text-zo-muted">Didn&apos;t receive it? Check your spam folder or</p>
          <button
            onClick={() => { setSubmitted(false); setEmail(""); }}
            className="text-sm font-semibold text-brand-gold hover:underline"
          >
            Try a different email address
          </button>
        </div>
        <div className="mt-8 border-t border-zo-border pt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Log In
          </Link>
        </div>
        <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Log In
      </Link>

      <div className="mb-8">
        <Image src="/logo.png" alt="ZoomOff" width={160} height={64} className="h-16 w-auto object-contain mb-5" priority />
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Reset your password</h1>
        <p className="text-sm text-zo-muted mt-1 leading-relaxed">
          Enter the email linked to your account and we&apos;ll send a reset link.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="email">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className={`h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition ${error ? "border-red-400" : "border-zo-border"}`}
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</>
          ) : (
            <>Send Reset Link <ArrowRight className="h-4 w-4 ml-1.5" /></>
          )}
        </Button>

        <p className="text-xs text-zo-muted text-center leading-relaxed">
          Check your spam folder if you don&apos;t see the email within 5 minutes.
        </p>
      </div>

      <p className="text-center text-sm text-zo-muted mt-6">
        Remembered it?{" "}
        <Link href="/login" className="text-brand-gold font-medium hover:underline">Log in</Link>
      </p>
      <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
        Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
      </p>
    </div>
  );
}

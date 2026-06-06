import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Log In | ZoomOff" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="mb-8">
          <Image src="/logo.png" alt="ZoomOff Errand Services" width={160} height={64} className="h-16 w-auto object-contain mb-4" priority />
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Welcome back</h1>
          <p className="text-sm text-zo-muted mt-1">Log in to your ZoomOff account</p>
        </div>

        <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-brand-charcoal" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input
                id="password"
                type="password"
                placeholder="Your password"
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full mt-2">
            Log In
          </Button>
        </div>

        <p className="text-center text-sm text-zo-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-gold font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

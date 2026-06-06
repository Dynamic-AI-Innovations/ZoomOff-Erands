import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Sign Up | ZoomOff" };

export default function RegisterPage() {
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
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Create your account</h1>
          <p className="text-sm text-zo-muted mt-1">Post your first errand in under 60 seconds</p>
        </div>

        <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 space-y-4">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="name">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input
                id="name"
                type="text"
                placeholder="Adaeze Okonkwo"
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="phone">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input
                id="phone"
                type="tel"
                placeholder="0801 234 5678"
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full mt-2">
            Create Account — It&apos;s Free
          </Button>

          <p className="text-xs text-zo-muted text-center leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/legal/terms" className="text-brand-gold hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-zo-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-gold font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

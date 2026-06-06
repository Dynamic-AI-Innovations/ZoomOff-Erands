import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Lock, MapPin, Bike } from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Runner Application | ZoomOff" };

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Other"];

export default function RunnerApplyPage() {
  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Top bar */}
      <div className="bg-brand-charcoal px-4 py-3 text-center">
        <p className="text-sm text-gray-300">
          Earn up to{" "}
          <span className="font-bold text-brand-gold">₦150,000/month</span>{" "}
          running errands on your schedule.
        </p>
      </div>

      <div className="flex min-h-[calc(100vh-48px)] items-start justify-center p-4 pt-10">
        <div className="w-full max-w-lg">
          {/* Back */}
          <Link
            href="/become-a-runner"
            className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Logo + heading */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="ZoomOff"
              width={160}
              height={64}
              className="h-16 w-auto object-contain mb-5"
              priority
            />
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <Bike className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight">
                Runner Application
              </h1>
            </div>
            <p className="text-sm text-zo-muted ml-[52px]">
              Apply in 10 minutes. Start earning within 24 hours of approval.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-zo-border shadow-card p-7 space-y-5">

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
                  placeholder="Chukwuemeka Okafor"
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

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="city">
                City of operation
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" aria-hidden="true" />
                <select
                  id="city"
                  className="h-11 w-full appearance-none rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                  defaultValue=""
                >
                  <option value="" disabled>Select your city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="password">
                Create a password
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

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zo-border accent-brand-gold"
              />
              <span className="text-xs text-zo-muted leading-relaxed">
                I confirm I am a Nigerian citizen aged 18+, hold a valid ID and bank account, and agree to the{" "}
                <Link href="/legal/terms" className="text-brand-gold hover:underline">Runner Terms</Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <Button variant="primary" size="lg" className="w-full mt-2">
              Submit Application
            </Button>
          </div>

          {/* What happens next */}
          <div className="mt-6 rounded-2xl border border-zo-border bg-white p-5">
            <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-3">What happens next</p>
            <ol className="space-y-2.5">
              {[
                "We review your application (usually within 2 hours)",
                "You complete a quick 4-module online training",
                "Your KYC is verified (NIN + BVN + selfie)",
                "You go live and start accepting errands",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zo-muted">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold font-bold text-2xs">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
            Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
          </p>
        </div>
      </div>
    </div>
  );
}

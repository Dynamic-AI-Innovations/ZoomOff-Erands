"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Lock, MapPin, Bike, CheckCircle, Loader2, Star } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Other"];
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Fields = { name: string; phone: string; email: string; city: string; password: string; agreed: boolean };
type Errs   = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errs {
  const e: Errs = {};
  if (f.name.trim().length < 2) e.name = "Full name is required.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid Nigerian phone number.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.city) e.city = "Please select your city.";
  if (f.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (!f.agreed) e.agreed = "You must confirm the requirements to apply.";
  return e;
}

export function RunnerApplyForm() {
  const [fields, setFields] = React.useState<Fields>({ name: "", phone: "", email: "", city: "", password: "", agreed: false });
  const [errors, setErrors] = React.useState<Errs>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = key === "agreed" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFields(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  async function handleSubmit() {
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zo-bg-light">
        <div className="bg-brand-charcoal px-4 py-3 text-center">
          <p className="text-sm text-gray-300">
            Earn up to <span className="font-bold text-brand-gold">₦150,000/month</span> running errands on your schedule.
          </p>
        </div>
        <div className="flex min-h-[calc(100vh-48px)] items-start justify-center p-4 pt-10">
          <div className="w-full max-w-lg text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-brand-gold" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight">Application Received!</h1>
            <p className="mt-2 text-zo-muted text-sm">
              Great work, <span className="font-semibold text-brand-charcoal">{fields.name.split(" ")[0]}</span>! We'll review your application and get back to you at{" "}
              <span className="font-semibold text-brand-charcoal">{fields.email}</span>.
            </p>

            {/* Earnings teaser */}
            <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5 text-left flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold shrink-0">
                <Star className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-brand-charcoal text-sm">Top runners in {fields.city || "your city"} earn</p>
                <p className="font-display text-2xl font-extrabold text-brand-gold tracking-tight">₦80k–₦150k/month</p>
              </div>
            </div>

            {/* Steps */}
            <div className="mt-6 rounded-2xl border border-zo-border bg-white p-5 text-left">
              <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest mb-4">What happens next</p>
              <ol className="space-y-3">
                {[
                  { n: 1, step: "We review your application", note: "Usually within 2 hours" },
                  { n: 2, step: "Complete 4-module online training", note: "~30 minutes, fully online" },
                  { n: 3, step: "KYC verification (NIN + BVN + selfie)", note: "Fast and secure" },
                  { n: 4, step: "Go live and start accepting errands!", note: "Earn same day" },
                ].map(({ n, step, note }) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs">{n}</span>
                    <div>
                      <p className="text-sm font-medium text-brand-charcoal">{step}</p>
                      <p className="text-xs text-zo-muted">{note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
              Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (key: keyof Fields) => cn(
    "h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition",
    errors[key] ? "border-red-400" : "border-zo-border"
  );

  return (
    <div className="min-h-screen bg-zo-bg-light">
      <div className="bg-brand-charcoal px-4 py-3 text-center">
        <p className="text-sm text-gray-300">
          Earn up to <span className="font-bold text-brand-gold">₦150,000/month</span> running errands on your schedule.
        </p>
      </div>

      <div className="flex min-h-[calc(100vh-48px)] items-start justify-center p-4 pt-10">
        <div className="w-full max-w-lg">
          <Link href="/become-a-runner" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="mb-8">
            <Image src="/logo.png" alt="ZoomOff" width={160} height={64} className="h-16 w-auto object-contain mb-5" priority />
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <Bike className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight">Runner Application</h1>
            </div>
            <p className="text-sm text-zo-muted ml-[52px]">Apply in 10 minutes. Start earning within 24 hours of approval.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zo-border shadow-card p-7 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="ra-name">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
                <input id="ra-name" type="text" value={fields.name} onChange={set("name")} placeholder="Chukwuemeka Okafor" className={inputClass("name")} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="ra-phone">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
                <input id="ra-phone" type="tel" value={fields.phone} onChange={set("phone")} placeholder="0801 234 5678" className={inputClass("phone")} />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="ra-email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
                <input id="ra-email" type="email" value={fields.email} onChange={set("email")} placeholder="you@example.com" className={inputClass("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="ra-city">City of operation</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted pointer-events-none" aria-hidden="true" />
                <select
                  id="ra-city"
                  value={fields.city}
                  onChange={set("city")}
                  className={cn("h-11 w-full appearance-none rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.city ? "border-red-400" : "border-zo-border")}
                >
                  <option value="" disabled>Select your city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="ra-password">Create a password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
                <input id="ra-password" type="password" value={fields.password} onChange={set("password")} placeholder="Min. 8 characters" className={inputClass("password")} />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={fields.agreed} onChange={set("agreed")} className="mt-0.5 h-4 w-4 shrink-0 rounded border-zo-border accent-brand-gold" />
              <span className={cn("text-xs leading-relaxed", errors.agreed ? "text-red-500" : "text-zo-muted")}>
                I confirm I am a Nigerian citizen aged 18+, hold a valid ID and bank account, and agree to the{" "}
                <Link href="/legal/terms" className="text-brand-gold hover:underline">Runner Terms</Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting Application…</>
              ) : (
                "Submit Application"
              )}
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
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold font-bold text-2xs">{i + 1}</span>
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

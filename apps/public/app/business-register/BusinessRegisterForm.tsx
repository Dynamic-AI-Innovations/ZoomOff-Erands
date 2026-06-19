"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, User, Phone, Mail, Lock,
  Building2, Users, CheckCircle, Loader2,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const TEAM_SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "201–500 employees", "500+ employees"];
const PERKS = [
  "Centralised team task management",
  "Approval workflows & spend controls",
  "Monthly invoice & expense reporting",
  "Dedicated account manager",
  "Volume discounts from 20+ tasks/month",
];
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Fields = { first: string; last: string; company: string; email: string; phone: string; size: string; password: string };
type Errs   = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errs {
  const e: Errs = {};
  if (!f.first.trim()) e.first = "Required.";
  if (!f.company.trim()) e.company = "Company name is required.";
  if (!isEmail(f.email)) e.email = "Enter a valid work email.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
  if (!f.size) e.size = "Please select your team size.";
  if (f.password.length < 8) e.password = "Password must be at least 8 characters.";
  return e;
}

export function BusinessRegisterForm() {
  const [fields, setFields] = React.useState<Fields>({ first: "", last: "", company: "", email: "", phone: "", size: "", password: "" });
  const [errors, setErrors] = React.useState<Errs>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  async function handleSubmit() {
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  }

  const iClass = (key: keyof Fields) => cn(
    "h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition",
    errors[key] ? "border-red-500/70" : ""
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-zo-bg-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-brand-gold" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Trial Activated!</h1>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Welcome aboard, <span className="font-semibold text-white">{fields.first}</span>! We sent account setup instructions to{" "}
            <span className="font-semibold text-brand-gold">{fields.email}</span>.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-left space-y-4">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">Next steps</p>
            {[
              "Verify your email to activate your account",
              "Invite team members from the dashboard",
              "Post your first batch of business errands",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/login">Go to Log In</Link>
            </Button>
            <Link href="/business" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Back to ZoomOff Errands for Business
            </Link>
          </div>
          <p className="text-center text-2xs text-gray-700 mt-8 tracking-wide">
            Powered by <span className="text-brand-gold/70">Dynamics Technology</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zo-bg-dark">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container-max section-padding flex h-16 items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="ZoomOff Errands" width={100} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Already have an account? <span className="text-brand-gold">Log in</span>
          </Link>
        </div>
      </div>

      <div className="container-max section-padding py-12 max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: value prop */}
          <div className="pt-4">
            <Link href="/business" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to ZoomOff Errands for Business
            </Link>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold mb-6">
              <Building2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight md:text-4xl">
              Start your free <span className="text-brand-gold">Business trial</span>
            </h1>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Set up your team account in minutes. No card required for the 14-day trial. Cancel anytime.
            </p>
            <ul className="mt-8 space-y-3">
              {PERKS.map(perk => (
                <li key={perk} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Already trusted by</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Logistics firms, retail chains, law firms, and fintech companies across Nigeria use ZoomOff Errands Business to eliminate errand overhead.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-1">Create your business account</h2>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-first">First name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
                    <input id="br-first" type="text" value={fields.first} onChange={set("first")} placeholder="Adaeze" className={iClass("first")} />
                  </div>
                  {errors.first && <p className="text-xs text-red-400 mt-1">{errors.first}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-last">Last name</label>
                  <input id="br-last" type="text" value={fields.last} onChange={set("last")} placeholder="Okonkwo" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition" />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-company">Company name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
                  <input id="br-company" type="text" value={fields.company} onChange={set("company")} placeholder="Acme Logistics Ltd." className={iClass("company")} />
                </div>
                {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-email">Work email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
                  <input id="br-email" type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" className={iClass("email")} />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-phone">Phone number <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
                  <input id="br-phone" type="tel" value={fields.phone} onChange={set("phone")} placeholder="0801 234 5678" className={iClass("phone")} />
                </div>
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              {/* Team size */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-size">Team size <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" aria-hidden="true" />
                  <select
                    id="br-size"
                    value={fields.size}
                    onChange={set("size")}
                    className={cn("h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.size ? "border-red-500/70" : "")}
                  >
                    <option value="" disabled className="bg-zo-bg-dark">Select team size</option>
                    {TEAM_SIZES.map(s => <option key={s} value={s} className="bg-zo-bg-dark">{s}</option>)}
                  </select>
                </div>
                {errors.size && <p className="text-xs text-red-400 mt-1">{errors.size}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5" htmlFor="br-password">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
                  <input id="br-password" type="password" value={fields.password} onChange={set("password")} placeholder="Min. 8 characters" className={iClass("password")} />
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Setting up trial…</>
                ) : (
                  <>Start 14-Day Free Trial <ArrowRight className="h-4 w-4 ml-1.5" /></>
                )}
              </Button>

              <p className="text-xs text-gray-600 text-center leading-relaxed">
                No credit card required. By continuing you agree to our{" "}
                <Link href="/legal/terms" className="text-brand-gold hover:underline">Terms</Link>{" "}
                &amp;{" "}
                <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <p className="text-center text-xs text-gray-600 mt-5">
              Need help?{" "}
              <Link href="/business#contact" className="text-brand-gold hover:underline">Book a demo instead</Link>
            </p>
            <p className="text-center text-2xs text-gray-700 mt-6 tracking-wide">
              Powered by <span className="text-brand-gold/70">Dynamics Technology</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

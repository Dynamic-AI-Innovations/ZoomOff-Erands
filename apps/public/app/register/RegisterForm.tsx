"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Phone, CheckCircle, Loader2, Gift } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";
import { getStoredRef, clearRef } from "@/lib/referral";

type Fields = { name: string; phone: string; email: string; password: string; agreed: boolean };
type Errs   = Partial<Record<keyof Fields, string>>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate(f: Fields): Errs {
  const e: Errs = {};
  if (!f.name.trim()) e.name = "Full name is required.";
  if (!f.phone.replace(/\D/g, "") || f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid Nigerian phone number.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (f.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (!f.agreed) e.agreed = "You must accept the terms to continue.";
  return e;
}

export function RegisterForm() {
  const [fields, setFields] = React.useState<Fields>({ name: "", phone: "", email: "", password: "", agreed: false });
  const [errors, setErrors] = React.useState<Errs>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [referral, setReferral] = React.useState<{ code: string; source: string } | null>(null);

  React.useEffect(() => { setReferral(getStoredRef()); }, []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = key === "agreed" ? e.target.checked : e.target.value;
    setFields(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  async function handleSubmit() {
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    clearRef();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-brand-gold" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Verify your email</h1>
        <p className="text-sm text-zo-muted mt-2 leading-relaxed">
          We sent a verification link to{" "}
          <span className="font-semibold text-brand-charcoal">{fields.email}</span>.
          Click it to activate your account.
        </p>
        <div className="mt-8 bg-white rounded-2xl border border-zo-border shadow-card p-5 text-left space-y-3">
          <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">What to do next</p>
          {[
            "Check your inbox (and spam folder)",
            "Click the verification link in the email",
            "Log in and delegate your first errand",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-brand-charcoal">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs">{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" className="w-full mt-6" asChild>
          <Link href="/login">Go to Log In</Link>
        </Button>
        <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    );
  }

  const field = (id: keyof Fields) => ({
    error: errors[id],
    baseClass: "h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition",
    className: cn("h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors[id] ? "border-red-400" : "border-zo-border"),
  });

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mb-8">
        <Image src="/logo.png" alt="ZoomOff Errands" width={160} height={64} className="h-16 w-auto object-contain mb-4" priority />
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Create your account</h1>
        <p className="text-sm text-zo-muted mt-1">Post your first errand in under 60 seconds</p>
      </div>

      {referral && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3">
          <Gift className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-brand-charcoal">You were referred!</p>
            <p className="text-xs text-zo-muted mt-0.5">
              You'll receive <span className="font-bold text-brand-gold">₦500 credit</span> on your first completed errand.{" "}
              Code: <span className="font-mono text-brand-charcoal">{referral.code}</span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="reg-name">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input id="reg-name" type="text" value={fields.name} onChange={set("name")} placeholder="Adaeze Okonkwo" className={field("name").className} />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="reg-phone">Phone number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input id="reg-phone" type="tel" value={fields.phone} onChange={set("phone")} placeholder="0801 234 5678" className={field("phone").className} />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="reg-email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input id="reg-email" type="email" value={fields.email} onChange={set("email")} placeholder="you@example.com" className={field("email").className} />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5" htmlFor="reg-password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
            <input id="reg-password" type="password" value={fields.password} onChange={set("password")} placeholder="Min. 8 characters" className={field("password").className} />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={fields.agreed} onChange={set("agreed")} className="mt-0.5 h-4 w-4 shrink-0 rounded border-zo-border accent-brand-gold" />
          <span className={cn("text-xs leading-relaxed", errors.agreed ? "text-red-500" : "text-zo-muted")}>
            By signing up you agree to our{" "}
            <Link href="/legal/terms" className="text-brand-gold hover:underline">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
          </span>
        </label>

        <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating account…</>
          ) : (
            "Create Account — It's Free"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-zo-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-gold font-medium hover:underline">Log in</Link>
      </p>
      <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
        Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, ShoppingCart, FileText, Pill,
  CreditCard, Building2, Users, Package, ClipboardList,
  Home, PenLine, MapPin, Clock, StickyNote, CheckCircle,
  Mail, Lock, User, Phone,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const CATEGORIES = [
  { icon: ShoppingCart, label: "Grocery Shopping" },
  { icon: FileText, label: "Document Pickup" },
  { icon: Pill, label: "Pharmacy Run" },
  { icon: CreditCard, label: "Bill Payment" },
  { icon: Building2, label: "Banking Errand" },
  { icon: Users, label: "Queue Standing" },
  { icon: Package, label: "Parcel Delivery" },
  { icon: ClipboardList, label: "Administrative" },
  { icon: Home, label: "Home Errand" },
  { icon: PenLine, label: "Custom / Other" },
];

const DRAFT_KEY = "zo_errand_draft";

type Draft = {
  category: string;
  description: string;
  pickup: string;
  dropoff: string;
  when: "asap" | "scheduled";
  scheduledAt: string;
  notes: string;
};

const EMPTY: Draft = {
  category: "",
  description: "",
  pickup: "",
  dropoff: "",
  when: "asap",
  scheduledAt: "",
  notes: "",
};

function loadDraft(): Draft {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function saveDraft(d: Draft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
}

// ─── Step indicator ───────────────────────────────────────────────
function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Errand Details", "Your Account", "Confirmed!"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                done ? "bg-brand-gold text-brand-charcoal" :
                active ? "bg-brand-charcoal text-white" :
                "bg-zo-border text-zo-muted"
              )}>
                {done ? <CheckCircle className="h-4 w-4" /> : num}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                active ? "text-brand-charcoal" : "text-zo-muted"
              )}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-px transition-colors",
                done ? "bg-brand-gold" : "bg-zo-border"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Step 1: Errand Details ───────────────────────────────────────
function Step1({ draft, setDraft, onNext }: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onNext: () => void;
}) {
  const set = (k: keyof Draft, v: string) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    saveDraft(next);
  };

  const valid = draft.category && draft.description.trim().length > 10 && draft.pickup.trim().length > 3;

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-brand-charcoal mb-3">What type of errand?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => set("category", label)}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-medium transition-all",
                draft.category === label
                  ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal"
                  : "border-zo-border bg-white text-zo-muted hover:border-brand-gold/40 hover:text-brand-charcoal"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", draft.category === label ? "text-brand-gold" : "")} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-brand-charcoal mb-1.5" htmlFor="desc">
          Describe what you need
        </label>
        <textarea
          id="desc"
          rows={3}
          placeholder="e.g. Pick up 3 bags of rice and 2 litres of groundnut oil from Shoprite Ikeja, and deliver to my office at 12 Broad Street, Lagos Island."
          value={draft.description}
          onChange={e => set("description", e.target.value)}
          className="w-full rounded-xl border border-zo-border bg-zo-bg-light px-4 py-3 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none transition"
        />
      </div>

      {/* Pickup */}
      <div>
        <label className="block text-sm font-semibold text-brand-charcoal mb-1.5" htmlFor="pickup">
          Pickup / starting location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
          <input
            id="pickup"
            type="text"
            placeholder="e.g. Shoprite, Ikeja City Mall"
            value={draft.pickup}
            onChange={e => set("pickup", e.target.value)}
            className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Drop-off */}
      <div>
        <label className="block text-sm font-semibold text-brand-charcoal mb-1.5" htmlFor="dropoff">
          Delivery / drop-off location <span className="text-zo-muted font-normal">(optional)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
          <input
            id="dropoff"
            type="text"
            placeholder="e.g. 12 Broad Street, Lagos Island"
            value={draft.dropoff}
            onChange={e => set("dropoff", e.target.value)}
            className="h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
          />
        </div>
      </div>

      {/* When */}
      <div>
        <p className="text-sm font-semibold text-brand-charcoal mb-2">When do you need this?</p>
        <div className="flex gap-3">
          {(["asap", "scheduled"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("when", v)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                draft.when === v
                  ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal"
                  : "border-zo-border bg-white text-zo-muted hover:border-brand-gold/40"
              )}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              {v === "asap" ? "ASAP" : "Schedule for later"}
            </button>
          ))}
        </div>
        {draft.when === "scheduled" && (
          <input
            type="datetime-local"
            value={draft.scheduledAt}
            onChange={e => set("scheduledAt", e.target.value)}
            className="mt-3 h-11 w-full rounded-xl border border-zo-border bg-zo-bg-light px-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-gold transition"
          />
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-brand-charcoal mb-1.5" htmlFor="notes">
          Additional notes <span className="text-zo-muted font-normal">(optional)</span>
        </label>
        <div className="relative">
          <StickyNote className="absolute left-3 top-3 h-4 w-4 text-zo-muted" aria-hidden="true" />
          <textarea
            id="notes"
            rows={2}
            placeholder="Any special instructions for your runner..."
            value={draft.notes}
            onChange={e => set("notes", e.target.value)}
            className="w-full rounded-xl border border-zo-border bg-zo-bg-light pl-10 pr-4 py-3 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none transition"
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onNext}
        disabled={!valid}
      >
        Continue — Set Up Your Account
        <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
      </Button>

      {!valid && (
        <p className="text-center text-xs text-zo-muted">
          Please select a category, describe your errand, and add a pickup location to continue.
        </p>
      )}
    </div>
  );
}

// ─── Step 2: Auth Gate ────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function Step2({ draft, onBack, onDone }: {
  draft: Draft;
  onBack: () => void;
  onDone: () => void;
}) {
  const [tab, setTab] = React.useState<"login" | "register">("register");
  const [reg, setReg] = React.useState({ name: "", phone: "", email: "", password: "" });
  const [log, setLog] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  const setRegField = (k: keyof typeof reg) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setReg(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };
  const setLogField = (k: keyof typeof log) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLog(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  async function handleSubmit() {
    const e: Record<string, string> = {};
    if (tab === "register") {
      if (reg.name.trim().length < 2) e.name = "Full name is required.";
      if (reg.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
      if (!isEmail(reg.email)) e.email = "Enter a valid email address.";
      if (reg.password.length < 8) e.password = "Password must be at least 8 characters.";
    } else {
      if (!isEmail(log.email)) e.email = "Enter a valid email address.";
      if (!log.password) e.password = "Password is required.";
    }
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onDone();
  }

  const inputCls = (key: string) => cn(
    "h-11 w-full rounded-xl border bg-zo-bg-light pl-10 pr-4 text-sm text-brand-charcoal placeholder:text-zo-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition",
    errors[key] ? "border-red-400" : "border-zo-border"
  );

  return (
    <div className="space-y-5">
      {/* Errand summary reminder */}
      <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-4">
        <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Your errand is saved</p>
        <div className="flex items-start gap-2 text-sm text-brand-charcoal">
          <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold">{draft.category || "Custom errand"}</span>
            {draft.pickup && <span className="text-zo-muted"> · from {draft.pickup}</span>}
            {draft.dropoff && <span className="text-zo-muted"> → {draft.dropoff}</span>}
          </div>
        </div>
        <p className="mt-1 ml-6 text-xs text-zo-muted line-clamp-2">{draft.description}</p>
      </div>

      <p className="text-sm text-zo-muted text-center">
        Create a free account or log in to submit your errand. Your details are saved.
      </p>

      {/* Tab toggle */}
      <div className="flex rounded-xl border border-zo-border bg-zo-bg-light p-1">
        {(["register", "login"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setErrors({}); }}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
              tab === t ? "bg-white shadow-sm text-brand-charcoal" : "text-zo-muted hover:text-brand-charcoal"
            )}
          >
            {t === "register" ? "Create Account" : "Log In"}
          </button>
        ))}
      </div>

      {tab === "register" ? (
        <div className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="text" value={reg.name} onChange={setRegField("name")} placeholder="Full name" className={inputCls("name")} />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="tel" value={reg.phone} onChange={setRegField("phone")} placeholder="Phone number" className={inputCls("phone")} />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="email" value={reg.email} onChange={setRegField("email")} placeholder="Email address" className={inputCls("email")} />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="password" value={reg.password} onChange={setRegField("password")} placeholder="Create a password (min. 8 chars)" className={inputCls("password")} />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account…" : <> Create Account & Submit Errand <ArrowRight className="h-4 w-4 ml-1.5" /></>}
          </Button>
          <p className="text-xs text-zo-muted text-center leading-relaxed">
            By continuing you agree to our{" "}
            <Link href="/legal/terms" className="text-brand-gold hover:underline">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/legal/privacy" className="text-brand-gold hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="email" value={log.email} onChange={setLogField("email")} placeholder="Email address" className={inputCls("email")} />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zo-muted" aria-hidden="true" />
              <input type="password" value={log.password} onChange={setLogField("password")} placeholder="Password" className={inputCls("password")} />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">Forgot password?</Link>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in…" : <> Log In & Submit Errand <ArrowRight className="h-4 w-4 ml-1.5" /></>}
          </Button>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-zo-muted hover:text-brand-charcoal transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to errand details
      </button>
    </div>
  );
}

// ─── Step 3: Confirmation ─────────────────────────────────────────
function Step3({ draft }: { draft: Draft }) {
  React.useEffect(() => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }, []);

  return (
    <div className="text-center space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/15 mx-auto">
        <CheckCircle className="h-10 w-10 text-brand-gold" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight">
          Errand submitted!
        </h2>
        <p className="mt-2 text-zo-muted text-sm">
          We&apos;re matching you with a verified runner near you. You&apos;ll get a notification within 5 minutes.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-zo-border bg-zo-bg-light p-5 text-left space-y-3">
        <p className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">Errand Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-zo-muted w-20 shrink-0">Category</span>
            <span className="font-medium text-brand-charcoal">{draft.category}</span>
          </div>
          {draft.pickup && (
            <div className="flex gap-2">
              <span className="text-zo-muted w-20 shrink-0">Pickup</span>
              <span className="font-medium text-brand-charcoal">{draft.pickup}</span>
            </div>
          )}
          {draft.dropoff && (
            <div className="flex gap-2">
              <span className="text-zo-muted w-20 shrink-0">Drop-off</span>
              <span className="font-medium text-brand-charcoal">{draft.dropoff}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-zo-muted w-20 shrink-0">When</span>
            <span className="font-medium text-brand-charcoal">
              {draft.when === "asap" ? "As soon as possible" : draft.scheduledAt}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="primary" size="lg" className="w-full" asChild>
          <Link href="/delegate">Request Another Errand</Link>
        </Button>
        <Button variant="outline" size="md" className="w-full" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main orchestrator ────────────────────────────────────────────
export function DelegateFlow() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [draft, setDraft] = React.useState<Draft>(EMPTY);

  React.useEffect(() => {
    setDraft(loadDraft());
  }, []);

  return (
    <div className="min-h-screen bg-zo-bg-light">
      {/* Top bar */}
      <div className="bg-brand-charcoal px-4 py-3">
        <div className="container-max flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="ZoomOff Errands"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-xs text-gray-400 hidden sm:block">
            Verified runners · Live GPS · Escrow payment
          </p>
        </div>
      </div>

      <div className="container-max section-padding py-10 max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight md:text-3xl">
            {step === 1 && "What errand do you need done?"}
            {step === 2 && "Almost there — set up your account"}
            {step === 3 && "You're all set!"}
          </h1>
          {step === 1 && (
            <p className="mt-1.5 text-sm text-zo-muted">
              Fill in the details below. Your draft is saved automatically so you won&apos;t lose anything.
            </p>
          )}
        </div>

        <StepBar step={step} />

        <div className="bg-white rounded-2xl border border-zo-border shadow-card p-6 md:p-8">
          {step === 1 && (
            <Step1
              draft={draft}
              setDraft={setDraft}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              draft={draft}
              onBack={() => setStep(1)}
              onDone={() => setStep(3)}
            />
          )}
          {step === 3 && <Step3 draft={draft} />}
        </div>

        <p className="text-center text-2xs text-zo-muted/60 mt-8 tracking-wide">
          Powered by <span className="text-brand-gold/80">Dynamics Technology</span>
        </p>
      </div>
    </div>
  );
}

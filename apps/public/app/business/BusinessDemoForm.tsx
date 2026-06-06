"use client";

import * as React from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const SIZES = ["1–10", "11–50", "51–200", "200+"];
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Fields = { first: string; last: string; email: string; company: string; size: string };
type Errs   = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errs {
  const e: Errs = {};
  if (!f.first.trim()) e.first = "Required";
  if (!isEmail(f.email)) e.email = "Enter a valid email.";
  if (!f.company.trim()) e.company = "Required";
  if (!f.size) e.size = "Required";
  return e;
}

export function BusinessDemoForm() {
  const [fields, setFields] = React.useState<Fields>({ first: "", last: "", email: "", company: "", size: "" });
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
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }

  const iClass = (key: keyof Fields) => cn(
    "h-10 w-full rounded-xl border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
    errors[key] ? "border-red-400" : "border-zo-border"
  );

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-brand-gold" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl font-bold text-brand-charcoal">Demo request received!</h3>
        <p className="mt-2 text-sm text-zo-muted leading-relaxed">
          Thanks, <span className="font-semibold text-brand-charcoal">{fields.first}</span>. Our team will reach out to{" "}
          <span className="font-semibold text-brand-charcoal">{fields.email}</span> within 1 business day to schedule your demo.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFields({ first: "", last: "", email: "", company: "", size: "" }); }}
          className="mt-6 text-sm font-semibold text-brand-gold hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">First name <span className="text-red-400">*</span></label>
          <input type="text" value={fields.first} onChange={set("first")} className={iClass("first")} placeholder="Adaeze" />
          {errors.first && <p className="text-xs text-red-500">{errors.first}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">Last name</label>
          <input type="text" value={fields.last} onChange={set("last")} className={iClass("last")} placeholder="Okonkwo" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Work email <span className="text-red-400">*</span></label>
        <input type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" className={iClass("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Company name <span className="text-red-400">*</span></label>
        <input type="text" value={fields.company} onChange={set("company")} className={iClass("company")} placeholder="Acme Ltd." />
        {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Team size <span className="text-red-400">*</span></label>
        <select value={fields.size} onChange={set("size")} className={cn("h-10 w-full rounded-xl border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold", errors.size ? "border-red-400" : "border-zo-border")}>
          <option value="" disabled>Select team size</option>
          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.size && <p className="text-xs text-red-500">{errors.size}</p>}
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Booking…</> : "Request Demo"}
      </Button>
    </div>
  );
}

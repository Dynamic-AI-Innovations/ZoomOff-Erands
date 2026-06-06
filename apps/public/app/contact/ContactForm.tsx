"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const TOPICS = [
  "I need help with an active errand",
  "Problem with a payment or charge",
  "Runner application enquiry",
  "Business account or partnership",
  "Media / press enquiry",
  "Other",
];

type Fields = { first: string; last: string; email: string; topic: string; message: string };
type Errs   = Partial<Record<keyof Fields, string>>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate(f: Fields): Errs {
  const e: Errs = {};
  if (!f.first.trim()) e.first = "First name is required.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.topic) e.topic = "Please select a topic.";
  if (f.message.trim().length < 10) e.message = "Please describe your issue (at least 10 characters).";
  return e;
}

export function ContactForm() {
  const [fields, setFields] = React.useState<Fields>({ first: "", last: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = React.useState<Errs>({});
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  if (submitted) {
    return (
      <div className="text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 mx-auto mb-5">
          <CheckCircle className="h-8 w-8 text-brand-gold" aria-hidden="true" />
        </div>
        <h2 className="font-display text-xl font-bold text-brand-charcoal">Message sent!</h2>
        <p className="mt-2 text-sm text-zo-muted leading-relaxed">
          Thanks, <span className="font-semibold text-brand-charcoal">{fields.first}</span>. We&apos;ll reply to{" "}
          <span className="font-semibold text-brand-charcoal">{fields.email}</span> within 2 hours during support hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFields({ first: "", last: "", email: "", topic: "", message: "" }); }}
          className="mt-6 text-sm font-semibold text-brand-gold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass = (key: keyof Fields) => cn(
    "h-10 w-full rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition",
    errors[key] ? "border-red-400" : "border-zo-border"
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal" htmlFor="c-first">First name <span className="text-red-400">*</span></label>
          <input id="c-first" type="text" value={fields.first} onChange={set("first")} placeholder="Amara" className={inputClass("first")} />
          {errors.first && <p className="text-xs text-red-500">{errors.first}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal" htmlFor="c-last">Last name</label>
          <input id="c-last" type="text" value={fields.last} onChange={set("last")} placeholder="Nwosu" className={inputClass("last")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal" htmlFor="c-email">Email address <span className="text-red-400">*</span></label>
        <input id="c-email" type="email" value={fields.email} onChange={set("email")} placeholder="you@example.com" className={inputClass("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal" htmlFor="c-topic">Topic <span className="text-red-400">*</span></label>
        <select id="c-topic" value={fields.topic} onChange={set("topic")} className={cn("h-10 w-full rounded-xl border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.topic ? "border-red-400" : "border-zo-border")}>
          <option value="" disabled>Select a topic</option>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.topic && <p className="text-xs text-red-500">{errors.topic}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal" htmlFor="c-msg">Message <span className="text-red-400">*</span></label>
        <textarea
          id="c-msg"
          rows={4}
          value={fields.message}
          onChange={set("message")}
          placeholder="Tell us what you need help with…"
          className={cn("w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition", errors.message ? "border-red-400" : "border-zo-border")}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</>
        ) : (
          <>Send Message <ArrowRight className="h-4 w-4 ml-1.5" /></>
        )}
      </Button>

      <p className="text-xs text-zo-muted text-center">
        We typically respond within 2 hours during support hours. For business enquiries:{" "}
        <Link href="/business#contact" className="text-brand-gold hover:underline">Book a demo</Link>.
      </p>
    </div>
  );
}

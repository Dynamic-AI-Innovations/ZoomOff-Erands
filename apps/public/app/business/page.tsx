import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Building2, BarChart3, Shield, Key } from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = {
  title: "ZoomOff for Business — Enterprise Errand Management",
  description: "Team task management, approval workflows, spend analytics and API access for businesses of all sizes.",
};

const FEATURES = [
  { icon: Building2, title: "Team Task Management", desc: "Post tasks on behalf of your team. Assign to departments. View a live Kanban board of all errands." },
  { icon: CheckCircle2, title: "Approval Workflows", desc: "Set spend thresholds that require manager or admin approval before tasks are dispatched." },
  { icon: BarChart3, title: "Spend Analytics", desc: "Real-time dashboards showing GMV by department, task type, and period. Export to PDF or Excel." },
  { icon: Key, title: "API + Webhooks", desc: "Integrate task creation into your ERP or operations system. Receive real-time event notifications." },
  { icon: Shield, title: "Compliance & Security", desc: "Role-based access, audit logs, NDPR-compliant data handling, and SSO (coming soon)." },
];

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-zo-bg-dark py-20">
        <div className="container-max section-padding text-center">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl text-balance">
            ZoomOff for <span className="text-brand-gold">Business</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300 text-balance">
            Move packages, pay bills, pick up documents — managed centrally across your entire team with full approval controls and spend visibility.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="https://business.zoomoff.africa/register">
                Start Free Trial <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="#contact">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container-max section-padding">
          <h2 className="font-display text-3xl font-bold text-brand-charcoal text-center mb-10">
            Everything your team needs
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-zo-border bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-brand-charcoal mb-1">{title}</h3>
                <p className="text-sm text-zo-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Demo form */}
      <section id="contact" className="bg-zo-bg-light py-16">
        <div className="container-max section-padding max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-brand-charcoal">Book a demo</h2>
            <p className="mt-2 text-zo-muted">Talk to our team. We&apos;ll set up your business account in under an hour.</p>
          </div>
          <div className="rounded-2xl border border-zo-border bg-white p-8 shadow-card space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">First name</label>
                <input type="text" className="h-10 w-full rounded-xl border border-zo-border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-charcoal">Last name</label>
                <input type="text" className="h-10 w-full rounded-xl border border-zo-border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-charcoal">Work email</label>
              <input type="email" className="h-10 w-full rounded-xl border border-zo-border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-charcoal">Company name</label>
              <input type="text" className="h-10 w-full rounded-xl border border-zo-border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-charcoal">Team size</label>
              <select className="h-10 w-full rounded-xl border border-zo-border px-3 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
                <option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select>
            </div>
            <Button variant="primary" size="lg" className="w-full">Request Demo</Button>
          </div>
        </div>
      </section>
    </>
  );
}

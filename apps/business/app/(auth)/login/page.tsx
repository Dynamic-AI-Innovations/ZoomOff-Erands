import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BusinessLoginForm } from "@/components/auth/BusinessLoginForm";
import { Skeleton } from "@zoomoff/ui";
export const metadata: Metadata = { title: "Business Log In" };
export default function BusinessLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="https://zoomoff.africa" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold font-display text-xl font-bold text-brand-charcoal">Z</span>
            <span className="font-display text-2xl font-bold text-brand-charcoal">ZoomOff Business</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Business Portal</h1>
          <p className="mt-1 text-sm text-zo-muted">Manage your organisation's errands and team</p>
        </div>
        <div className="rounded-2xl border border-zo-border bg-white p-6 shadow-card">
          <Suspense fallback={<div className="space-y-4"><Skeleton height={40} /><Skeleton height={40} /><Skeleton height={40} /></div>}>
            <BusinessLoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-zo-muted">
            New to ZoomOff Business?{" "}
            <Link href="/register" className="font-semibold text-brand-charcoal hover:text-brand-gold">Register your organisation</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

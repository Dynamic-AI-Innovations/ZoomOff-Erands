import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { RunnerLoginForm } from "@/components/auth/RunnerLoginForm";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Runner Log In" };

export default function RunnerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="https://zoomoff.africa" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold font-display text-xl font-bold text-brand-charcoal">Z</span>
            <span className="font-display text-2xl font-bold text-brand-charcoal">Runner Portal</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Welcome back, Runner</h1>
          <p className="mt-1 text-sm text-zo-muted">Log in to accept tasks and manage earnings</p>
        </div>
        <div className="rounded-2xl border border-zo-border bg-white p-6 shadow-card">
          <Suspense fallback={<div className="space-y-4"><Skeleton height={40} /><Skeleton height={40} /><Skeleton height={40} /></div>}>
            <RunnerLoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-zo-muted">
            New runner?{" "}
            <Link href="/register" className="font-semibold text-brand-charcoal hover:text-brand-gold">
              Apply here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

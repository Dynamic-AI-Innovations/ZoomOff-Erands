import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { RunnerLoginForm } from "@/components/auth/RunnerLoginForm";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Runner Log In" };

export default function RunnerLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="https://zoomoff.africa" className="inline-flex flex-col items-center gap-1 mb-6">
            <Image src="/logo.png" alt="ZoomOff Errands" width={160} height={64} className="h-16 w-auto object-contain" unoptimized />
            <span className="text-xs font-semibold tracking-widest uppercase text-zo-muted">Runner Portal</span>
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

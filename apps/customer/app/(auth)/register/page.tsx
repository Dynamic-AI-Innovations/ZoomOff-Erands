import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="https://zoomoff.africa" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold font-display text-xl font-bold text-brand-charcoal">Z</span>
            <span className="font-display text-2xl font-bold text-brand-charcoal">ZoomOff</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Create your account</h1>
          <p className="mt-1 text-sm text-zo-muted">Post your first errand in minutes</p>
        </div>
        <div className="rounded-2xl border border-zo-border bg-white p-6 shadow-card">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-zo-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-charcoal hover:text-brand-gold">
              Log in
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-zo-muted">
          By signing up you agree to our{" "}
          <Link href="https://zoomoff.africa/legal/terms" className="underline">Terms</Link>
          {" & "}
          <Link href="https://zoomoff.africa/legal/privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

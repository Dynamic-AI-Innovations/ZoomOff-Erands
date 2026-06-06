import type { Metadata } from "next";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="https://zoomoff.africa" className="inline-block mb-6">
            <Image src="/logo.png" alt="ZoomOff" width={160} height={64} className="h-16 w-auto object-contain" unoptimized />
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

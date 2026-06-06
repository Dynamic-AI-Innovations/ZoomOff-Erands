import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-dark">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/logo.png" alt="ZoomOff Errand Services" width={160} height={64} className="h-16 w-auto object-contain mx-auto mb-5" priority />
          <h1 className="font-display text-2xl font-bold text-white">Admin Console</h1>
          <p className="mt-1 text-sm text-gray-400">ZoomOff internal operations — authorised access only</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <AdminLoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-gray-600">
          Unauthorised access is strictly prohibited and logged.
        </p>
      </div>
    </div>
  );
}

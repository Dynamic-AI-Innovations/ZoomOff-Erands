import type { Metadata } from "next";
import { Suspense } from "react";
import { MfaVerifyForm } from "./MfaVerifyForm";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Two-Factor Authentication" };

export default function VerifyMfaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-dark">
      <div className="w-full max-w-sm">
        <Suspense fallback={<Skeleton height={200} className="rounded-2xl" />}>
          <MfaVerifyForm />
        </Suspense>
      </div>
    </div>
  );
}

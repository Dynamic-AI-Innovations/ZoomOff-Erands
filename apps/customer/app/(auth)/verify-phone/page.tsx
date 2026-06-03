import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyPhoneForm } from "./VerifyPhoneForm";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Verify Phone" };

export default function VerifyPhonePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zo-bg-light">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="rounded-2xl border border-zo-border bg-white p-8 shadow-card"><Skeleton height={200} /></div>}>
          <VerifyPhoneForm />
        </Suspense>
      </div>
    </div>
  );
}

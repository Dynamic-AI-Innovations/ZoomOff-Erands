"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { saveRef, REF_REGEX } from "@/lib/referral";

function Inner() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref  = searchParams.get("ref");
    const type = (searchParams.get("type") as "customer" | "runner" | "business") ?? "customer";
    if (ref && REF_REGEX.test(ref)) saveRef(ref, type);
  }, [searchParams]);
  return null;
}

export function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

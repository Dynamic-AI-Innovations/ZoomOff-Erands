import type { Metadata } from "next";
import { Suspense } from "react";
import { JoinContent } from "./JoinContent";

export const metadata: Metadata = {
  title: "You're Invited | ZoomOff Errands",
  description: "You've been invited to join ZoomOff Errands — Nigeria's fastest errand service. Sign up and get rewarded.",
};

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zo-bg-dark flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your invitation…</p>
      </div>
    }>
      <JoinContent />
    </Suspense>
  );
}

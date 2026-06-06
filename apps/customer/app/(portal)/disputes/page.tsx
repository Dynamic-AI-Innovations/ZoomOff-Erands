import type { Metadata } from "next";
import { Suspense } from "react";
import { DisputesList } from "@/components/tasks/DisputesList";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Disputes" };

export default function DisputesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Disputes</h1>
        <p className="text-sm text-zo-muted mt-1">File or track disputes on your errands (within 48 hours of completion)</p>
      </div>
      <Suspense fallback={<Skeleton height={200} />}>
        <DisputesList />
      </Suspense>
    </div>
  );
}

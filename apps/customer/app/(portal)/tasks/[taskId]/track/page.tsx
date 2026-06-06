import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveTrackingView } from "@/components/tracking/LiveTrackingView";
import { Skeleton } from "@zoomoff/ui";

export const metadata: Metadata = { title: "Track Errand" };

export default function TrackPage({ params }: { params: { taskId: string } }) {
  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton height={300} /><Skeleton height={120} /></div>}>
      <LiveTrackingView taskId={params.taskId} />
    </Suspense>
  );
}

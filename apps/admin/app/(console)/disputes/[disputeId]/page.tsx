import type { Metadata } from "next";
import { DisputeReviewScreen } from "@/components/ops/DisputeReviewScreen";

export const metadata: Metadata = { title: "Dispute Review" };

export default function DisputeReviewPage({ params }: { params: { disputeId: string } }) {
  return <DisputeReviewScreen disputeId={params.disputeId} />;
}

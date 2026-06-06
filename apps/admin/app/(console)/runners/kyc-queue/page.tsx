import type { Metadata } from "next";
import { KycReviewQueue } from "@/components/ops/KycReviewQueue";

export const metadata: Metadata = { title: "KYC Review Queue" };

export default function KycQueuePage() {
  return <KycReviewQueue />;
}

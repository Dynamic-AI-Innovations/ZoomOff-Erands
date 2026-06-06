import type { Metadata } from "next";
import { DisputesQueue } from "@/components/ops/DisputesQueue";

export const metadata: Metadata = { title: "Dispute Queue" };

export default function DisputesPage() {
  return <DisputesQueue />;
}

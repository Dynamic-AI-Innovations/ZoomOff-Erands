import type { Metadata } from "next";
import { EarningsDashboard } from "@/components/EarningsDashboard";

export const metadata: Metadata = { title: "Earnings" };

export default function EarningsPage() {
  return <EarningsDashboard />;
}

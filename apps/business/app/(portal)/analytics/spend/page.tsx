import type { Metadata } from "next";
import { SpendAnalytics } from "@/components/analytics/SpendAnalytics";

export const metadata: Metadata = { title: "Spend Analytics" };

export default function SpendPage() {
  return <SpendAnalytics />;
}

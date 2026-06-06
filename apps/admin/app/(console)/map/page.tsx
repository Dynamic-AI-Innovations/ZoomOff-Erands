import type { Metadata } from "next";
import { LiveOpsMap } from "@/components/ops/LiveOpsMap";

export const metadata: Metadata = { title: "Live Operations Map" };

export default function MapPage() {
  return <LiveOpsMap />;
}

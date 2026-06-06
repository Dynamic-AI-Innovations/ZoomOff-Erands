import type { Metadata } from "next";
import { AlertsCenter } from "@/components/ops/AlertsCenter";

export const metadata: Metadata = { title: "Alert Centre" };

export default function AlertsPage() {
  return <AlertsCenter />;
}

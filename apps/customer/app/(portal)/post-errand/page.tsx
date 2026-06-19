import type { Metadata } from "next";
import { ErrandWizard } from "@/components/errand/ErrandWizard";

export const metadata: Metadata = { title: "Request an Errand" };

export default function PostErrandPage() {
  return <ErrandWizard />;
}

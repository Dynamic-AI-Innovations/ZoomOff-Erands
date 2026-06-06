import type { Metadata } from "next";
import { ErrandWizard } from "@/components/errand/ErrandWizard";

export const metadata: Metadata = { title: "Post an Errand" };

export default function PostErrandPage() {
  return <ErrandWizard />;
}

import type { Metadata } from "next";
import { DelegateFlow } from "./DelegateFlow";

export const metadata: Metadata = {
  title: "Delegate an Errand | ZoomOff",
  description: "Describe what you need done, and a verified ZoomOff runner will handle it for you.",
};

export default function DelegatePage() {
  return <DelegateFlow />;
}

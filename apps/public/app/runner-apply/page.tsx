import type { Metadata } from "next";
import { RunnerApplyForm } from "./RunnerApplyForm";

export const metadata: Metadata = { title: "Runner Application | ZoomOff Errands" };

export default function RunnerApplyPage() {
  return <RunnerApplyForm />;
}

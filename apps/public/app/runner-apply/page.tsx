import type { Metadata } from "next";
import { RunnerApplyForm } from "./RunnerApplyForm";

export const metadata: Metadata = { title: "Runner Application | ZoomOff" };

export default function RunnerApplyPage() {
  return <RunnerApplyForm />;
}

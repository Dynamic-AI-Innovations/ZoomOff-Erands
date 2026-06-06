import type { Metadata } from "next";
import { KycWizard } from "@/components/kyc/KycWizard";

export const metadata: Metadata = { title: "Runner Registration" };

export default function RegisterStepPage({ params }: { params: { step: string } }) {
  const step = parseInt(params.step) || 1;
  return <KycWizard initialStep={step} />;
}

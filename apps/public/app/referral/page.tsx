import type { Metadata } from "next";
import { ReferralPageContent } from "./ReferralPageContent";

export const metadata: Metadata = {
  title: "Referral Programme | ZoomOff Errands",
  description: "Earn ₦500 per customer, ₦2,000 per runner, and ₦5,000 per business you refer to ZoomOff Errands. No limit on earnings.",
};

export default function ReferralPage() {
  return <ReferralPageContent />;
}

import type { Metadata } from "next";
import { ReferralPageContent } from "./ReferralPageContent";

export const metadata: Metadata = {
  title: "Referral Programme | ZoomOff",
  description: "Earn ₦500 per customer, ₦2,000 per runner, and ₦5,000 per business you refer to ZoomOff. No limit on earnings.",
};

export default function ReferralPage() {
  return <ReferralPageContent />;
}

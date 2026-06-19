import type { Metadata } from "next";
import { InviteDashboard } from "./InviteDashboard";

export const metadata: Metadata = {
  title: "Invite & Earn | ZoomOff Errands",
  description: "Share your unique referral link and earn cash credits for every successful referral.",
};

export default function InvitePage() {
  return <InviteDashboard />;
}

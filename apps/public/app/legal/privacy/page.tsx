import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding max-w-3xl mx-auto prose prose-sm">
        <h1 className="font-display text-3xl font-bold text-brand-charcoal mb-2">Privacy Policy</h1>
        <p className="text-zo-muted text-sm mb-8">Last updated: January 2026 | Effective date: January 2026</p>

        <p className="text-zo-muted mb-8">
          ZoomOff Technologies Ltd (&ldquo;ZoomOff&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal data
          in accordance with the Nigeria Data Protection Regulation (NDPR) 2019 and its 2023 Amendment.
          This policy explains how we collect, use, store and share your information.
        </p>

        {[
          {
            title: "1. Data We Collect",
            content: "We collect: identity data (name, phone, email, NIN, BVN for runners), location data (GPS during active tasks), task data (errand descriptions, photos, receipts), payment data (tokenised via PSP — we never store raw card details), device & usage data (browser, IP, app events), and communications (in-app chat, support emails).",
          },
          {
            title: "2. How We Use Your Data",
            content: "To provide and improve the ZoomOff service, match customers with runners, process payments via escrow, verify runner identity (KYC), send transactional notifications (OTP, receipts, status updates), resolve disputes, comply with legal obligations (tax, anti-fraud), and with your consent — send promotional communications.",
          },
          {
            title: "3. Data Sharing",
            content: "We share data with: runners assigned to your tasks (limited to name, photo, phone); KYC partners (Smile Identity / Youverify) for identity verification; payment processors (Paystack, Flutterwave) under PCI DSS; cloud infrastructure (AWS); and where required by Nigerian law or regulators. We do not sell personal data.",
          },
          {
            title: "4. Data Retention",
            content: "Active user data: lifetime of account. Task and payment records: 7 years (FIRS compliance). KYC documents: 5 years post account closure. Chat messages: 90 days post task. GPS tracking data: 30 days post task. Deleted accounts: anonymised within 30 days of your request.",
          },
          {
            title: "5. Your Rights (NDPR)",
            content: "You have the right to: access your data, rectify inaccurate data, request deletion (right to be forgotten), object to processing, data portability, and withdraw consent at any time. Contact privacy@zoomoff.africa to exercise any right.",
          },
          {
            title: "6. Cookies",
            content: "We use essential cookies (session management, security) and optional analytics/marketing cookies. You can manage preferences via our cookie banner on the website. Essential cookies cannot be disabled.",
          },
          {
            title: "7. Contact",
            content: "Data Protection Officer: privacy@zoomoff.africa | ZoomOff Technologies Ltd, Lagos, Nigeria. For complaints you may also contact the Nigeria Data Protection Commission (NDPC).",
          },
        ].map(({ title, content }) => (
          <div key={title} className="mb-6">
            <h2 className="font-display text-lg font-bold text-brand-charcoal mb-2">{title}</h2>
            <p className="text-zo-muted text-sm leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

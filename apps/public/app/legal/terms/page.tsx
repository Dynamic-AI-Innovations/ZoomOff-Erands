import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-brand-charcoal mb-2">Terms of Service</h1>
        <p className="text-zo-muted text-sm mb-8">Last updated: January 2026</p>

        <p className="text-zo-muted text-sm mb-8 leading-relaxed">
          By accessing or using ZoomOff (&ldquo;the Platform&rdquo;) you agree to these Terms of Service.
          If you do not agree, do not use the Platform.
        </p>

        {[
          { title: "1. The ZoomOff Platform", content: "ZoomOff is a technology platform that connects customers who need errands performed with independent runners who choose to perform those errands. ZoomOff is not a party to errand transactions and does not employ runners. Runners are independent service providers." },
          { title: "2. Eligibility", content: "You must be 18 or older to use ZoomOff. By registering, you confirm that all information provided is accurate and that you have the legal capacity to enter into a binding agreement." },
          { title: "3. Payments & Escrow", content: "Task payments are held in escrow by ZoomOff until completion is confirmed. ZoomOff deducts a service commission from each transaction before releasing payment to the runner. All prices shown include VAT where applicable." },
          { title: "4. Cancellation Policy", content: "Customers may cancel before runner acceptance at no charge. A ₦500 cancellation fee applies after runner acceptance. Cancellation is not permitted once a runner is en route." },
          { title: "5. Prohibited Use", content: "You may not use ZoomOff for illegal activities, transporting prohibited items, financial crimes, harassment of runners or other users, scraping platform data, or any purpose that violates Nigerian law." },
          { title: "6. Dispute Resolution", content: "Disputes must be filed within 48 hours of task completion. ZoomOff's decision on disputes is final for amounts under ₦100,000. Higher-value disputes may be referred to arbitration under Nigerian Arbitration and Conciliation Act." },
          { title: "7. Liability Limitation", content: "ZoomOff's total liability for any claim is limited to the value of the specific transaction in dispute. ZoomOff is not liable for indirect, consequential, or punitive damages." },
          { title: "8. Governing Law", content: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State, Nigeria." },
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

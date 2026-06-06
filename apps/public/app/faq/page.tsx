import type { Metadata } from "next";
import { FAQContent } from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Get answers to common questions about ZoomOff errands, payments, runner verification and safety.",
};

export default function FAQPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-brand-charcoal">Frequently Asked Questions</h1>
          <p className="mt-3 text-zo-muted max-w-xl mx-auto">Can&apos;t find your answer? <a href="#" className="text-brand-gold hover:underline">Chat with us</a></p>
        </div>
        <FAQContent />
      </div>
    </div>
  );
}

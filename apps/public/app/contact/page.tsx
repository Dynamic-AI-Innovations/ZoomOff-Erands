import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | ZoomOff",
  description: "Get in touch with the ZoomOff team. We're here to help with any questions about errands, runner applications, or business accounts.",
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp Support",
    value: "+234 800 ZOOMOFF",
    desc: "Fastest response — usually under 5 minutes",
    href: "https://wa.me/2348000000000",
    cta: "Chat on WhatsApp",
    accent: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@zoomoff.africa",
    desc: "For detailed queries — response within 2 hours",
    href: "mailto:support@zoomoff.africa",
    cta: "Send an Email",
    accent: false,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 800 ZOOMOFF",
    desc: "Mon – Sat, 8 am – 8 pm WAT",
    href: "tel:+2348000000000",
    cta: "Call Us",
    accent: false,
  },
];


export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-3">We&apos;re here</p>
          <h1 className="font-display text-4xl font-extrabold text-brand-charcoal md:text-5xl tracking-tight">
            Contact ZoomOff
          </h1>
          <p className="mt-4 text-zo-muted max-w-md mx-auto">
            Questions about an errand, a payment, or your account? Reach us through any of the channels below.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: channels */}
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-charcoal">Reach us directly</h2>

            {CHANNELS.map(({ icon: Icon, label, value, desc, href, cta, accent }) => (
              <a
                key={label}
                href={href}
                className={`group flex items-start gap-4 rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  accent ? "border-brand-gold bg-brand-gold/5" : "border-zo-border bg-white hover:border-brand-gold/50"
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  accent ? "bg-brand-gold/20 text-brand-gold" : "bg-zo-bg-light text-zo-muted group-hover:bg-brand-gold/10 group-hover:text-brand-gold"
                } transition-colors`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zo-muted uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="font-bold text-brand-charcoal">{value}</p>
                  <p className="text-xs text-zo-muted mt-0.5">{desc}</p>
                  <span className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold ${accent ? "text-brand-gold" : "text-brand-charcoal group-hover:text-brand-gold"} transition-colors`}>
                    {cta}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}

            {/* Hours */}
            <div className="flex items-center gap-3 rounded-xl border border-zo-border bg-zo-bg-light px-5 py-4">
              <Clock className="h-5 w-5 text-brand-gold shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-brand-charcoal">Support hours</p>
                <p className="text-xs text-zo-muted mt-0.5">Mon – Sat: 8 am – 8 pm WAT &nbsp;·&nbsp; Sun: 10 am – 4 pm WAT</p>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start gap-3 px-1 pt-2">
              <MapPin className="h-5 w-5 text-zo-muted shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-brand-charcoal">Headquarters</p>
                <p className="text-xs text-zo-muted mt-0.5 leading-relaxed">
                  Dynamics Technology Ltd.<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-5">Send us a message</h2>
            <div className="rounded-2xl border border-zo-border bg-white shadow-card p-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

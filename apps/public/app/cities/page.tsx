import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, CheckCircle2, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Cities We Serve",
  description: "ZoomOff Errands is live in Lagos, Abuja, Port Harcourt and expanding across Nigeria. Find out if we serve your city.",
};

const CITIES = [
  {
    name: "Lagos",
    state: "Lagos State",
    status: "live",
    areas: ["Victoria Island", "Lekki", "Ikeja", "Surulere", "Yaba", "Ajah", "Ikoyi", "Gbagada", "Maryland", "Oshodi"],
    runners: "500+",
    tagline: "Our largest and busiest city — errands completed in 30–60 minutes on average.",
  },
  {
    name: "Abuja",
    state: "FCT",
    status: "live",
    areas: ["Maitama", "Wuse", "Garki", "Gwarinpa", "Asokoro", "Jabi", "Utako", "Central Area", "Kubwa"],
    runners: "200+",
    tagline: "Fast coverage across the main districts and satellite towns.",
  },
  {
    name: "Port Harcourt",
    state: "Rivers State",
    status: "live",
    areas: ["GRA", "Diobu", "Rumuola", "Trans-Amadi", "Rumuokoro", "Elekahia", "D-Line", "Mile 1", "Mile 3"],
    runners: "150+",
    tagline: "Growing fast in the Garden City — available in all major areas.",
  },
  {
    name: "Ibadan",
    state: "Oyo State",
    status: "coming_soon",
    areas: ["Bodija", "UI", "Ring Road", "Agodi", "Dugbe", "Challenge", "Mokola"],
    runners: null,
    tagline: "Launching soon — register your interest and be notified first.",
  },
  {
    name: "Enugu",
    state: "Enugu State",
    status: "coming_soon",
    areas: ["Independence Layout", "GRA", "Trans-Ekulu", "Achara Layout", "Maryland"],
    runners: null,
    tagline: "Coming soon — add your interest and get early access.",
  },
  {
    name: "Kano",
    state: "Kano State",
    status: "coming_soon",
    areas: ["Nasarawa GRA", "Bompai", "Sabon Gari", "Fagge", "Kofar Wambai"],
    runners: null,
    tagline: "Expanding north — let us know you want ZoomOff in your city.",
  },
];

export default function CitiesPage() {
  const liveCities    = CITIES.filter(c => c.status === "live");
  const comingSoon    = CITIES.filter(c => c.status === "coming_soon");

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-charcoal py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-6">
            <MapPin className="h-4 w-4 text-brand-gold" />
            <span className="text-xs font-semibold text-white">Service Coverage</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cities We Serve
          </h1>
          <p className="text-gray-400 text-base mt-3">
            ZoomOff Errands is live in 3 cities and expanding across Nigeria.
          </p>
        </div>
      </section>

      {/* Live cities */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="font-display text-2xl font-extrabold text-brand-charcoal mb-6 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse inline-block" />
          Live Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {liveCities.map(city => (
            <div key={city.name} className="rounded-2xl border border-zo-border bg-white p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-extrabold text-brand-charcoal">{city.name}</h3>
                  <p className="text-xs text-zo-muted">{city.state}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Live</span>
                </div>
              </div>

              <p className="text-xs text-zo-muted leading-relaxed">{city.tagline}</p>

              <div>
                <p className="text-xs font-semibold text-brand-charcoal mb-2">Key areas covered:</p>
                <div className="flex flex-wrap gap-1.5">
                  {city.areas.slice(0, 6).map(area => (
                    <span key={area} className="rounded-full bg-zo-bg-light border border-zo-border px-2.5 py-1 text-xs text-brand-charcoal">
                      {area}
                    </span>
                  ))}
                  {city.areas.length > 6 && (
                    <span className="rounded-full bg-zo-bg-light border border-zo-border px-2.5 py-1 text-xs text-zo-muted">
                      +{city.areas.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {city.runners && (
                <p className="text-xs text-zo-muted">
                  <span className="font-bold text-brand-charcoal">{city.runners}</span> verified runners
                </p>
              )}

              <Link href="/delegate"
                className="flex items-center justify-between rounded-xl bg-brand-gold/10 border border-brand-gold/30 px-4 py-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/20 transition-colors">
                Request in {city.name}
                <ArrowRight className="h-4 w-4 text-brand-gold" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="bg-zo-bg-light border-t border-zo-border py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-extrabold text-brand-charcoal mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-gold" />
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {comingSoon.map(city => (
              <div key={city.name} className="rounded-2xl border border-zo-border bg-white p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-brand-charcoal">{city.name}</h3>
                    <p className="text-xs text-zo-muted">{city.state}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Soon
                  </span>
                </div>
                <p className="text-xs text-zo-muted leading-relaxed">{city.tagline}</p>
                <Link href="/register"
                  className="flex items-center justify-between rounded-xl border border-zo-border px-4 py-3 text-xs font-semibold text-brand-charcoal hover:border-brand-gold/50 hover:bg-zo-bg-light transition-colors">
                  Get notified first
                  <ArrowRight className="h-3.5 w-3.5 text-zo-muted" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expand CTA */}
      <section className="py-14 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-extrabold text-brand-charcoal mb-2">
            Don&apos;t see your city?
          </h2>
          <p className="text-sm text-zo-muted mb-6">
            We&apos;re expanding fast. Contact us to request your city or apply to be our city partner.
          </p>
          <a href="mailto:cities@zoomoff.africa"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-charcoal px-6 py-3 text-sm font-bold text-white hover:bg-brand-charcoal/90 transition-colors">
            Request a City <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

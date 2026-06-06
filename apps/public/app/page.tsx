import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, FileText, Pill, CreditCard, Building2,
  Users, Package, ClipboardList, Home, PenLine,
  ArrowRight, Star, MapPin, CheckCircle, Shield, Zap,
  ChevronRight, Play,
} from "lucide-react";
import { Button } from "@zoomoff/ui";

export const metadata: Metadata = {
  title: "ZoomOff — Fast, Trusted Errands Across Nigeria",
  description:
    "ZoomOff connects you with verified, GPS-tracked runners ready to handle your errands — grocery runs, deliveries, banking, and more. Now live in Lagos, Abuja & Port Harcourt.",
};

const IMGS = {
  hero: "https://images.unsplash.com/photo-1678907284194-980b0fdf7983?w=1600&h=900&fit=crop&auto=format&q=80",
  rider: "https://images.unsplash.com/photo-1767895655081-6748c12f8aeb?w=800&h=600&fit=crop&auto=format&q=80",
  phone: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?w=800&h=600&fit=crop&auto=format&q=80",
  gps: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&h=600&fit=crop&auto=format&q=80",
  lagos: "https://images.unsplash.com/photo-1744907895363-d351aa6019ef?w=1400&h=500&fit=crop&auto=format&q=80",
  kyc: "https://images.unsplash.com/photo-1654163601023-88f6ba22b2c7?w=600&h=400&fit=crop&auto=format&q=80",
  customerF: "https://images.unsplash.com/photo-1508002366005-75a695ee2d17?w=200&h=200&fit=crop&auto=format&q=80",
  customerM: "https://images.unsplash.com/photo-1693070503207-6ad6bf8b9a00?w=200&h=200&fit=crop&auto=format&q=80",
};

const TASK_CATEGORIES = [
  { icon: ShoppingCart, label: "Grocery Shopping", desc: "Fresh market runs, supermarket pickups" },
  { icon: FileText, label: "Document Pickup", desc: "Courier & document delivery" },
  { icon: Pill, label: "Pharmacy Run", desc: "Medication & healthcare items" },
  { icon: CreditCard, label: "Bill Payment", desc: "DSTV, utilities, bank payments" },
  { icon: Building2, label: "Banking Errand", desc: "Deposits, withdrawals, queuing" },
  { icon: Users, label: "Queue Standing", desc: "Hold your place anywhere" },
  { icon: Package, label: "Parcel Delivery", desc: "Same-day city deliveries" },
  { icon: ClipboardList, label: "Administrative", desc: "Permits, government offices" },
  { icon: Home, label: "Home Errand", desc: "Household tasks" },
  { icon: PenLine, label: "Something Else?", desc: "We handle custom errands too" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Post your errand",
    desc: "Describe what you need, add pickup and drop-off locations, attach photos, and choose instant or scheduled.",
  },
  {
    step: "02",
    title: "Get matched instantly",
    desc: "Our system matches you with a verified, nearby runner in under 5 minutes.",
  },
  {
    step: "03",
    title: "Track in real time",
    desc: "Watch your runner on a live map with continuous location updates and in-app chat.",
  },
  {
    step: "04",
    title: "Confirm & pay",
    desc: "Approve completion and release your escrow payment. Leave a review and rating.",
  },
];

const TESTIMONIALS = [
  {
    name: "Adaeze Okonkwo",
    role: "Businesswoman, Lagos Island",
    img: IMGS.customerF,
    rating: 5,
    quote:
      "ZoomOff saved my business. I used to waste 3 hours queuing at the bank every week. Now my runner handles it in an hour while I focus on work. Absolutely brilliant.",
  },
  {
    name: "Emeka Nwosu",
    role: "Graduate Student, Abuja",
    img: IMGS.customerM,
    rating: 5,
    quote:
      "I sent my runner to pick up my transcripts from the university and deliver them across town — done in 2 hours. The live tracking gave me total peace of mind.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={IMGS.hero}
            alt="Busy Lagos street"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
          {/* Gold glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/10 via-transparent to-transparent" />
        </div>

        <div className="relative container-max section-padding w-full pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-1.5 text-sm text-brand-gold mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              Now live in Lagos · Abuja · Port Harcourt
            </div>

            <h1 className="font-display text-5xl font-bold text-white leading-tight md:text-6xl lg:text-7xl text-balance">
              Your errands,{" "}
              <span className="text-brand-gold">handled fast.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 max-w-xl text-balance leading-relaxed">
              ZoomOff connects you with verified, GPS-tracked runners ready to handle
              grocery runs, deliveries, banking, and more — instantly or on a schedule.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="xl" variant="primary" asChild>
                <Link href="/register">
                  Post an Errand Free
                  <ArrowRight className="h-5 w-5 ml-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link href="/become-a-runner">Earn as a Runner</Link>
              </Button>
            </div>

            {/* Inline trust */}
            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { icon: Shield, text: "KYC-verified runners" },
                { icon: MapPin, text: "Live GPS tracking" },
                { icon: CheckCircle, text: "Escrow payment protection" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                  <Icon className="h-4 w-4 text-brand-gold shrink-0" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <div className="h-6 w-0.5 bg-brand-gold/50 rounded-full" />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-brand-gold py-6">
        <div className="container-max section-padding">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            {[
              { value: "50,000+", label: "Errands Completed" },
              { value: "4.8 ★", label: "Average Rating" },
              { value: "< 5 min", label: "Average Match Time" },
              { value: "3 Cities", label: "And Growing" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-brand-charcoal md:text-3xl">{s.value}</p>
                <p className="text-sm text-brand-charcoal/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-24">
        <div className="container-max section-padding">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">What we handle</p>
            <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
              From market runs to government offices
            </h2>
            <p className="mt-3 text-zo-muted max-w-lg mx-auto">
              Your verified runner can handle almost anything across Lagos, Abuja, and Port Harcourt.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TASK_CATEGORIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-zo-border bg-white p-5 text-center shadow-card transition-all hover:border-brand-gold hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-charcoal">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal">{label}</p>
                  <p className="mt-0.5 text-xs text-zo-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-zo-bg-light py-24">
        <div className="container-max section-padding">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: steps */}
            <div>
              <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">How it works</p>
              <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl text-balance">
                Four steps between you and a completed errand
              </h2>
              <div className="mt-10 space-y-6">
                {HOW_IT_WORKS.map((item, i) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold font-display text-sm font-bold text-brand-charcoal">
                        {item.step}
                      </div>
                      {i < HOW_IT_WORKS.length - 1 && (
                        <div className="mt-2 flex-1 w-0.5 bg-brand-gold/20 min-h-[2rem]" />
                      )}
                    </div>
                    <div className="pb-2">
                      <h3 className="font-semibold text-brand-charcoal">{item.title}</h3>
                      <p className="mt-1 text-sm text-zo-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/register">
                    Post your first errand
                    <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: GPS phone image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src={IMGS.gps}
                  alt="Live GPS tracking on a phone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur p-4 shadow-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold">
                    <MapPin className="h-5 w-5 text-brand-charcoal" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-charcoal">Your runner is 8 mins away</p>
                    <p className="text-xs text-zo-muted mt-0.5 truncate">Heading to Lekki Phase 1 Gate B</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-gold/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── APP EXPERIENCE ─── */}
      <section className="py-24">
        <div className="container-max section-padding">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: phone image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-w-sm mx-auto">
                <Image
                  src={IMGS.phone}
                  alt="Nigerian man using the ZoomOff app"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating rating card */}
              <div className="absolute -right-4 top-10 rounded-2xl bg-white p-4 shadow-card-hover flex items-center gap-3 border border-zo-border">
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-brand-charcoal mt-1">4.9 / 5.0</p>
                  <p className="text-2xs text-zo-muted">2,400+ reviews</p>
                </div>
              </div>
              {/* Floating speed card */}
              <div className="absolute -left-4 bottom-16 rounded-2xl bg-brand-charcoal p-4 shadow-card-hover">
                <Zap className="h-5 w-5 text-brand-gold mb-1" aria-hidden="true" />
                <p className="text-xs font-semibold text-white">Matched in</p>
                <p className="font-display text-xl font-bold text-brand-gold">4.2 min</p>
              </div>
            </div>

            {/* Right: copy */}
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">The ZoomOff app</p>
              <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl text-balance">
                Everything you need in one tap
              </h2>
              <p className="mt-4 text-zo-muted leading-relaxed">
                Post errands, track your runner on a live map, chat in real time, pay securely, and rate your experience — all from a single app built for Nigeria.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  { icon: MapPin, title: "Real-time GPS tracking", desc: "5-second location refresh with turn-by-turn ETA." },
                  { icon: Shield, title: "Escrow-protected payments", desc: "Money only releases when you confirm the job is done." },
                  { icon: Zap, title: "Instant or scheduled", desc: "Post now or book up to 7 days in advance." },
                ].map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-charcoal text-sm">{title}</p>
                      <p className="text-xs text-zo-muted mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex gap-3 flex-wrap">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-it-works" className="flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    See how it works
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST ─── */}
      <section className="bg-brand-charcoal py-24">
        <div className="container-max section-padding">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">Built on trust</p>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Every runner is verified. Every payment is protected.
            </h2>
            <p className="mt-3 text-gray-400 max-w-lg mx-auto">
              We take safety seriously so you can relax while your errand gets handled.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* KYC card with image */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="relative h-44">
                <Image
                  src={IMGS.kyc}
                  alt="Identity verification"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/30 to-transparent" />
              </div>
              <div className="p-5 bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold mb-3">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white">KYC-Verified Runners</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  NIN, BVN, biometric selfie, and ID document checks before every runner&apos;s first task.
                </p>
              </div>
            </div>

            {/* GPS card with image */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="relative h-44">
                <Image
                  src={IMGS.gps}
                  alt="GPS tracking on phone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/30 to-transparent" />
              </div>
              <div className="p-5 bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold mb-3">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white">Live GPS Tracking</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Real-time location updates every 5 seconds. Chat with your runner directly in the app.
                </p>
              </div>
            </div>

            {/* Escrow card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col">
              <div className="flex-1 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold mb-3">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white">Escrow Payment Protection</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Your payment is held securely. It only releases to the runner after you approve the completed job.
                </p>
                <ul className="mt-4 space-y-2">
                  {["PCI DSS compliant payments", "Paystack-powered escrow", "Instant refund on disputes"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Protected by</p>
                  <span className="font-display text-sm font-bold text-brand-gold">ZoomOff Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CITIES ─── */}
      <section className="py-24">
        <div className="container-max section-padding">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">Where we operate</p>
            <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
              Serving Nigeria&apos;s major cities
            </h2>
          </div>

          {/* Lagos banner */}
          <div className="relative rounded-3xl overflow-hidden h-56 md:h-72 mb-6">
            <Image
              src={IMGS.lagos}
              alt="Aerial view of Lagos, Nigeria"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
            <div className="absolute inset-0 flex items-center px-8 md:px-14">
              <div>
                <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-1">Live Now</p>
                <h3 className="font-display text-3xl font-bold text-white md:text-4xl">Lagos</h3>
                <p className="text-gray-300 mt-1 text-sm">Island · Mainland · Lekki · VI · Ikeja</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-1.5 text-xs font-semibold text-brand-charcoal">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-charcoal animate-pulse" />
                  2,000+ active runners
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { city: "Abuja", zones: "Wuse · Maitama · Garki · Gwarinpa", runners: "800+ runners" },
              { city: "Port Harcourt", zones: "GRA · Rumuola · Diobu · Trans Amadi", runners: "400+ runners" },
            ].map(({ city, zones, runners }) => (
              <div
                key={city}
                className="relative rounded-2xl overflow-hidden border border-zo-border bg-zo-bg-light p-6 flex items-center justify-between group hover:border-brand-gold transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                    <span className="text-xs text-brand-gold font-semibold uppercase tracking-wide">Live Now</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-charcoal">{city}</h3>
                  <p className="text-xs text-zo-muted mt-0.5">{zones}</p>
                  <p className="text-xs font-medium text-brand-charcoal mt-2">{runners}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-zo-muted group-hover:text-brand-gold transition-colors" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-zo-bg-light py-24">
        <div className="container-max section-padding">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">Loved by customers</p>
            <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl">
              Thousands of Nigerians trust ZoomOff every week
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map(({ name, role, img, rating, quote }) => (
              <div key={name} className="bg-white rounded-2xl p-7 shadow-card border border-zo-border">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden="true" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-brand-charcoal leading-relaxed text-sm md:text-base">
                  &ldquo;{quote}&rdquo;
                </p>
                {/* Person */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-brand-gold/20 shrink-0">
                    <Image
                      src={img}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-charcoal text-sm">{name}</p>
                    <p className="text-xs text-zo-muted">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Star average */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-zo-border bg-white px-6 py-3 shadow-card">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden="true" />
                ))}
              </div>
              <span className="font-display text-lg font-bold text-brand-charcoal">4.8</span>
              <span className="text-sm text-zo-muted">from 12,000+ ratings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR RUNNERS ─── */}
      <section className="py-24">
        <div className="container-max section-padding">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
              <Image
                src={IMGS.rider}
                alt="ZoomOff runner on a motorcycle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Earnings badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 backdrop-blur p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zo-muted">Top runners earn up to</p>
                    <p className="font-display text-2xl font-bold text-brand-charcoal">₦150,000/mo</p>
                  </div>
                  <div className="rounded-xl bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-charcoal">
                    Join now →
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">For runners</p>
              <h2 className="font-display text-3xl font-bold text-brand-charcoal md:text-4xl text-balance">
                Turn your free time into steady income
              </h2>
              <p className="mt-4 text-zo-muted leading-relaxed">
                Join thousands of Nigerians earning on their own schedule. Accept tasks, complete errands, get paid same-day to your bank account.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { value: "₦3,500+", label: "Avg earnings per task" },
                  { value: "Same day", label: "Payout to your bank" },
                  { value: "0%", label: "Platform fee to start" },
                  { value: "24/7", label: "Support for runners" },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-xl bg-zo-bg-light border border-zo-border p-4">
                    <p className="font-display text-xl font-bold text-brand-gold">{value}</p>
                    <p className="text-xs text-zo-muted mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/become-a-runner">
                    Apply as a Runner
                    <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative bg-brand-charcoal py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, #F7C438 0%, transparent 60%)" }} />
        <div className="relative container-max section-padding text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-5xl text-balance">
            Ready to reclaim your time?
          </h2>
          <p className="mt-4 text-gray-300 max-w-lg mx-auto text-lg">
            Post your first errand in under 60 seconds. Verified runners are standing by.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="/register">
                Post an Errand — It&apos;s Free
                <ArrowRight className="h-5 w-5 ml-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/become-a-runner">Earn as a Runner</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">No subscription. No monthly fee. Pay only per errand.</p>
        </div>
      </section>
    </>
  );
}

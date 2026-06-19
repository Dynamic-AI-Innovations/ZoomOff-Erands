import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, FileText, Pill, CreditCard, Building2,
  Users, Package, ClipboardList, Home, PenLine,
  ArrowRight, Star, MapPin, CheckCircle, Shield, Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { AppExperienceTabs } from "@/components/sections/AppExperienceTabs";

export const metadata: Metadata = {
  title: "ZoomOff Errands — Fast, Trusted Errands Across Nigeria",
  description:
    "ZoomOff Errands connects you with verified, GPS-tracked runners ready to handle your errands — grocery runs, deliveries, banking, and more.",
};

const IMGS = {
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
  { icon: Home, label: "Home Errand", desc: "Household tasks & chores" },
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
      "ZoomOff Errands saved my business. I used to waste 3 hours queuing at the bank every week. Now my runner handles it in an hour while I focus on work. Absolutely brilliant.",
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
      {/* ─── HERO SLIDER ─── */}
      <HeroSlider />

      {/* ─── STATS BAR ─── */}
      <section className="bg-brand-gold py-7">
        <div className="container-max section-padding">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center divide-x divide-brand-charcoal/10">
            {[
              { value: "50,000+", label: "Errands Completed" },
              { value: "4.8 ★", label: "Average Rating" },
              { value: "< 5 min", label: "Average Match Time" },
              { value: "98%", label: "Completion Rate" },
            ].map((s) => (
              <div key={s.label} className="px-2">
                <p className="font-display text-2xl font-extrabold text-brand-charcoal md:text-3xl tracking-tight">{s.value}</p>
                <p className="text-xs font-medium text-brand-charcoal/65 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-28">
        <div className="container-max section-padding">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">What we handle</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight">
              From market runs to government offices
            </h2>
            <p className="mt-4 text-zo-muted max-w-lg mx-auto leading-relaxed">
              Your verified runner can handle almost anything. Describe it, post it, and consider it done.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TASK_CATEGORIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-zo-border bg-white p-6 text-center shadow-card transition-all duration-200 hover:border-brand-gold hover:shadow-card-hover hover:-translate-y-1 cursor-default"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold transition-all duration-200 group-hover:bg-brand-gold group-hover:text-brand-charcoal group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal leading-snug">{label}</p>
                  <p className="mt-1 text-xs text-zo-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-zo-bg-light py-28">
        <div className="container-max section-padding">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Steps */}
            <div>
              <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">How it works</p>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight text-balance">
                Four steps to a completed errand
              </h2>
              <div className="mt-12 space-y-7">
                {HOW_IT_WORKS.map((item, i) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold font-display text-sm font-bold text-brand-charcoal shadow-sm">
                        {item.step}
                      </div>
                      {i < HOW_IT_WORKS.length - 1 && (
                        <div className="mt-2 flex-1 w-px bg-brand-gold/25 min-h-[2rem]" />
                      )}
                    </div>
                    <div className="pb-2 pt-1.5">
                      <h3 className="font-semibold text-brand-charcoal text-sm tracking-tight">{item.title}</h3>
                      <p className="mt-1.5 text-sm text-zo-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/delegate">
                    Delegate your first errand
                    <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* GPS image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src={IMGS.gps}
                  alt="Live GPS tracking on a phone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold">
                    <MapPin className="h-5 w-5 text-brand-charcoal" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-charcoal">Your runner is 8 mins away</p>
                    <p className="text-xs text-zo-muted mt-0.5 truncate">Heading to Lekki Phase 1, Gate B</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── APP EXPERIENCE (tabbed: customers + runners) ─── */}
      <AppExperienceTabs />

      {/* ─── TRUST ─── */}
      <section className="bg-brand-charcoal py-28">
        <div className="container-max section-padding">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">Built on trust</p>
            <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl tracking-tight">
              Every runner is verified. Every payment is protected.
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto leading-relaxed">
              We take safety seriously so you can relax while your errand gets handled.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* KYC card */}
            <div className="rounded-2xl overflow-hidden border border-white/10 transition-all duration-200 hover:border-brand-gold/40">
              <div className="relative h-48">
                <Image
                  src={IMGS.kyc}
                  alt="Identity verification"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
              </div>
              <div className="p-6 bg-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold mb-4">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white text-sm tracking-tight">KYC-Verified Runners</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  NIN, BVN, biometric selfie, and ID document checks before every runner&apos;s first task.
                </p>
              </div>
            </div>

            {/* GPS card */}
            <div className="rounded-2xl overflow-hidden border border-white/10 transition-all duration-200 hover:border-brand-gold/40">
              <div className="relative h-48">
                <Image
                  src={IMGS.gps}
                  alt="GPS tracking on phone"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
              </div>
              <div className="p-6 bg-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold mb-4">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white text-sm tracking-tight">Live GPS Tracking</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Real-time location updates every 5 seconds. Chat with your runner directly in the app.
                </p>
              </div>
            </div>

            {/* Escrow card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col transition-all duration-200 hover:border-brand-gold/40">
              <div className="flex-1 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold mb-4">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white text-sm tracking-tight">Escrow Payment Protection</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Your payment is held securely. It only releases to the runner after you approve the completed job.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {["PCI DSS compliant payments", "Paystack-powered escrow", "Instant refund on disputes"].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-gray-300">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Protected by</p>
                  <span className="font-display text-sm font-bold text-brand-gold">ZoomOff Errands Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CITIES ─── */}
      <section id="cities" className="py-28">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">Where we operate</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight">
              Serving Nigeria&apos;s major cities
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-60 md:h-80 mb-6 shadow-2xl">
            <Image
              src={IMGS.lagos}
              alt="Aerial view of Lagos, Nigeria"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/20" />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div>
                <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-2">Live Now</p>
                <h3 className="font-display text-4xl font-extrabold text-white md:text-5xl tracking-tight">Lagos</h3>
                <p className="text-gray-300 mt-2 text-sm">Island · Mainland · Lekki · Victoria Island · Ikeja</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2 text-xs font-bold text-brand-charcoal">
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
                className="relative rounded-2xl overflow-hidden border border-zo-border bg-zo-bg-light p-7 flex items-center justify-between group hover:border-brand-gold transition-all duration-200 hover:shadow-card"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                    <span className="text-xs text-brand-gold font-bold uppercase tracking-[0.15em]">Live Now</span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-brand-charcoal tracking-tight">{city}</h3>
                  <p className="text-xs text-zo-muted mt-1">{zones}</p>
                  <p className="text-xs font-semibold text-brand-charcoal mt-2">{runners}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-zo-muted group-hover:text-brand-gold transition-colors" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-zo-bg-light py-28">
        <div className="container-max section-padding">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">Loved by customers</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight">
              Thousands of Nigerians trust ZoomOff Errands every week
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map(({ name, role, img, rating, quote }) => (
              <div key={name} className="bg-white rounded-2xl p-8 shadow-card border border-zo-border relative overflow-hidden">
                {/* Decorative large quote mark */}
                <span className="absolute top-4 right-6 font-display text-8xl font-bold text-brand-gold/10 leading-none select-none" aria-hidden="true">
                  &ldquo;
                </span>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-brand-charcoal leading-relaxed relative z-10">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-brand-gold/30 shrink-0">
                    <Image
                      src={img}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-charcoal text-sm">{name}</p>
                    <p className="text-xs text-zo-muted mt-0.5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-zo-border bg-white px-7 py-3.5 shadow-card">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden="true" />
                ))}
              </div>
              <span className="font-display text-lg font-extrabold text-brand-charcoal tracking-tight">4.8</span>
              <span className="text-sm text-zo-muted">from 12,000+ ratings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR RUNNERS ─── */}
      <section className="py-28">
        <div className="container-max section-padding">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
              <Image
                src={IMGS.rider}
                alt="ZoomOff Errands runner on a motorcycle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 backdrop-blur p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zo-muted">Top runners earn up to</p>
                    <p className="font-display text-2xl font-extrabold text-brand-charcoal tracking-tight">₦150,000/mo</p>
                  </div>
                  <Link
                    href="/become-a-runner"
                    className="rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                  >
                    Join now →
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">For runners</p>
              <h2 className="font-display text-3xl font-extrabold text-brand-charcoal md:text-4xl tracking-tight text-balance">
                Turn your free time into steady income
              </h2>
              <p className="mt-5 text-zo-muted leading-relaxed">
                Join thousands of Nigerians earning on their own schedule. Accept tasks, complete errands, get paid same-day to your bank account.
              </p>

              <div className="mt-9 grid grid-cols-2 gap-4">
                {[
                  { value: "₦3,500+", label: "Avg earnings per task" },
                  { value: "Same day", label: "Payout to your bank" },
                  { value: "0%", label: "Platform fee to start" },
                  { value: "24/7", label: "Support for runners" },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-2xl bg-zo-bg-light border border-zo-border p-5">
                    <p className="font-display text-xl font-extrabold text-brand-gold tracking-tight">{value}</p>
                    <p className="text-xs text-zo-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/become-a-runner">
                    Apply as a Runner
                    <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative bg-brand-charcoal py-28 overflow-hidden">
        {/* Gold radial glow */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse 70% 60% at 60% 50%, #F7C438 0%, transparent 70%)" }}
        />
        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

        <div className="relative container-max section-padding text-center">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-5">Get started today</p>
          <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl tracking-tight text-balance">
            Ready to reclaim your time?
          </h2>
          <p className="mt-5 text-gray-300 max-w-md mx-auto text-lg leading-relaxed font-light">
            Post your first errand in under 60 seconds. Verified runners are standing by.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="xl" variant="primary" asChild>
              <Link href="/delegate">
                Post an Errand — It&apos;s Free
                <ArrowRight className="h-5 w-5 ml-1.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/25 text-white hover:bg-white/10" asChild>
              <Link href="/become-a-runner">Earn as a Runner</Link>
            </Button>
          </div>
          <p className="mt-7 text-sm text-gray-600">No subscription. No monthly fee. Pay only per errand.</p>
        </div>
      </section>
    </>
  );
}

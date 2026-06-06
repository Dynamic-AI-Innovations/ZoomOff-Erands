"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Shield, MapPin, CheckCircle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@zoomoff/ui";
import { cn } from "@zoomoff/ui";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1678907284194-980b0fdf7983?w=1600&h=900&fit=crop&auto=format&q=80",
    alt: "Busy Nigerian city street",
    headline: "Your errands,",
    accent: "handled fast.",
    sub: "Post any errand in 60 seconds. A verified runner accepts it in under 5 minutes — and you track everything live.",
  },
  {
    img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1600&h=900&fit=crop&auto=format&q=80",
    alt: "Delivery runner on a motorcycle in the city",
    headline: "Verified runners,",
    accent: "ready near you.",
    sub: "KYC-checked, GPS-tracked runners handle grocery runs, deliveries, banking queues, and more — on your schedule.",
  },
  {
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&h=900&fit=crop&auto=format&q=80",
    alt: "Busy professional saving time",
    headline: "Too busy for",
    accent: "queues & errands?",
    sub: "Delegate your entire to-do list. Bank runs, document pickups, grocery shopping — all handled while you focus on what matters.",
  },
  {
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop&auto=format&q=80",
    alt: "Secure mobile payment on phone",
    headline: "Pay only when",
    accent: "the job is done.",
    sub: "Escrow-protected payments powered by Paystack. Your money stays completely safe until you confirm the errand is complete.",
  },
];

const TRUST = [
  { icon: Shield, text: "KYC-verified runners" },
  { icon: MapPin, text: "Live GPS tracking" },
  { icon: CheckCircle, text: "Escrow payment protection" },
];

const INTERVAL = 6000;

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = React.useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  const next = React.useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = React.useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero banner"
    >
      {/* Background slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.img}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Layered dark overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Subtle gold warm tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/6 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="relative z-20 container-max section-padding w-full pt-28 pb-24">
        <div className="max-w-2xl">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={cn(
                "transition-all duration-700 ease-out",
                i === current
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-5 pointer-events-none absolute inset-0"
              )}
              aria-hidden={i !== current}
            >
              {i === current && (
                <>
                  <h1 className="font-display text-5xl font-extrabold text-white leading-[1.08] tracking-tight md:text-6xl lg:text-[4.5rem] text-balance">
                    {slide.headline}{" "}
                    <br className="hidden sm:block" />
                    <span className="text-brand-gold">{slide.accent}</span>
                  </h1>
                  <p className="mt-6 text-lg text-gray-200 max-w-lg leading-relaxed font-light">
                    {slide.sub}
                  </p>
                </>
              )}
            </div>
          ))}

          {/* CTAs — constant across all slides */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Button size="xl" variant="primary" asChild>
              <Link href="/delegate">
                Delegate an Errand Free
                <ArrowRight className="h-5 w-5 ml-1.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/35 text-white hover:bg-white/10 backdrop-blur-sm"
              asChild
            >
              <Link href="/become-a-runner">Earn as a Runner</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap gap-6">
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                <Icon className="h-4 w-4 text-brand-gold shrink-0" aria-hidden="true" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-brand-gold hover:text-brand-charcoal hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-brand-gold hover:text-brand-charcoal hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot / pill navigation */}
      <div
        className="absolute bottom-9 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2.5"
        role="tablist"
        aria-label="Slide navigation"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
              i === current
                ? "w-8 h-2 bg-brand-gold"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-9 right-6 z-30 text-xs text-white/40 tabular-nums select-none">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}

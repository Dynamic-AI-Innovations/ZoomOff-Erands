"use client";

import { Button } from "@zoomoff/ui";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-8 bg-zo-bg-light">
      <span className="text-5xl mb-4">⚠️</span>
      <h1 className="font-display text-2xl font-bold text-brand-charcoal">Something went wrong</h1>
      <p className="text-zo-muted mt-2 max-w-sm">Our team has been notified. Please try again.</p>
      <Button variant="primary" size="lg" className="mt-6" onClick={reset}>Try Again</Button>
    </div>
  );
}

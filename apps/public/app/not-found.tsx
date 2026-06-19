import Link from "next/link";
import { Button } from "@zoomoff/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-8">
      <span className="font-display text-8xl font-bold text-brand-gold">404</span>
      <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-4">Page not found</h1>
      <p className="text-zo-muted mt-2 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Button variant="primary" size="lg" className="mt-6" asChild>
        <Link href="/">Back to ZoomOff Errands</Link>
      </Button>
    </div>
  );
}

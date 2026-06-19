import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ReferralCapture } from "@/components/ReferralCapture";

export const metadata: Metadata = {
  title: {
    default: "ZoomOff Errands — Fast, Trusted Errands",
    template: "%s | ZoomOff Errands",
  },
  description:
    "ZoomOff Errands connects you with verified, GPS-tracked runners ready to handle your errands — grocery runs, deliveries, banking, and more. Fast. Trusted. Convenient.",
  keywords: ["errand service", "delivery", "runner", "Lagos", "Nigeria", "ZoomOff Errands"],
  metadataBase: new URL("https://zoomoff.africa"),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://zoomoff.africa",
    siteName: "ZoomOff Errands",
    title: "ZoomOff Errands — Fast, Trusted Errands",
    description: "Verified runners ready to handle your errands across Nigeria.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ZoomOff Errands" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ZoomOff ErrandsNG",
    title: "ZoomOff Errands — Fast, Trusted Errands",
    description: "Verified runners ready to handle your errands across Nigeria.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ReferralCapture />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

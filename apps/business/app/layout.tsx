import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
export const metadata: Metadata = { title: { default: "ZoomOff Errands Business", template: "%s | ZoomOff Errands Business" }, description: "Manage your organisation's errands.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}

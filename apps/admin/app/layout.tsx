import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
export const metadata: Metadata = {
  title: { default: "ZoomOff Admin", template: "%s | ZoomOff Admin" },
  description: "ZoomOff internal operations console.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}

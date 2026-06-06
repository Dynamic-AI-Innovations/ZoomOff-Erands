import Image from "next/image";
import Link from "next/link";

const LINKS = {
  Platform: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Task Categories", href: "/#services" },
    { label: "City Coverage", href: "/#cities" },
  ],
  Runners: [
    { label: "Become a Runner", href: "/become-a-runner" },
    { label: "Runner Requirements", href: "/become-a-runner#requirements" },
    { label: "Earnings", href: "/become-a-runner#earnings" },
  ],
  Business: [
    { label: "ZoomOff for Business", href: "/business" },
    { label: "Enterprise Plans", href: "/business#pricing" },
    { label: "API Access", href: "/business#api" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zo-border bg-brand-charcoal text-white">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/logo.png" alt="ZoomOff Errand Services" width={140} height={56} className="h-14 w-auto object-contain" />
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Fast · Trusted · Connected · Convenient · Premium
            </p>
            <p className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} Dynamics Technology Ltd.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Regulated in Nigeria. NDPR compliant. Payments secured by Paystack & Flutterwave.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="text-xs text-gray-500 hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-xs text-gray-500 hover:text-white">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <p className="text-2xs text-gray-600 tracking-wide">
            Powered by{" "}
            <span className="text-brand-gold font-medium">Dynamics Technology</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

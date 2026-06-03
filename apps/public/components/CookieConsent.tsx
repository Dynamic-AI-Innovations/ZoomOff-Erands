"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@zoomoff/ui";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_NAME = "zo_consent";
const EXPIRY_DAYS = 365;

function getStoredConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match || !match[1]) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentState) {
  const expires = new Date();
  expires.setDate(expires.getDate() + EXPIRY_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [prefs, setPrefs] = React.useState<Omit<ConsentState, "essential">>({
    analytics: false,
    marketing: false,
  });

  React.useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function accept(consent: ConsentState) {
    storeConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-lg rounded-2xl border border-zo-border bg-white shadow-modal md:left-auto md:right-6 md:bottom-6"
    >
      <div className="p-5">
        <p className="text-sm font-semibold text-brand-charcoal mb-1">
          🍪 We use cookies
        </p>
        <p className="text-xs text-zo-muted mb-4 leading-relaxed">
          We use cookies to improve your experience and analyse site traffic. By clicking &quot;Accept All&quot;, you agree to our{" "}
          <Link href="/legal/privacy" className="underline hover:text-brand-charcoal">
            Privacy Policy
          </Link>
          . Essential cookies are always active.
        </p>

        {showDetails && (
          <div className="mb-4 space-y-2 rounded-xl border border-zo-border p-3">
            {[
              { key: "essential", label: "Essential", desc: "Required for the site to work", locked: true },
              { key: "analytics", label: "Analytics", desc: "Help us understand how visitors use the site", locked: false },
              { key: "marketing", label: "Marketing", desc: "Enable personalised ads and content", locked: false },
            ].map(({ key, label, desc, locked }) => (
              <label key={key} className={`flex items-start gap-3 ${locked ? "opacity-60" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={locked || prefs[key as keyof typeof prefs] === true}
                  disabled={locked}
                  onChange={(e) => {
                    if (!locked) setPrefs((p) => ({ ...p, [key]: e.target.checked }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-zo-border accent-brand-gold"
                />
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal">{label}</p>
                  <p className="text-xs text-zo-muted">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => accept({ essential: true, analytics: true, marketing: true })}
            className="flex-1"
          >
            Accept All
          </Button>
          {showDetails ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => accept({ essential: true, ...prefs })}
              className="flex-1"
            >
              Save Preferences
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Customise
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => accept({ essential: true, analytics: false, marketing: false })}
          >
            Reject All
          </Button>
        </div>
      </div>
    </div>
  );
}

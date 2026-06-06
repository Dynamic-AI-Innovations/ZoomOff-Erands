declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

export interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in kobo
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

let scriptLoaded = false;

export function loadPaystack(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => { scriptLoaded = true; resolve(); };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export async function openPaystackModal(options: PaystackOptions) {
  await loadPaystack();
  const handler = window.PaystackPop.setup(options);
  handler.openIframe();
}

export function generateRef(): string {
  return `ZO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

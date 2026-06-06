export const LS_KEYS = {
  refCode:       "zo_ref_code",
  refSource:     "zo_ref_source",
  refCapturedAt: "zo_ref_captured_at",
  myRefCode:     "zo_my_ref_code",
} as const;

export const REF_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const REF_REGEX  = /^ZO-[A-Z0-9]{6}$/;

export function getStoredRef(): { code: string; source: string } | null {
  try {
    const code        = localStorage.getItem(LS_KEYS.refCode);
    const source      = localStorage.getItem(LS_KEYS.refSource) ?? "customer";
    const capturedAt  = localStorage.getItem(LS_KEYS.refCapturedAt);
    if (!code || !REF_REGEX.test(code)) return null;
    if (capturedAt && Date.now() - new Date(capturedAt).getTime() > REF_TTL_MS) {
      clearRef();
      return null;
    }
    return { code, source };
  } catch { return null; }
}

export function saveRef(code: string, source = "customer"): void {
  try {
    if (!REF_REGEX.test(code)) return;
    // Idempotent: don't overwrite a valid unexpired identical code
    const existing = getStoredRef();
    if (existing?.code === code) return;
    localStorage.setItem(LS_KEYS.refCode,       code);
    localStorage.setItem(LS_KEYS.refSource,     source);
    localStorage.setItem(LS_KEYS.refCapturedAt, new Date().toISOString());
  } catch {}
}

export function clearRef(): void {
  try {
    localStorage.removeItem(LS_KEYS.refCode);
    localStorage.removeItem(LS_KEYS.refSource);
    localStorage.removeItem(LS_KEYS.refCapturedAt);
  } catch {}
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function getMyRefCode(): string {
  try {
    const stored = localStorage.getItem(LS_KEYS.myRefCode);
    if (stored && REF_REGEX.test(stored)) return stored;
    let code = "ZO-";
    for (let i = 0; i < 6; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
    localStorage.setItem(LS_KEYS.myRefCode, code);
    return code;
  } catch { return "ZO-ABC123"; }
}

export function buildShareUrl(code: string, type: "customer" | "runner" | "business"): string {
  return `https://zoomoff.africa/join?ref=${code}&type=${type}`;
}

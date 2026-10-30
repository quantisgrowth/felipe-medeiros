export type AnalyticsEvent =
  | "cta_whatsapp_click"
  | "diagnostic_form_start"
  | "diagnostic_form_submit"
  | "diagnostic_form_success"
  | "diagnostic_form_error"
  | "thank_you_page_view"
  | "linkedin_click";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const UTM_STORAGE_KEY = "fm_session_utms";
const UTM_PARAM_NAMES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function captureUtms(): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    const current: Record<string, string> = existingRaw ? JSON.parse(existingRaw) : {};

    let changed = false;
    UTM_PARAM_NAMES.forEach((key) => {
      const val = params.get(key);
      if (val && val.trim()) {
        current[key] = val.trim().slice(0, 200);
        changed = true;
      }
    });

    if (changed) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // sessionStorage unavailable or blocked by privacy modes
  }
}

export function getStoredUtms(): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof window === "undefined") return result;

  try {
    if (window.sessionStorage) {
      const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) {
        Object.assign(result, JSON.parse(stored));
      }
    }
  } catch {
    // ignore
  }

  try {
    const params = new URLSearchParams(window.location.search);
    UTM_PARAM_NAMES.forEach((key) => {
      const val = params.get(key);
      if (val && val.trim()) {
        result[key] = val.trim().slice(0, 200);
      }
    });
  } catch {
    // ignore
  }

  return result;
}

export function trackEvent(event: AnalyticsEvent, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer?.push({ event, ...detail });
  window.gtag?.("event", event, detail);
  window.fbq?.("trackCustom", event, detail);
}

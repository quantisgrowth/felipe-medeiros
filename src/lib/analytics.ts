export type AnalyticsEvent =
  | "cta_whatsapp_click"
  | "diagnostic_form_start"
  | "diagnostic_form_submit"
  | "diagnostic_form_success"
  | "diagnostic_form_error"
  | "linkedin_click";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer?.push({ event, ...detail });
  window.gtag?.("event", event, detail);
  window.fbq?.("trackCustom", event, detail);
}

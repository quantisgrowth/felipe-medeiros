export const SITE_CONFIG = {
  whatsappNumber: "[WHATSAPP_NUMBER]",
  whatsappMessage:
    "Olá, Felipe. Conheci a Implantação Comercial 4.0 e gostaria de analisar minha operação.",
  email: "[EMAIL]",
  linkedinUrl: "[LINKEDIN_URL]",
  privacyUrl: "[PRIVACY_URL]",
  termsUrl: "[TERMS_URL]",
  gaMeasurementId: "[GA_MEASUREMENT_ID]",
  metaPixelId: "[META_PIXEL_ID]",
} as const;

const isPlaceholder = (value: string) => value.startsWith("[") && value.endsWith("]");

export function getWhatsAppUrl() {
  const number = isPlaceholder(SITE_CONFIG.whatsappNumber)
    ? ""
    : SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
}

export function getSafeExternalUrl(value: string, fallback = "#") {
  return isPlaceholder(value) ? fallback : value;
}

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

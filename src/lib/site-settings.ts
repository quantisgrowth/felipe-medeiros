import { getSupabaseClient } from "./supabase";

export type SiteSettings = {
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  linkedinUrl: string;
  privacyUrl: string;
  termsUrl: string;
  gaMeasurementId: string;
  metaPixelId: string;
  customHeadScripts: string;
  footerTagline: string;
  heroPhotoUrl: string;
  aboutPhotoUrl: string;
};

// Usado caso o Supabase esteja fora do ar, ou antes de a primeira
// configuração ser salva pelo admin — o site nunca fica quebrado.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappNumber: "5515981103345",
  whatsappMessage:
    "Olá, Felipe. Conheci a Implantação Comercial 4.0 e gostaria de analisar minha operação.",
  email: "felipe@quantisgrowth.com.br",
  linkedinUrl: "",
  privacyUrl: "",
  termsUrl: "",
  gaMeasurementId: "",
  metaPixelId: "",
  customHeadScripts: "",
  footerTagline: "Especialista em Vendas, Liderança Comercial e Automação",
  heroPhotoUrl: "",
  aboutPhotoUrl: "",
};

type SiteSettingsRow = {
  whatsapp_number: string;
  whatsapp_message: string;
  email: string;
  linkedin_url: string;
  privacy_url: string;
  terms_url: string;
  ga_measurement_id: string;
  meta_pixel_id: string;
  custom_head_scripts: string;
  footer_tagline: string;
  hero_photo_url: string;
  about_photo_url: string;
};

function rowToSettings(row: SiteSettingsRow): SiteSettings {
  return {
    whatsappNumber: row.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
    whatsappMessage: row.whatsapp_message || DEFAULT_SITE_SETTINGS.whatsappMessage,
    email: row.email || DEFAULT_SITE_SETTINGS.email,
    linkedinUrl: row.linkedin_url,
    privacyUrl: row.privacy_url,
    termsUrl: row.terms_url,
    gaMeasurementId: row.ga_measurement_id,
    metaPixelId: row.meta_pixel_id,
    customHeadScripts: row.custom_head_scripts,
    footerTagline: row.footer_tagline || DEFAULT_SITE_SETTINGS.footerTagline,
    heroPhotoUrl: row.hero_photo_url,
    aboutPhotoUrl: row.about_photo_url,
  };
}

export function settingsToRow(settings: SiteSettings): SiteSettingsRow {
  return {
    whatsapp_number: settings.whatsappNumber,
    whatsapp_message: settings.whatsappMessage,
    email: settings.email,
    linkedin_url: settings.linkedinUrl,
    privacy_url: settings.privacyUrl,
    terms_url: settings.termsUrl,
    ga_measurement_id: settings.gaMeasurementId,
    meta_pixel_id: settings.metaPixelId,
    custom_head_scripts: settings.customHeadScripts,
    footer_tagline: settings.footerTagline,
    hero_photo_url: settings.heroPhotoUrl,
    about_photo_url: settings.aboutPhotoUrl,
  };
}

/**
 * Busca as configurações públicas do site (WhatsApp, links, tags, fotos...).
 * Nunca lança erro — se o Supabase falhar por qualquer motivo, devolve os
 * valores padrão para o site continuar no ar normalmente.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "whatsapp_number, whatsapp_message, email, linkedin_url, privacy_url, terms_url, ga_measurement_id, meta_pixel_id, custom_head_scripts, footer_tagline, hero_photo_url, about_photo_url",
      )
      .eq("id", true)
      .maybeSingle();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return rowToSettings(data as SiteSettingsRow);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

function isConfigured(value: string) {
  return value.trim().length > 0;
}

export function getWhatsAppUrl(settings: SiteSettings) {
  const number = settings.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(settings.whatsappMessage)}`;
}

export function getSafeExternalUrl(value: string, fallback = "#") {
  return isConfigured(value) ? value : fallback;
}

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

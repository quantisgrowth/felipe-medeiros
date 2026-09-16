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
  leadWebhookUrl: string;
  notificationEmail: string;
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
  leadWebhookUrl: "",
  notificationEmail: "",
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
  lead_webhook_url: string;
  notification_email: string;
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
    leadWebhookUrl: row.lead_webhook_url,
    notificationEmail: row.notification_email,
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
    lead_webhook_url: settings.leadWebhookUrl,
    notification_email: settings.notificationEmail,
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
        "whatsapp_number, whatsapp_message, email, linkedin_url, privacy_url, terms_url, ga_measurement_id, meta_pixel_id, custom_head_scripts, footer_tagline, hero_photo_url, about_photo_url, lead_webhook_url, notification_email",
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

export type LeadPayload = {
  name: string;
  company: string;
  role: string;
  whatsapp: string;
  email: string;
  segment: string;
  monthlyLeads: string;
  teamSize: string;
  mainChallenge: string;
  source: string;
  pageUrl: string;
  utm: Record<string, string>;
};

/**
 * Salva a solicitação direto no Supabase (sempre funciona, é a fonte da
 * verdade) e, se um webhook externo estiver configurado, também tenta
 * encaminhar pra lá — mas isso nunca bloqueia nem falha o envio principal.
 */
export async function submitLead(payload: LeadPayload, webhookUrl: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("leads").insert({
    name: payload.name,
    company: payload.company,
    role: payload.role,
    whatsapp: payload.whatsapp,
    email: payload.email,
    segment: payload.segment,
    monthly_leads: payload.monthlyLeads,
    team_size: payload.teamSize,
    main_challenge: payload.mainChallenge,
    source: payload.source,
    page_url: payload.pageUrl,
    utm: payload.utm,
  });

  if (error) throw error;

  if (isConfigured(webhookUrl)) {
    // melhor esforço: se o webhook externo falhar, o lead já está salvo.
    const webhookBody = {
      name: payload.name,
      company: payload.company,
      role: payload.role,
      whatsapp: payload.whatsapp,
      email: payload.email,
      segment: payload.segment,
      monthly_leads: payload.monthlyLeads,
      team_size: payload.teamSize,
      main_challenge: payload.mainChallenge,
      source: payload.source,
      page_url: payload.pageUrl,
      submitted_at: new Date().toISOString(),
      ...payload.utm,
    };
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookBody),
    }).catch(() => {});
  }
}

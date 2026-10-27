import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_ROLES, DEFAULT_SEGMENTS, normalizeOptions } from "./form-options";
import { getSupabaseClient, getPublicSupabaseClient } from "./supabase";

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
  formRoles: string[];
  formSegments: string[];
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
  formRoles: DEFAULT_ROLES,
  formSegments: DEFAULT_SEGMENTS,
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
  lead_webhook_url?: string;
  notification_email?: string;
  form_roles?: string[];
  form_segments?: string[];
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
    // Arbitrary custom scripts are intentionally not exposed to the public client.
    customHeadScripts: "",
    footerTagline: row.footer_tagline || DEFAULT_SITE_SETTINGS.footerTagline,
    heroPhotoUrl: row.hero_photo_url,
    aboutPhotoUrl: row.about_photo_url,
    // These settings are private and are only read by authenticated admin/server code.
    leadWebhookUrl: "",
    notificationEmail: "",
    formRoles: normalizeOptions(row.form_roles, DEFAULT_ROLES),
    formSegments: normalizeOptions(row.form_segments, DEFAULT_SEGMENTS),
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
    form_roles: normalizeOptions(settings.formRoles, DEFAULT_ROLES),
    form_segments: normalizeOptions(settings.formSegments, DEFAULT_SEGMENTS),
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
      .select("whatsapp_number,whatsapp_message,email,linkedin_url,privacy_url,terms_url,ga_measurement_id,meta_pixel_id,footer_tagline,hero_photo_url,about_photo_url,form_roles,form_segments")
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
  tools: string[];
  source: string;
  pageUrl: string;
  utm: Record<string, string>;
};

/**
 * Valida no servidor os dados recebidos do formulário público.
 * A validação do navegador é útil para UX, mas não é uma barreira de segurança.
 */
function validateLeadPayload(data: unknown): LeadPayload {
  if (typeof data !== "object" || data === null) throw new Error("Dados do formulário inválidos.");
  const input = data as Record<string, unknown>;
  const textField = (key: string, max: number, required = false) => {
    const value = input[key];
    if (typeof value !== "string") {
      if (required) throw new Error("Campo obrigatório inválido.");
      return "";
    }
    const normalized = value.trim().slice(0, max);
    if (required && !normalized) throw new Error("Preencha os campos obrigatórios.");
    return normalized;
  };
  const toolsInput = input.tools;
  const tools = Array.isArray(toolsInput)
    ? toolsInput.filter((item): item is string => typeof item === "string").slice(0, 30).map((item) => item.trim().slice(0, 100))
    : [];
  const utmInput = typeof input.utm === "object" && input.utm !== null
    ? (input.utm as Record<string, unknown>)
    : {};
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = utmInput[key];
    if (typeof value === "string" && value.trim()) utm[key] = value.trim().slice(0, 200);
  }

  const email = textField("email", 254, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido.");

  return {
    name: textField("name", 150, true),
    company: textField("company", 200, true),
    role: textField("role", 100, true),
    whatsapp: textField("whatsapp", 30, true),
    email,
    segment: textField("segment", 100, true),
    monthlyLeads: textField("monthlyLeads", 100, true),
    teamSize: textField("teamSize", 100, true),
    mainChallenge: textField("mainChallenge", 2000, true),
    tools,
    source: textField("source", 100),
    pageUrl: textField("pageUrl", 2000),
    utm,
  };
}

/**
 * Salva o lead no servidor e encaminha ao webhook configurado no banco.
 * A URL privada do webhook nunca é enviada ao navegador.
 */
export const submitLead = createServerFn({ method: "POST" })
  .validator(validateLeadPayload)
  .handler(async ({ data }) => {
    const payload = data;
    const supabase = getPublicSupabaseClient();
    const record = {
      name: payload.name,
      company: payload.company,
      role: payload.role,
      whatsapp: payload.whatsapp,
      email: payload.email,
      segment: payload.segment,
      monthly_leads: payload.monthlyLeads,
      team_size: payload.teamSize,
      main_challenge: payload.mainChallenge,
      tools: payload.tools,
      source: payload.source,
      page_url: payload.pageUrl,
      utm: payload.utm,
    };
    let { error } = await supabase.from("leads").insert(record);

    // Compatibilidade com schemas antigos que ainda não possuem a coluna tools.
    if (error && ["PGRST204", "42703"].includes(error.code) && /\\btools\\b/i.test(error.message)) {
      const { tools, ...legacyRecord } = record;
      const result = await supabase.from("leads").insert({
        ...legacyRecord,
        main_challenge: `${payload.mainChallenge}\\n\\nFerramentas atuais: ${tools.length ? tools.join(", ") : "Nenhuma informada"}`,
      });
      error = result.error;
    }
    if (error) throw error;

    try {
      // Private webhook configuration must come from the server environment.
      // Never read it through the public Supabase/anon client.
      const webhookUrl =
        typeof process !== "undefined" && typeof process.env.LEAD_WEBHOOK_URL === "string"
          ? process.env.LEAD_WEBHOOK_URL.trim()
          : "";
      if (webhookUrl) {
        const url = new URL(webhookUrl);
        // Webhooks externos devem usar HTTPS; a URL permanece no servidor.
        if (url.protocol === "https:") {
          await fetch(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...record,
              submitted_at: new Date().toISOString(),
              ...payload.utm,
            }),
            signal: AbortSignal.timeout(4000),
          });
        }
      }
    } catch {
      // O lead já foi salvo; falha do webhook não deve perder a solicitação.
    }
  });

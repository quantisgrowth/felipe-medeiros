import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestHost, getRequestIP } from "@tanstack/react-start/server";

import { getSupabaseClient } from "./supabase";

// "Tempero" fixo só pra dificultar reversão trivial do hash — não é segredo
// crítico, o objetivo é apenas evitar guardar o IP em texto puro.
const IP_HASH_PEPPER = "felipe-medeiros-site-pv-2026";

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${IP_HASH_PEPPER}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function resolveClientIp(): string {
  // Cloudflare sempre manda o IP real do visitante nesse header.
  return getRequestHeader("cf-connecting-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown";
}

function resolveDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|kindle|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(ua)) return "mobile";
  return "desktop";
}

function resolveSource(utmSource: string, referrer: string): string {
  if (utmSource) return utmSource.toLowerCase().slice(0, 60);

  if (referrer) {
    try {
      const referrerHost = new URL(referrer).hostname.replace(/^www\./, "");
      const siteHost = getRequestHost().replace(/^www\./, "");
      if (referrerHost && referrerHost !== siteHost) return referrerHost.slice(0, 60);
    } catch {
      // referrer inválida, cai pro "direto"
    }
  }

  return "direto";
}

export const recordPageView = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const input =
      typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
    const asString = (value: unknown) => (typeof value === "string" ? value.slice(0, 300) : "");
    return {
      path: asString(input["path"]) || "/",
      referrer: asString(input["referrer"]),
      utmSource: asString(input["utmSource"]),
    };
  })
  .handler(async ({ data }) => {
    try {
      const ip = resolveClientIp();
      const ipHash = await hashIp(ip);
      const userAgent = getRequestHeader("user-agent") ?? "";
      const deviceType = resolveDeviceType(userAgent);
      const source = resolveSource(data.utmSource, data.referrer);

      const supabase = getSupabaseClient();
      await supabase.from("page_views").insert({
        path: data.path,
        ip_hash: ipHash,
        user_agent: userAgent.slice(0, 300),
        device_type: deviceType,
        source,
      });
    } catch {
      // Contagem de visitas nunca deve quebrar a navegação do site.
    }
    return null;
  });

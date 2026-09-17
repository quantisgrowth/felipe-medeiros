import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

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

export const recordPageView = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const path =
      typeof data === "object" && data !== null ? (data as { path?: unknown }).path : undefined;
    return { path: typeof path === "string" ? path.slice(0, 300) : "/" };
  })
  .handler(async ({ data }) => {
    try {
      const ip = resolveClientIp();
      const ipHash = await hashIp(ip);
      const userAgent = getRequestHeader("user-agent") ?? "";

      const supabase = getSupabaseClient();
      await supabase.from("page_views").insert({
        path: data.path,
        ip_hash: ipHash,
        user_agent: userAgent.slice(0, 300),
      });
    } catch {
      // Contagem de visitas nunca deve quebrar a navegação do site.
    }
    return null;
  });

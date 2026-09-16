import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Chaves públicas (anon/publishable) — seguras para expor no navegador.
// A leitura pública da tabela site_settings e do bucket site-photos é
// intencional (ver policies no Supabase); nada sensível fica aqui.
const SUPABASE_URL = "https://cnstabbralxsvftsvxug.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuc3RhYmJyYWx4c3ZmdHN2eHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTExMDIsImV4cCI6MjEwNTA2NzEwMn0.RN1SkYZ0htUnDcfrhc9rPJIYfyWKDuTblJEFgdNHsmY";

let browserClient: SupabaseClient | undefined;

/**
 * Cliente Supabase. No navegador, reaproveita uma única instância (guarda a
 * sessão do usuário logado no localStorage). No servidor (SSR), cria uma
 * instância nova e "burra" a cada chamada — sem sessão, só para leituras
 * públicas (ex.: carregar site_settings para renderizar a página).
 */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return browserClient;
}

export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { fetchSiteSettings } from "../lib/site-settings";
import { SiteSettingsProvider } from "../lib/site-settings-context";
import { Toaster } from "../components/ui/sonner";
import { getSupabaseClient, SUPABASE_URL } from "../lib/supabase";
import { recordPageView } from "../lib/track-page-view";

function NotFoundComponent() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-deep px-5 py-16 text-inverse">
      <div className="editorial-grid" aria-hidden="true" />
      <div className="relative max-w-2xl text-center">
        <p className="font-serif text-5xl italic text-gold-light md:text-7xl">404</p>
        <h1 className="section-title mt-5 text-inverse">Página não encontrada.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-inverse-muted">
          O endereço pode estar incorreto ou a página pode ter sido movida.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className="button-gold inline-flex items-center justify-center">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: import("@tanstack/react-router").ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-deep px-5 py-16 text-inverse">
      <div className="editorial-grid" aria-hidden="true" />
      <div className="relative max-w-2xl text-center">
        <p className="eyebrow">Não foi possível carregar</p>
        <h1 className="section-title text-inverse">Algo não funcionou como esperado.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-inverse-muted">
          Tente carregar novamente. Se o problema continuar, você pode voltar para a página inicial.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="button-gold inline-flex items-center justify-center"
          >
            Tentar novamente
          </button>
          <a href="/" className="button-outline-dark inline-flex items-center justify-center">
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  loader: () => fetchSiteSettings(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Felipe Medeiros" },
      { name: "google-site-verification", content: "o16dCFEpWLsQmyJwpN8fysMjQxKBQhLhEDbBoRK1MN8" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-fm.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: SUPABASE_URL, crossOrigin: "anonymous" },
      {
        rel: "preload",
        href: "/fonts/manrope-variable-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/libre-baskerville-italic-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const siteSettings = Route.useLoaderData();

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        {/* Tags/pixels configurados no /manager-felipe pela equipe de tráfego (GA, Meta Pixel, GTM, etc.) */}
        {siteSettings.customHeadScripts && (
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: siteSettings.customHeadScripts }}
          />
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const siteSettings = Route.useLoaderData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Instancia o client do Supabase assim que qualquer página carrega no navegador.
  // Isso garante que um link de convite/recuperação de senha (que chega com um
  // token na URL) seja processado e vire uma sessão válida imediatamente,
  // não importa em qual página da rota o usuário caiu.
  useEffect(() => {
    getSupabaseClient();
  }, []);

  // Contador de visitas: registra uma visualização a cada página carregada
  // ou navegada dentro do site. Nunca deve travar ou afetar a navegação.
  useEffect(() => {
    if (pathname.startsWith("/manager-felipe")) return;
    const utmSource = new URLSearchParams(window.location.search).get("utm_source") ?? "";
    recordPageView({ data: { path: pathname, referrer: document.referrer, utmSource } }).catch(
      () => {},
    );
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider value={siteSettings}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster richColors position="top-center" />
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

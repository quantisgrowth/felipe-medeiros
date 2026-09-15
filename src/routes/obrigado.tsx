import { createFileRoute } from "@tanstack/react-router";
import { ThankYouPage } from "@/components/thank-you-page";

export const Route = createFileRoute("/obrigado")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Diagnóstico solicitado | Felipe Medeiros" },
      { name: "description", content: "Sua solicitação de diagnóstico comercial foi recebida por Felipe Medeiros." },
      { property: "og:title", content: "Diagnóstico solicitado | Felipe Medeiros" },
      { property: "og:description", content: "Sua solicitação de diagnóstico comercial foi recebida." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://felipe-medeiros.lovable.app/obrigado" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://felipe-medeiros.lovable.app/obrigado" }],
  }),
  component: ThankYouPage,
});
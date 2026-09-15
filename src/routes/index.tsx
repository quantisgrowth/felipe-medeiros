import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Felipe Medeiros | Vendas, CRM, IA e Automação Comercial" },
      { name: "description", content: "Estruture sua operação comercial com CRM, WhatsApp, inteligência artificial e automações. Solicite um diagnóstico estratégico com Felipe Medeiros." },
      { property: "og:title", content: "Transforme sua operação comercial com estratégia, IA e automação" },
      { property: "og:description", content: "Diagnóstico, implementação de CRM, agentes de IA, automações e treinamento para empresas que querem vender com mais organização e controle." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

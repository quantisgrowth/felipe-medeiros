import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { trackEvent } from "@/lib/analytics";

export function ThankYouPage() {
  const settings = useSiteSettings();

  useEffect(() => {
    trackEvent("thank_you_page_view");
  }, []);

  const rawPhone = settings.whatsappNumber.replace(/\D/g, "");
  const fastTrackMsg = encodeURIComponent(
    "Olá Felipe, acabei de solicitar meu diagnóstico no site e gostaria de adiantar meu atendimento.",
  );
  const fastTrackWhatsAppUrl = rawPhone
    ? `https://wa.me/${rawPhone}?text=${fastTrackMsg}`
    : `https://wa.me/5515981103345?text=${fastTrackMsg}`;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-deep px-5 py-16 text-inverse">
      <div className="editorial-grid" aria-hidden="true" />
      <div className="relative w-full max-w-2xl rounded-lg border border-inverse/15 bg-primary p-8 text-center shadow-xl md:p-14">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <p className="eyebrow mt-7">Solicitação recebida</p>
        <h1 className="section-title text-inverse">Diagnóstico solicitado com sucesso.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-inverse-muted">
          Recebi suas informações. Agora vou analisar seu cenário e entrar em contato pelo WhatsApp
          para combinarmos o próximo passo.
        </p>
        <p className="mt-4 text-sm font-semibold text-gold-light">
          Quer adiantar sua conversa sem aguardar na fila?
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="button-gold">
            <a
              href={fastTrackWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click", { label: "thank_you_fast_track" })}
            >
              <MessageCircle /> Falar com Felipe agora
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="button-outline-dark">
            <Link to="/">
              <ArrowLeft /> Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

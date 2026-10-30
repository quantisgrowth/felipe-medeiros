import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { getSafeExternalUrl, getWhatsAppUrl, submitLead, UTM_KEYS } from "@/lib/site-settings";
import { COUNTRIES, internationalPhone, OPERATION_TOOLS } from "@/lib/form-options";
import { getStoredUtms, trackEvent, type AnalyticsEvent } from "@/lib/analytics";

function trackFormEvent(event: AnalyticsEvent, detail: Record<string, unknown> = {}) {
  try {
    trackEvent(event, detail);
  } catch {
    /* Optional tracking must never interrupt the form. */
  }
}

const COMMON_CHALLENGES = [
  "Leads demorando para serem respondidos",
  "Follow-ups e retornos esquecidos",
  "Conversas espalhadas no WhatsApp da equipe",
  "Falta de visibilidade e métricas do funil",
  "Processo comercial sem padrão",
  "Dificuldade em qualificar oportunidades",
] as const;

export function LeadForm() {
  const settings = useSiteSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("BR");
  const [phone, setPhone] = useState("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [customChallenge, setCustomChallenge] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [slow, setSlow] = useState(false);
  const [consent, setConsent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRef = useRef<HTMLFieldSetElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const submitting = useRef(false);

  useEffect(() => {
    if (status !== "loading") {
      setSlow(false);
      return;
    }
    const timeout = window.setTimeout(() => setSlow(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [status]);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function formatPhoneInput(value: string, currentCountry: string) {
    const raw = value.replace(/\D/g, "");
    if (currentCountry === "BR") {
      const d = raw.slice(0, 11);
      if (d.length <= 2) return d ? `(${d}` : "";
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    }
    return raw.slice(0, 15);
  }

  function changeStep(next: number) {
    setStep(next);
    setStatus("idle");
    window.requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  function validateContact() {
    const phoneEl = formRef.current?.elements.namedItem("whatsapp") as HTMLInputElement | null;
    if (phoneEl)
      phoneEl.setCustomValidity(
        internationalPhone(country, phone)
          ? ""
          : country === "BR"
            ? "Informe o DDD e o número completo (ex: (11) 99999-9999)."
            : "Informe o número local válido, sem o DDI (6 a 15 dígitos no total).",
      );
    const controls = firstRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      "input, select",
    );
    for (const control of controls ?? []) {
      if (!control.reportValidity()) return false;
    }
    return true;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === "success") return;
    if (step === 1) {
      if (validateContact()) changeStep(2);
      return;
    }
    if (!validateContact()) {
      changeStep(1);
      return;
    }
    const form = event.currentTarget;
    if (!form.reportValidity() || !consent) return;
    submitting.current = true;
    setStatus("loading");
    trackFormEvent("diagnostic_form_submit");
    const data = new FormData(form);
    const utm = getStoredUtms();
    const challengeText = [
      ...selectedChallenges,
      customChallenge.trim(),
    ].filter(Boolean).join("; ") || "Não detalhado";

    try {
      await submitLead({
        data: {
          name: String(data.get("name") ?? "").trim(),
          company: String(data.get("company") ?? "").trim(),
          role: String(data.get("role") ?? ""),
          email: String(data.get("email") ?? "").trim(),
          whatsapp: internationalPhone(country, phone)!,
          segment: String(data.get("segment") ?? ""),
          monthlyLeads: String(data.get("monthly_leads") ?? ""),
          teamSize: String(data.get("team_size") ?? ""),
          mainChallenge: challengeText,
          tools: data.getAll("tools").map(String),
          source: "landing-page-diagnostico",
          pageUrl: window.location.href,
          utm,
        },
      });
      setStatus("success");
      trackFormEvent("diagnostic_form_success");
      try {
        navigate({ to: "/obrigado" });
      } catch {
        // Fallback para estado de sucesso inline caso a navegação seja interrompida
      }
    } catch {
      setStatus("error");
      trackFormEvent("diagnostic_form_error");
    } finally {
      submitting.current = false;
    }
  }
  function select(label: string, name: string, options: string[]) {
    return (
      <label>
        <span className="form-label">{label}</span>
        <select name={name} required defaultValue="" className="form-control">
          <option value="" disabled>
            Selecione uma opção
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <section id="diagnostico" className="section-space scroll-mt-24 bg-surface">
      <div className="container-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="eyebrow">Solicite uma análise</p>
          <h2 className="section-title">Vamos entender seu momento.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Primeiro, seus dados e os da empresa. Depois, algumas perguntas para preparar uma
            conversa mais útil para o seu negócio.
          </p>
          <p className="mt-6 leading-7 text-muted-foreground">
            Após o envio, entraremos em contato pelo WhatsApp para combinar o diagnóstico.
          </p>
        </div>
        {status === "success" ? (
          <div
            ref={successRef}
            tabIndex={-1}
            className="diagnostic-form scroll-mt-24 focus-visible:outline-none"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="mb-6 size-12 text-success" aria-hidden="true" />
            <h3 className="text-2xl font-bold">Solicitação enviada com sucesso!</h3>
            <p className="mt-4 leading-7 text-muted-foreground">
              Recebemos suas informações. Para ter atendimento prioritário e adiantar seu diagnóstico,
              você também pode conversar diretamente com Felipe no WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="button-gold">
                <a
                  href={getWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackFormEvent("cta_whatsapp_click", { label: "inline_success" })}
                >
                  <MessageCircle aria-hidden="true" /> Falar no WhatsApp agora
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#inicio">
                  Voltar ao início <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            onFocus={() => {
              if (!started.current) {
                started.current = true;
                trackFormEvent("diagnostic_form_start");
              }
            }}
            className="diagnostic-form scroll-mt-24"
            aria-busy={status === "loading"}
          >
            <ol aria-label="Etapas do formulário" className="mb-6 grid grid-cols-2 gap-3 text-sm">
              {["Você e sua empresa", "Sua operação"].map((name, index) => (
                <li
                  key={name}
                  aria-current={step === index + 1 ? "step" : undefined}
                  className={`border-t-2 pt-3 ${step === index + 1 ? "border-gold font-bold text-foreground" : "border-border text-muted-foreground"}`}
                >
                  {index + 1}. {name}
                </li>
              ))}
            </ol>
            <h3 ref={titleRef} tabIndex={-1} className="mb-6 text-xl font-bold focus:outline-none">
              {step === 1 ? "Seus dados e os da empresa" : "Conte um pouco sobre sua operação"}
            </h3>
            <fieldset ref={firstRef} hidden={step !== 1} disabled={status === "loading"}>
              <legend className="sr-only">Informações de contato</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="form-label">Nome</span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className="form-control"
                  />
                </label>
                <label>
                  <span className="form-label">Empresa</span>
                  <input
                    name="company"
                    autoComplete="organization"
                    required
                    maxLength={120}
                    className="form-control"
                  />
                </label>
                {select("Cargo", "role", settings.formRoles)}
                <div>
                  <label htmlFor="lead-phone" className="form-label">
                    WhatsApp
                  </label>
                  <div className="mt-2 flex h-[3.25rem] rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    <label className="sr-only" htmlFor="lead-country">
                      País e código DDI
                    </label>
                    <select
                      id="lead-country"
                      value={country}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setCountry(newCountry);
                        setPhone(formatPhoneInput(phone, newCountry));
                        const phoneEl = formRef.current?.elements.namedItem(
                          "whatsapp",
                        ) as HTMLInputElement;
                        phoneEl?.setCustomValidity("");
                      }}
                      className="w-24 shrink-0 rounded-l-lg border-r border-input bg-surface px-2 text-sm"
                      autoComplete="country"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} +{c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      id="lead-phone"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      required
                      value={phone}
                      onChange={(e) => {
                        const formatted = formatPhoneInput(e.target.value, country);
                        setPhone(formatted);
                        e.target.setCustomValidity("");
                      }}
                      maxLength={22}
                      aria-describedby="phone-hint"
                      placeholder={country === "BR" ? "(11) 99999-9999" : "Número local"}
                      className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 outline-none"
                    />
                  </div>
                  <p id="phone-hint" className="mt-2 text-xs text-muted-foreground">
                    {country === "BR"
                      ? "Inclua o DDD. O +55 já está selecionado."
                      : "Digite o número sem o DDI selecionado ao lado."}
                  </p>
                </div>
                <label>
                  <span className="form-label">E-mail</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    className="form-control"
                  />
                </label>
                {select("Segmento", "segment", settings.formSegments)}
              </div>
            </fieldset>
            <fieldset hidden={step !== 2} disabled={status === "loading"}>
              <legend className="sr-only">Qualificação da operação</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {select("Volume aproximado de leads", "monthly_leads", [
                  "Até 50",
                  "De 51 a 200",
                  "De 201 a 500",
                  "Mais de 500",
                ])}
                {select("Tamanho da equipe", "team_size", [
                  "1 pessoa",
                  "2 a 5 pessoas",
                  "6 a 15 pessoas",
                  "Mais de 15 pessoas",
                ])}
              </div>
              <fieldset className="mt-7">
                <legend className="form-label">
                  Quais ferramentas você já conta hoje na sua operação?
                </legend>
                <p className="mt-2 text-sm text-muted-foreground">
                  Marque todas que utiliza. Se ainda não usa nenhuma, deixe em branco.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {OPERATION_TOOLS.map((tool) => (
                    <label
                      key={tool}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-sm"
                    >
                      <input
                        name="tools"
                        type="checkbox"
                        value={tool}
                        className="size-5 accent-primary"
                      />
                      {tool}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-6">
                <legend className="form-label">
                  Principais desafios da sua operação
                </legend>
                <p className="mt-1 text-sm text-muted-foreground">
                  Selecione os pontos que mais travam suas vendas hoje (ou descreva abaixo):
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COMMON_CHALLENGES.map((challenge) => {
                    const active = selectedChallenges.includes(challenge);
                    return (
                      <button
                        key={challenge}
                        type="button"
                        onClick={() => {
                          setSelectedChallenges((prev) =>
                            prev.includes(challenge)
                              ? prev.filter((c) => c !== challenge)
                              : [...prev, challenge],
                          );
                        }}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-gold bg-gold/20 text-foreground font-bold shadow-xs"
                            : "border-border bg-background text-muted-foreground hover:border-gold/60 hover:text-foreground"
                        }`}
                      >
                        {active ? "✓ " : "+ "}
                        {challenge}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label className="mt-4 block">
                <span className="text-xs font-medium text-muted-foreground">
                  Outro desafio ou observação adicional (opcional)
                </span>
                <textarea
                  name="main_challenge_custom"
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  maxLength={1200}
                  rows={3}
                  placeholder="Ex: Queremos integrar com nosso sistema atual, estruturar metas da equipe..."
                  className="form-control h-auto resize-y py-3"
                />
              </label>
              <label className="mt-6 flex items-start gap-3 text-xs leading-5 text-muted-foreground">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-1 size-5 shrink-0 accent-primary"
                />
                <span>
                  Autorizo o contato de Felipe Medeiros e o tratamento das informações fornecidas
                  para atendimento e diagnóstico comercial, conforme a{" "}
                  <a
                    href={getSafeExternalUrl(settings.privacyUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-primary underline"
                  >
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>
            </fieldset>
            {status === "error" && (
              <p role="alert" className="mt-5 rounded border border-destructive p-4 text-sm">
                Não foi possível confirmar o envio. Seus dados foram mantidos. Tente novamente ou{" "}
                <a
                  href={getWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline"
                >
                  fale conosco pelo WhatsApp
                </a>
                .
              </p>
            )}
            <p role="status" className="mt-4 text-sm text-muted-foreground" aria-live="polite">
              {status === "loading"
                ? slow
                  ? "O envio está levando mais tempo que o esperado. Aguarde a confirmação sem fechar esta página."
                  : "Enviando suas informações…"
                : ""}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={status === "loading"}
                  onClick={() => changeStep(1)}
                  className="min-h-12"
                >
                  <ArrowLeft aria-hidden="true" /> Voltar
                </Button>
              )}
              <Button
                type="submit"
                disabled={status === "loading" || (step === 2 && !consent)}
                className="button-gold min-w-0 flex-1 whitespace-normal"
              >
                {step === 1 ? (
                  <>
                    Continuar <ArrowRight aria-hidden="true" />
                  </>
                ) : status === "loading" ? (
                  <>
                    <span className="spinner" /> Enviando…
                  </>
                ) : (
                  <>
                    Enviar solicitação <Send aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

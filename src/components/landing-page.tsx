import { LeadForm } from "./lead-form";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  Check,
  CheckCircle2,
  CircleAlert,
  Database,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Network,
  PhoneCall,
  Route,
  Send,
  ShieldCheck,
  Target,
  Workflow,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { getSafeExternalUrl, getWhatsAppUrl } from "@/lib/site-settings";
import { useSiteSettings } from "@/lib/site-settings-context";
import { SitePhoto } from "@/components/site-photo";

const navItems = [
  ["Sobre", "sobre"],
  ["Produtos e serviços", "/produtos-e-servicos"],
  ["Solução", "solucao"],
  ["Como funciona", "como-funciona"],
  ["Implantação", "implantacao"],
  ["FAQ", "faq"],
] as const;
const problems = [
  [
    "Leads sem resposta",
    "O primeiro contato demora horas ou dias, e o interesse esfria antes de alguém responder.",
  ],
  [
    "Follow-ups esquecidos",
    "Sem um processo definido, o retorno depende da memória de quem atende — e memória falha.",
  ],
  [
    "Conversas espalhadas",
    "WhatsApp, e-mail, planilha: cada canal guarda um pedaço da história do cliente.",
  ],
  [
    "Atendimento sem padrão",
    "Cada vendedor conduz a conversa do seu jeito, sem um roteiro que garanta consistência.",
  ],
  [
    "Falta de indicadores",
    "Sem números, a decisão comercial vira achismo — e os gargalos passam despercebidos.",
  ],
  [
    "Pouca visibilidade do funil",
    "O gestor não sabe quantas oportunidades existem, em que etapa estão, nem por que travaram.",
  ],
] as const;
const authorityItems = [
  [Target, "Estratégia comercial"],
  [Database, "CRM e processos"],
  [BrainCircuit, "Inteligência artificial"],
  [Workflow, "Automação e integração"],
] as const;
const solutions = [
  [
    "CRM estruturado",
    "Leads, etapas, responsáveis e históricos organizados em uma operação clara.",
  ],
  [
    "Atendimento inteligente",
    "Um processo definido para receber, compreender e direcionar cada contato.",
  ],
  ["Agentes de IA", "Apoio no primeiro atendimento, na coleta de informações e na qualificação."],
  [
    "Automações comerciais",
    "Cadastros, distribuições, tarefas, confirmações, alertas e follow-ups.",
  ],
  ["Indicadores de gestão", "Visibilidade do funil para orientar decisões e corrigir gargalos."],
  ["Integrações personalizadas", "Conexão entre CRM, WhatsApp, formulários, agendas e sistemas."],
] as const;
const flowSteps = [
  ["Lead recebido", "Chega pelo site, WhatsApp ou indicação."],
  ["Atendimento", "Primeiro contato conduzido por um roteiro claro."],
  ["Cadastro", "Informações organizadas direto no CRM."],
  ["Qualificação", "Critérios definidos separam quem está pronto para avançar."],
  ["Distribuição", "Cada oportunidade chega ao responsável certo."],
  ["Follow-up", "Retornos acompanhados, sem depender da memória."],
  ["Gestão", "Indicadores mostram onde o funil trava."],
] as const;
const before = [
  "Conversas espalhadas",
  "Leads esquecidos",
  "Follow-up manual",
  "Atendimento sem padrão",
  "Gestão baseada em percepção",
];
const after = [
  "Contatos centralizados",
  "Funil estruturado",
  "Follow-ups acompanhados",
  "Responsabilidades definidas",
  "Indicadores para orientar decisões",
];
const methodology = [
  ["Compreender", "Leitura do negócio, dos canais, da jornada e da realidade da equipe."],
  ["Diagnosticar", "Identificação dos gargalos que interrompem o avanço das oportunidades."],
  ["Estruturar", "Definição do fluxo, das etapas, dos responsáveis e dos indicadores."],
  ["Implementar", "Configuração do CRM, das automações, da IA e das integrações necessárias."],
  ["Treinar", "Orientação prática para a equipe operar o novo processo com segurança."],
  ["Acompanhar", "Validação da operação, correções críticas e próximos avanços."],
] as const;
const deliverables = [
  "Diagnóstico da operação comercial",
  "Mapeamento da jornada do cliente",
  "Desenho do fluxo de atendimento",
  "Estruturação do funil",
  "Configuração do CRM",
  "Organização inicial dos leads",
  "Integração do canal de atendimento",
  "Formulários inteligentes",
  "Agente de primeiro atendimento",
  "Qualificação inicial",
  "Distribuição de oportunidades",
  "Tarefas comerciais",
  "Lembretes e follow-ups",
  "Confirmação de agendamentos",
  "Indicadores",
  "Treinamento da equipe",
  "Manual simplificado",
  "Suporte inicial",
];
const indicated = [
  "Recebem leads ou pedidos de orçamento pelo WhatsApp",
  "Investem em marketing ou prospecção",
  "Possuem vendedores, atendentes ou gestores",
  "Precisam organizar o processo comercial",
  "Querem reduzir tarefas repetitivas",
  "Precisam acompanhar negociações",
  "Desejam crescer com mais controle",
];
const notIdeal = [
  "A empresa ainda não recebe oportunidades",
  "A busca é apenas pela ferramenta mais barata",
  "Não existe uma pessoa responsável pelos leads",
  "Não há disposição para ajustar o processo",
];
const technologies = [
  "DataCrazy",
  "GPT Maker",
  "n8n",
  "WhatsApp Cloud API",
  "Lovable",
  "Supabase",
  "Integrações via API",
];
export const faqItems = [
  [
    "Preciso substituir todas as ferramentas que já utilizo?",
    "Não. Primeiro analisamos sua estrutura atual. O que continua fazendo sentido pode ser mantido e integrado.",
  ],
  [
    "O agente de IA substituirá meus vendedores?",
    "Não necessariamente. A IA pode assumir tarefas iniciais e repetitivas, enquanto as pessoas cuidam do relacionamento, da negociação e das decisões.",
  ],
  [
    "A solução funciona com WhatsApp?",
    "Sim. A modalidade de conexão será definida de acordo com as necessidades, o volume e a realidade da operação.",
  ],
  [
    "A implantação acontece em sete dias?",
    "A implantação inicial pode ser concluída em até sete dias úteis, dependendo do escopo e da disponibilização dos acessos e informações. Projetos mais complexos recebem um cronograma específico.",
  ],
  [
    "Minha equipe receberá treinamento?",
    "Sim. A orientação da equipe faz parte da implantação para que todos compreendam o processo e utilizem corretamente a estrutura.",
  ],
  [
    "Existe acompanhamento depois da entrega?",
    "Sim. O projeto pode incluir um período inicial de suporte. Acompanhamentos recorrentes podem ser contratados separadamente.",
  ],
  [
    "Quanto custa a implantação?",
    "O investimento depende da complexidade da operação, das integrações e do escopo. A recomendação e o orçamento são apresentados depois do diagnóstico.",
  ],
] as const;

function Emphasis({ children }: { children: ReactNode }) {
  return <em className="editorial-emphasis">{children}</em>;
}
function WhatsAppLink({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const settings = useSiteSettings();
  return (
    <Button asChild size="lg" className={className}>
      <a
        href={getWhatsAppUrl(settings)}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        onClick={() => trackEvent("cta_whatsapp_click", { label })}
      >
        {children}
      </a>
    </Button>
  );
}
function SectionHeading({
  eyebrow,
  children,
  copy,
  inverse = false,
  align = "center",
}: {
  eyebrow?: string;
  children: ReactNode;
  copy?: string;
  inverse?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`section-title ${inverse ? "text-inverse" : "text-foreground"}`}>
        {children}
      </h2>
      {copy && (
        <p
          className={`mt-6 max-w-3xl text-base leading-7 md:text-lg md:leading-8 ${inverse ? "text-inverse-muted" : "text-muted-foreground"}`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 xl:grid-cols-[auto_1fr_auto]">
        <a href="/#inicio" className="min-w-0" aria-label="Felipe Medeiros — início">
          <span className="block truncate text-base font-bold text-inverse">Felipe Medeiros</span>
          <span className="block truncate text-[10px] font-semibold uppercase text-inverse-muted">
            Vendas • Estratégia • Automação
          </span>
        </a>
        <nav
          className="hidden items-center justify-center gap-5 xl:flex"
          aria-label="Navegação principal"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={id.startsWith("/") ? id : `/#${id}`}
              className="text-sm font-medium text-inverse-muted transition-colors hover:text-gold-light"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild className="button-gold hidden px-3 min-[360px]:inline-flex sm:px-6">
            <a href="/#diagnostico">
              <span className="sm:hidden">Diagnóstico</span>
              <span className="hidden sm:inline">Solicitar diagnóstico</span>
              <ArrowRight />
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-inverse/25 bg-transparent text-inverse hover:bg-inverse/10 hover:text-inverse xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          className="border-t border-inverse/15 bg-deep px-5 py-4 xl:hidden"
          aria-label="Navegação para celular"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={id.startsWith("/") ? id : `/#${id}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-inverse hover:bg-inverse/10"
              >
                {label}
              </a>
            ))}
            <Button asChild className="button-gold mt-2 min-[360px]:hidden">
              <a href="/#diagnostico" onClick={() => setOpen(false)}>
                Solicitar diagnóstico <ArrowRight />
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Hero() {
  const settings = useSiteSettings();
  return (
    <section id="inicio" className="hero-section">
      <div className="editorial-grid" aria-hidden="true" />
      <div className="hero-wordmark" aria-hidden="true">
        ESTRATÉGIA
      </div>
      <div className="container-shell relative grid items-start gap-12 pb-14 pt-28 lg:min-h-[680px] lg:grid-cols-[1.08fr_.92fr] lg:pb-16 lg:pt-28">
        <div className="relative z-10 max-w-3xl">
          <p className="eyebrow">Consultoria comercial • Treinamento • Automação</p>
          <h1 className="page-title text-inverse">
            Organizo sua operação comercial para vender com{" "}
            <Emphasis>mais controle e previsibilidade.</Emphasis>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-inverse-muted">
            Identifico gargalos, treino sua equipe e implemento processos, CRM, inteligência
            artificial e automações para reduzir perdas e dar visibilidade ao funil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="button-gold">
              <a href="#diagnostico">
                Agendar diagnóstico de 30 minutos <ArrowRight />
              </a>
            </Button>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm text-inverse-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" /> Atendimento direto com
            Felipe Medeiros.
          </p>
        </div>
        <div
          className="hero-portrait lg:mt-10 lg:self-start"
          aria-label="Resultados práticos de uma operação comercial organizada"
        >
          {settings.heroPhotoUrl ? (
            <SitePhoto
              url={settings.heroPhotoUrl}
              kind="hero"
              alt="Felipe Medeiros"
              className="portrait-placeholder object-cover"
            />
          ) : (
            <div className="portrait-placeholder">
              <Network className="size-12" />
              <p className="mt-4 font-semibold text-inverse">Operação comercial conectada</p>
              <p className="mt-2 text-sm text-inverse-muted">
                Processo, pessoas e tecnologia trabalhando em conjunto
              </p>
            </div>
          )}
          <div className="opportunity-panel">
            <p className="text-[11px] font-bold uppercase text-gold">Na prática</p>
            {["Leads organizados", "Follow-ups acompanhados", "Gestão do funil"].map(
              (item, index) => (
                <div
                  key={item}
                  className="mt-3 flex items-center gap-3 border-t border-inverse/15 pt-3"
                >
                  <span className="text-sm font-bold text-gold">0{index + 1}</span>
                  <span className="text-xs text-inverse">{item}</span>
                  <CheckCircle2 className="ml-auto size-4 text-success" />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuthorityBar() {
  return (
    <section className="border-b border-border bg-background py-9">
      <div className="container-shell">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {authorityItems.map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="size-5 shrink-0 text-gold" />
              <span className="font-semibold text-foreground">{text}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-border pt-6 text-center text-sm font-medium text-muted-foreground">
          Da análise à implementação, com um único responsável pela transformação.
        </p>
      </div>
    </section>
  );
}

export function Problems() {
  return (
    <section className="section-space bg-surface">
      <Reveal className="container-shell">
        <SectionHeading eyebrow="O problema não é apenas gerar leads">
          Sua empresa pode estar criando oportunidades e <Emphasis>perdendo vendas</Emphasis> no
          caminho.
        </SectionHeading>
        <p className="mx-auto mt-7 max-w-3xl text-center text-lg leading-8 text-muted-foreground">
          O lead entra em contato. A resposta demora. As informações ficam espalhadas. O follow-up
          depende da memória da equipe. No final do mês, o gestor não consegue enxergar quantas
          oportunidades foram perdidas — nem por quê.
        </p>
        <div className="mt-14 grid gap-x-12 gap-y-0 border-t border-border md:grid-cols-2">
          {problems.map(([title, copy]) => (
            <article key={title} className="problem-item">
              <span className="problem-mark" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="button-gold">
            <a href="#diagnostico">
              Identificar gargalos da minha empresa <ArrowRight />
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="section-space bg-deep text-inverse">
      <Reveal className="container-shell grid gap-12 lg:grid-cols-[1fr_.82fr]">
        <SectionHeading inverse align="left" eyebrow="Uma visão integrada">
          Tecnologia sem estratégia cria ferramentas. Estratégia com implementação{" "}
          <Emphasis>cria resultados.</Emphasis>
        </SectionHeading>
        <div className="space-y-6 border-l border-gold/50 pl-6 md:pl-10">
          <p className="text-lg leading-8 text-inverse-muted">
            Comprar um CRM não organiza automaticamente uma empresa. Contratar um agente de IA não
            corrige sozinho um processo comercial. E automatizar um processo errado apenas faz o
            erro acontecer mais rápido.
          </p>
          <blockquote className="editorial-quote">
            “Meu trabalho não começa escolhendo uma ferramenta. Começa entendendo como sua empresa
            recebe, atende, qualifica, acompanha e converte oportunidades.”
          </blockquote>
          <p className="text-lg font-bold text-inverse">
            Não entrego apenas ferramentas. Coloco a operação para funcionar.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function SolutionCards() {
  return (
    <section id="solucao" className="section-space scroll-mt-20 bg-background">
      <Reveal className="container-shell">
        <SectionHeading
          eyebrow="Implantação Comercial 4.0"
          copy="Estratégia, processo e tecnologia conectados para transformar contatos em oportunidades acompanhadas."
        >
          Uma operação conectada do primeiro contato ao fechamento.
        </SectionHeading>
        <div className="mt-14 border-t border-border">
          {solutions.map(([title, copy], index) => (
            <article key={title} className="solution-row">
              <span className="solution-row-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function ProcessFlow() {
  return (
    <section id="como-funciona" className="section-space scroll-mt-20 bg-primary text-inverse">
      <Reveal className="container-shell">
        <SectionHeading inverse eyebrow="Fluxo da operação">
          Enquanto sua equipe constrói relacionamento, a tecnologia organiza o processo.
        </SectionHeading>
        <div className="process-line mt-20">
          {flowSteps.map(([step, detail], index) => (
            <div key={step} className="process-step">
              <span className="process-node">{String(index + 1).padStart(2, "0")}</span>
              <p className="step-title">{step}</p>
              <p className="step-desc">{detail}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function BeforeAfter() {
  return (
    <section className="section-space bg-surface">
      <Reveal className="container-shell">
        <SectionHeading eyebrow="Clareza operacional">
          O que muda quando o processo deixa de depender da memória.
        </SectionHeading>
        <div className="mt-14 grid overflow-hidden rounded-lg border border-border bg-background lg:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="text-sm font-bold uppercase text-muted-foreground">Antes</p>
            <ul className="mt-8 space-y-5">
              {before.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <X className="mt-0.5 size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border p-8 md:p-12 lg:border-l lg:border-t-0">
            <p className="text-sm font-bold uppercase text-gold">Depois</p>
            <ul className="mt-8 space-y-5">
              {after.map((item) => (
                <li key={item} className="flex gap-3 font-semibold text-foreground">
                  <Check className="mt-0.5 size-5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Methodology() {
  return (
    <section id="implantacao" className="section-space scroll-mt-20 bg-background">
      <Reveal className="container-shell">
        <SectionHeading eyebrow="Método de implantação">
          Do entendimento do negócio à operação funcionando.
        </SectionHeading>
        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {methodology.map(([title, copy], index) => (
            <article key={title} className="method-item">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="implementation-note">
          <CalendarCheck className="size-8 text-gold" />
          <div>
            <p className="text-xl font-bold text-inverse">
              Implantação inicial em até 7 dias úteis.
            </p>
            <p className="mt-2 text-sm leading-6 text-inverse-muted">
              O prazo começa após a aprovação do escopo e o recebimento dos acessos e informações.
              Projetos mais complexos recebem um cronograma específico.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Deliverables() {
  return (
    <section className="section-space bg-surface">
      <Reveal className="container-shell">
        <SectionHeading eyebrow="Escopo sob medida">
          O que pode fazer parte da implantação.
        </SectionHeading>
        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((item) => (
            <div key={item} className="flex items-center gap-3 border-b border-border py-4">
              <Check className="size-4 shrink-0 text-gold" />
              <span className="text-sm font-semibold text-foreground">{item}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-6 text-muted-foreground">
          O escopo é definido depois do diagnóstico, evitando ferramentas e funcionalidades
          desnecessárias.
        </p>
      </Reveal>
    </section>
  );
}

export function Qualification() {
  return (
    <section className="section-space bg-background">
      <Reveal className="container-shell">
        <SectionHeading eyebrow="Encaixe ideal">
          Uma solução para empresas que já geram oportunidades e precisam cuidar melhor delas.
        </SectionHeading>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="qualification-panel">
            <h3>Faz sentido para empresas que</h3>
            <ul>
              {indicated.map((item) => (
                <li key={item}>
                  <CheckCircle2 />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="qualification-panel muted">
            <h3>Provavelmente ainda não é o momento se</h3>
            <ul>
              {notIdeal.map((item) => (
                <li key={item}>
                  <CircleAlert />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Technologies() {
  return (
    <section className="section-space border-y border-border bg-surface">
      <Reveal className="container-shell grid gap-12 lg:grid-cols-[.82fr_1.18fr]">
        <SectionHeading align="left" eyebrow="Tecnologia depois da estratégia">
          A ferramenta certa é a que resolve o problema certo.
        </SectionHeading>
        <div>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            As tecnologias são escolhidas depois de compreendermos o processo, o volume de
            atendimento e os objetivos da empresa.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {technologies.map((item) => (
              <span key={item} className="tech-label">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-8 border-l border-gold pl-5 font-semibold leading-7 text-foreground">
            Você não precisa dominar essas tecnologias. Meu papel é fazer com que trabalhem juntas a
            favor da operação.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function About() {
  const settings = useSiteSettings();
  const indicators = [
    "17+ anos de experiência comercial multissetorial",
    "Experiência em vendas e liderança",
    "Partner DataCrazy",
    "Agentes de IA com GPT Maker",
    "Automações com n8n",
    "Desenvolvimento low-code",
  ];
  return (
    <section id="sobre" className="section-space scroll-mt-20 bg-primary text-inverse">
      <Reveal className="container-shell max-w-5xl">
        <SectionHeading inverse align="left" eyebrow="Experiência prática">
          Estratégia de quem vive a operação e implementa a solução.
        </SectionHeading>
        {settings.aboutPhotoUrl && (
          <SitePhoto
            url={settings.aboutPhotoUrl}
            kind="about"
            alt="Felipe Medeiros"
            className="mt-7 h-48 w-48 rounded-full object-cover"
          />
        )}
        <div className="mt-7 max-w-3xl space-y-4 text-base leading-7 text-inverse-muted">
          <p>
            Sou Felipe Medeiros, especialista em vendas, liderança comercial e automação. Minha
            trajetória foi construída atendendo clientes, liderando equipes, gerenciando operações e
            empreendendo.
          </p>
          <p>
            São mais de 17 anos de experiência na área comercial em múltiplos setores: tecnologia,
            consultoria, agências, SaaS e varejo.
          </p>
          <p>
            Hoje, conecto essa experiência à tecnologia para diagnosticar, estruturar e implementar
            operações comerciais mais organizadas e eficientes.
          </p>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden rounded-lg border border-inverse/15 bg-inverse/15 sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map((item, index) => (
            <div key={item} className="bg-primary p-5">
              <span className="text-xs font-bold text-gold">0{index + 1}</span>
              <p className="mt-2 text-sm font-semibold text-inverse">{item}</p>
            </div>
          ))}
        </div>
        <blockquote className="mt-9 max-w-3xl border-l-2 border-gold pl-5 font-serif text-xl italic leading-8 text-gold-light">
          “Muitos entendem de vendas. Outros dominam tecnologia. Meu diferencial é conectar os dois
          lados.”
        </blockquote>
      </Reveal>
    </section>
  );
}

export function DiagnosticCTA() {
  const items = [
    "Entrada dos leads",
    "Tempo de resposta",
    "Registro das informações",
    "Distribuição das oportunidades",
    "Processo de follow-up",
    "Tarefas que podem ser automatizadas",
    "Uso estratégico de inteligência artificial",
  ];
  return (
    <section className="section-space bg-deep text-inverse">
      <Reveal className="container-shell grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <SectionHeading inverse align="left" eyebrow="Diagnóstico Comercial Estratégico">
            Antes de investir em novas ferramentas, descubra onde sua operação está perdendo
            oportunidades.
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-inverse-muted">
            Em uma conversa estratégica de 30 minutos, analisaremos atendimento, processo comercial,
            follow-up, gestão dos leads e oportunidades de automação.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="button-gold">
              <a href="#diagnostico">
                Solicitar meu diagnóstico <ArrowRight />
              </a>
            </Button>
            <WhatsAppLink
              label="Falar com Felipe no WhatsApp pelo diagnóstico"
              className="button-outline-dark"
            >
              <MessageCircle /> Falar com Felipe no WhatsApp
            </WhatsAppLink>
          </div>
          <p className="mt-5 text-sm text-inverse-muted">Atendimento direto com Felipe Medeiros</p>
        </div>
        <div className="diagnostic-list">
          <p className="mb-5 text-xs font-bold uppercase text-gold">Pontos analisados</p>
          {items.map((item) => (
            <div key={item}>
              <Check />
              {item}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="section-space scroll-mt-20 bg-background">
      <Reveal className="container-shell max-w-4xl">
        <SectionHeading eyebrow="Perguntas frequentes">
          Informações para decidir com clareza.
        </SectionHeading>
        <Accordion type="single" collapsible className="faq-list mt-12">
          {faqItems.map(([question, answer], index) => (
            <AccordionItem key={question} value={`item-${index}`}>
              <AccordionTrigger className="py-7 text-left text-base font-bold text-primary hover:no-underline md:text-lg">
                {question}
              </AccordionTrigger>
              <AccordionContent className="max-w-3xl pb-7 text-base leading-7 text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="border-t border-inverse/10 bg-primary py-20 text-inverse md:py-28">
      <Reveal className="container-shell text-center">
        <p className="eyebrow">O próximo passo</p>
        <h2 className="mx-auto max-w-4xl section-title">
          Estratégia comercial para entender o problema. <Emphasis>Tecnologia</Emphasis> para
          implementar a solução.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-inverse-muted">
          Comece por uma análise clara da sua operação, sem adicionar ferramentas antes de entender
          os gargalos.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="button-gold">
            <a href="#diagnostico">
              Solicitar diagnóstico estratégico <ArrowRight />
            </a>
          </Button>
          <WhatsAppLink
            label="Falar com Felipe pelo final da página"
            className="button-outline-dark"
          >
            <MessageCircle /> Falar com Felipe
          </WhatsAppLink>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const settings = useSiteSettings();
  return (
    <footer className="bg-deep py-14 text-inverse">
      <div className="container-shell grid gap-10 border-t border-inverse/15 pt-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xl font-bold">Felipe Medeiros</p>
          <p className="mt-2 text-sm text-inverse-muted">{settings.footerTagline}</p>
          <p className="mt-6 max-w-xl font-serif text-lg italic text-gold-light">
            “Transformando vendas em resultados reais — com estratégia, método e humanidade.”
          </p>
        </div>
        <div>
          <nav
            className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-sm"
            aria-label="Links do rodapé"
          >
            <a href="/produtos-e-servicos" className="footer-link">
              Produtos e serviços
            </a>
            <a
              href={getSafeExternalUrl(settings.linkedinUrl)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("linkedin_click")}
              className="footer-link"
            >
              <Linkedin /> LinkedIn
            </a>
            <a
              href={getWhatsAppUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              WhatsApp
            </a>
            <a href={`mailto:${settings.email}`} className="footer-link">
              <Mail /> {settings.email}
            </a>
            <a href={getSafeExternalUrl(settings.privacyUrl)} className="footer-link">
              Política de Privacidade
            </a>
            <a href={getSafeExternalUrl(settings.termsUrl)} className="footer-link">
              Termos de Uso
            </a>
          </nav>
          <p className="mt-6 text-xs text-inverse-muted md:text-right">
            © 2026 Felipe Medeiros. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
export function FloatingWhatsApp() {
  const settings = useSiteSettings();
  return (
    <a
      href={getWhatsAppUrl(settings)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("cta_whatsapp_click", { label: "floating" })}
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-inverse shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
      aria-label="Falar com Felipe no WhatsApp"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}

function OfferOverview() {
  const offers = [
    [
      "Treinamento de Vendas",
      "Prospecção, diagnóstico online e fechamento para desenvolver a atuação comercial da equipe.",
      "treinamento-de-vendas",
    ],
    [
      "Consultoria de Gestão",
      "Assessment do processo e melhorias com playbooks e ferramentas para organizar a operação.",
      "consultoria-de-gestao",
    ],
    [
      "Mentoria de Gestão",
      "Análise de indicadores e construção de um plano estratégico para gestores e donos de negócios.",
      "mentoria-de-gestao",
    ],
  ] as const;
  return (
    <section id="solucao" className="section-space scroll-mt-24">
      <div className="container-shell">
        <SectionHeading align="left" eyebrow="Produtos e serviços">
          O apoio certo para o momento da sua empresa.
        </SectionHeading>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {offers.map(([name, text, id]) => (
            <article key={id} className="flex flex-col border-t-2 border-gold pt-6">
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mb-5 mt-4 flex-1 leading-7 text-muted-foreground">{text}</p>
              <a
                href={`/produtos-e-servicos#${id}`}
                className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
              >
                Conhecer {name.toLowerCase()}{" "}
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-6 border-t border-border pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-xl font-bold">Implementação de ferramentas</h3>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              DataCrazy, Manychat, GPT Maker e Google Agenda, com escopo alinhado ao seu processo.
              Partner DataCrazy.
            </p>
          </div>
          <Button asChild className="button-gold">
            <a href="/produtos-e-servicos#implementacoes">
              Ver implementações <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AuthorityBar />
        <About />
        <Problems />
        <OfferOverview />
        <ProcessFlow />
        <Methodology />
        <DiagnosticCTA />
        <LeadForm />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  GitBranch,
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
  UsersRound,
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
import { Checkbox } from "@/components/ui/checkbox";
import { trackEvent } from "@/lib/analytics";
import { getSafeExternalUrl, getWhatsAppUrl, submitLead, UTM_KEYS } from "@/lib/site-settings";
import { useSiteSettings } from "@/lib/site-settings-context";

const navItems = [
  ["Solução", "solucao"],
  ["Como funciona", "como-funciona"],
  ["Implantação", "implantacao"],
  ["Sobre", "sobre"],
  ["FAQ", "faq"],
] as const;
const problems = [
  [MessageCircle, "Leads sem resposta"],
  [Clock3, "Follow-ups esquecidos"],
  [GitBranch, "Conversas espalhadas"],
  [UsersRound, "Atendimento sem padrão"],
  [BarChart3, "Falta de indicadores"],
  [CircleAlert, "Pouca visibilidade do funil"],
] as const;
const authorityItems = [
  [Target, "Estratégia comercial"],
  [Database, "CRM e processos"],
  [BrainCircuit, "Inteligência artificial"],
  [Workflow, "Automação e integração"],
] as const;
const solutions = [
  [
    Database,
    "CRM estruturado",
    "Leads, etapas, responsáveis e históricos organizados em uma operação clara.",
  ],
  [
    MessageCircle,
    "Atendimento inteligente",
    "Um processo definido para receber, compreender e direcionar cada contato.",
  ],
  [
    Bot,
    "Agentes de IA",
    "Apoio no primeiro atendimento, na coleta de informações e na qualificação.",
  ],
  [
    Workflow,
    "Automações comerciais",
    "Cadastros, distribuições, tarefas, confirmações, alertas e follow-ups.",
  ],
  [
    BarChart3,
    "Indicadores de gestão",
    "Visibilidade do funil para orientar decisões e corrigir gargalos.",
  ],
  [
    Network,
    "Integrações personalizadas",
    "Conexão entre CRM, WhatsApp, formulários, agendas e sistemas.",
  ],
] as const;
const flowSteps = [
  "Lead recebido",
  "Atendimento",
  "Cadastro",
  "Qualificação",
  "Distribuição",
  "Follow-up",
  "Gestão",
];
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
      <div className="container-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[auto_1fr_auto]">
        <a href="#inicio" className="min-w-0" aria-label="Felipe Medeiros — início">
          <span className="block truncate text-base font-bold text-inverse">Felipe Medeiros</span>
          <span className="block truncate text-[10px] font-semibold uppercase text-inverse-muted">
            Vendas • Estratégia • Automação
          </span>
        </a>
        <nav
          className="hidden items-center justify-center gap-7 lg:flex"
          aria-label="Navegação principal"
        >
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-medium text-inverse-muted transition-colors hover:text-gold-light"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild className="button-gold hidden px-3 min-[360px]:inline-flex sm:px-6">
            <a href="#diagnostico">
              <span className="sm:hidden">Diagnóstico</span>
              <span className="hidden sm:inline">Agendar diagnóstico</span>
              <ArrowRight />
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-inverse/25 bg-transparent text-inverse hover:bg-inverse/10 hover:text-inverse lg:hidden"
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
          className="border-t border-inverse/15 bg-deep px-5 py-4 lg:hidden"
          aria-label="Navegação para celular"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-inverse hover:bg-inverse/10"
              >
                {label}
              </a>
            ))}
            <Button asChild className="button-gold mt-2 min-[360px]:hidden">
              <a href="#diagnostico" onClick={() => setOpen(false)}>
                Agendar diagnóstico <ArrowRight />
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
      <div className="container-shell relative grid items-center gap-12 pb-16 pt-32 lg:min-h-[760px] lg:grid-cols-[1.08fr_.92fr] lg:pb-24 lg:pt-36">
        <div className="relative z-10 max-w-3xl">
          <p className="eyebrow">Estratégia comercial • IA • Automação</p>
          <h1 className="hero-title text-inverse">
            Transforme leads dispersos em uma operação comercial que acompanha, qualifica e avança{" "}
            <Emphasis>cada oportunidade.</Emphasis>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-inverse-muted">
            Eu identifico os gargalos da sua operação e implemento processos, CRM, inteligência
            artificial e automações para sua empresa atender melhor, acompanhar os leads e vender
            com mais controle.
          </p>
          <p className="strategy-statement">
            Estratégia comercial para entender o problema. Tecnologia para implementar a solução.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="button-gold">
              <a href="#diagnostico">
                Agendar diagnóstico estratégico <ArrowRight />
              </a>
            </Button>
            <WhatsAppLink label="Falar com Felipe" className="button-outline-dark">
              <MessageCircle /> Falar com Felipe
            </WhatsAppLink>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm text-inverse-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" /> Conversa estratégica de 30
            minutos • Atendimento direto com Felipe Medeiros
          </p>
        </div>
        <div
          className="hero-portrait"
          aria-label="Visão conceitual de uma operação comercial organizada"
        >
          {settings.heroPhotoUrl ? (
            <img
              src={settings.heroPhotoUrl}
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
            <p className="text-[11px] font-bold uppercase text-gold">Visão da operação</p>
            {["Entrada dos leads", "Qualificação", "Próxima ação"].map((item, index) => (
              <div
                key={item}
                className="mt-3 flex items-center gap-3 border-t border-inverse/15 pt-3"
              >
                <span className="text-sm font-bold text-gold">0{index + 1}</span>
                <span className="text-xs text-inverse">{item}</span>
                <CheckCircle2 className="ml-auto size-4 text-success" />
              </div>
            ))}
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
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(([Icon, text]) => (
            <article key={text} className="pain-item">
              <Icon className="size-5 text-gold" />
              <h3 className="mt-8 text-lg font-semibold text-foreground">{text}</h3>
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
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(([Icon, title, copy], index) => (
            <article key={title} className="solution-card">
              <span className="solution-number">0{index + 1}</span>
              <Icon className="mt-10 size-6 text-gold" />
              <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
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
        <div className="process-line mt-16">
          {flowSteps.map((step, index) => (
            <div key={step} className="process-step">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
              {index < flowSteps.length - 1 && <ChevronRight aria-hidden="true" />}
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
    "17+ anos de experiência prática",
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
          <img
            src={settings.aboutPhotoUrl}
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
            São mais de 17 anos de experiência prática no mercado de alimentação, passando por
            diferentes funções até chegar à gestão e ao empreendedorismo.
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
                Agendar meu diagnóstico <ArrowRight />
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

type FormStatus = "idle" | "loading" | "error";
export function LeadForm() {
  const settings = useSiteSettings();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const begin = () => {
    if (!started) {
      setStarted(true);
      trackEvent("diagnostic_form_start");
    }
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !consent) return;
    setStatus("loading");
    trackEvent("diagnostic_form_submit");
    const data = new FormData(form);
    const query = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    UTM_KEYS.forEach((key) => {
      const value = query.get(key);
      if (value) utm[key] = value.slice(0, 200);
    });
    try {
      await submitLead(
        {
          name: String(data.get("name") ?? "").trim(),
          company: String(data.get("company") ?? "").trim(),
          role: String(data.get("role") ?? "").trim(),
          whatsapp: String(data.get("whatsapp") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          segment: String(data.get("segment") ?? "").trim(),
          monthlyLeads: String(data.get("monthly_leads") ?? "").trim(),
          teamSize: String(data.get("team_size") ?? "").trim(),
          mainChallenge: String(data.get("main_challenge") ?? "").trim(),
          source: "landing-page-implantacao-comercial-4-0",
          pageUrl: window.location.href,
          utm,
        },
        settings.leadWebhookUrl,
      );
      trackEvent("diagnostic_form_success");
      window.location.assign(`/obrigado${query.toString() ? `?${query.toString()}` : ""}`);
    } catch {
      setStatus("error");
      trackEvent("diagnostic_form_error");
    }
  }
  const fieldClass = "form-control";
  return (
    <section id="diagnostico" className="section-space scroll-mt-20 bg-surface">
      <Reveal className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <p className="eyebrow">Solicite uma análise</p>
          <h2 className="section-title text-foreground">Conte um pouco sobre sua operação.</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Essas informações me ajudarão a compreender seu cenário antes da nossa conversa.
          </p>
          <div className="mt-10 space-y-6">
            <div className="flex gap-4">
              <PhoneCall className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-bold text-foreground">Contato direto</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A conversa será conduzida por Felipe Medeiros.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Route className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-bold text-foreground">Diagnóstico antes da ferramenta</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Primeiro entendemos o processo. Depois, definimos a solução.
                </p>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={submit} onFocus={begin} className="diagnostic-form" noValidate={false}>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Nome"
              name="name"
              autoComplete="name"
              maxLength={100}
              className={fieldClass}
            />
            <FormField
              label="Empresa"
              name="company"
              autoComplete="organization"
              maxLength={120}
              className={fieldClass}
            />
            <FormField
              label="Cargo"
              name="role"
              autoComplete="organization-title"
              maxLength={100}
              className={fieldClass}
            />
            <FormField
              label="WhatsApp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              minLength={8}
              maxLength={30}
              className={fieldClass}
            />
            <FormField
              label="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              className={fieldClass}
            />
            <FormField label="Segmento" name="segment" maxLength={120} className={fieldClass} />
            <FormSelect
              label="Volume aproximado de leads"
              name="monthly_leads"
              options={["Até 50", "De 51 a 200", "De 201 a 500", "Mais de 500"]}
              className={fieldClass}
            />
            <FormSelect
              label="Tamanho da equipe"
              name="team_size"
              options={["1 pessoa", "2 a 5 pessoas", "6 a 15 pessoas", "Mais de 15 pessoas"]}
              className={fieldClass}
            />
            <label className="sm:col-span-2">
              <span className="form-label">Principal desafio</span>
              <textarea
                name="main_challenge"
                required
                minLength={10}
                maxLength={1200}
                rows={5}
                className="form-control h-auto resize-y py-3"
              />
            </label>
          </div>
          <div className="mt-5 flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(value) => setConsent(value === true)}
              required
              aria-required="true"
              className="mt-1 size-5"
            />
            <label htmlFor="consent" className="text-xs leading-5 text-muted-foreground">
              Autorizo o contato de Felipe Medeiros e o tratamento das informações fornecidas para
              fins de atendimento e diagnóstico comercial, conforme a{" "}
              <a
                href={getSafeExternalUrl(settings.privacyUrl)}
                className="font-bold text-primary underline underline-offset-2"
              >
                Política de Privacidade
              </a>
              .
            </label>
          </div>
          {status === "error" && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground"
            >
              Não foi possível enviar sua solicitação. Tente novamente ou{" "}
              <a
                href={getWhatsAppUrl(settings)}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary underline"
              >
                fale diretamente comigo pelo WhatsApp
              </a>
              .
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={status === "loading" || !consent}
            className="button-gold mt-6 w-full"
          >
            {status === "loading" ? (
              <>
                <span className="spinner" /> Enviando solicitação…
              </>
            ) : (
              <>
                Solicitar análise da minha operação <Send />
              </>
            )}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
function FormField({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label>
      <span className="form-label">{label}</span>
      <input name={name} required {...props} />
    </label>
  );
}
function FormSelect({
  label,
  name,
  options,
  className,
}: {
  label: string;
  name: string;
  options: string[];
  className: string;
}) {
  return (
    <label>
      <span className="form-label">{label}</span>
      <select name={name} required defaultValue="" className={className}>
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
              Agendar diagnóstico estratégico <ArrowRight />
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

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AuthorityBar />
        <Problems />
        <Manifesto />
        <SolutionCards />
        <ProcessFlow />
        <BeforeAfter />
        <Methodology />
        <Deliverables />
        <Qualification />
        <Technologies />
        <About />
        <DiagnosticCTA />
        <LeadForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

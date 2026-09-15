import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  GitBranch,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Network,
  PhoneCall,
  Route,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trackEvent } from "@/lib/analytics";
import { getSafeExternalUrl, getWhatsAppUrl, SITE_CONFIG, UTM_KEYS } from "@/lib/site-config";

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
  [Layers3, "Conversas espalhadas"],
  [UsersRound, "Atendimento sem padrão"],
  [BarChart3, "Falta de indicadores"],
  [CircleAlert, "Pouca visibilidade das negociações"],
] as const;

const solutions = [
  [Database, "CRM estruturado", "Leads, etapas, responsáveis, tarefas, históricos e oportunidades organizados em uma única operação."],
  [MessageCircle, "Atendimento inteligente", "Um processo claro para receber, compreender e direcionar cada contato corretamente."],
  [Bot, "Agentes de IA", "Primeiro atendimento, respostas iniciais, coleta de informações, qualificação e apoio ao agendamento."],
  [Workflow, "Automações comerciais", "Cadastro de leads, distribuição, criação de tarefas, confirmações, alertas e follow-ups."],
  [BarChart3, "Indicadores de gestão", "Mais visibilidade sobre oportunidades, andamento do funil e pontos de melhoria."],
  [Network, "Integrações personalizadas", "Conexão entre CRM, WhatsApp, formulários, agendas e outras ferramentas da empresa."],
] as const;

const flowSteps = [
  "Lead entra em contato",
  "Atendimento é iniciado",
  "Contato é registrado",
  "Oportunidade é qualificada",
  "Responsável é acionado",
  "Follow-up é acompanhado",
  "Gestor visualiza os resultados",
];

const before = ["Conversas espalhadas", "Leads esquecidos", "Atendimento sem padrão", "Follow-up manual", "Informações dependentes da memória", "Pouca visibilidade das negociações", "Decisões baseadas em percepção"];
const after = ["Contatos centralizados", "Funil comercial definido", "Atendimento organizado", "Histórico acessível", "Tarefas e follow-ups estruturados", "Responsáveis definidos", "Indicadores para orientar decisões"];

const methodology = [
  ["Diagnóstico Comercial 4.0", "Análise do atendimento, dos canais, da jornada do cliente, do processo de vendas, das ferramentas e dos gargalos."],
  ["Desenho da solução", "Definição do fluxo ideal, das etapas do funil, dos responsáveis, das automações e das tecnologias necessárias."],
  ["Implementação", "Configuração do CRM, canais, agentes de IA, automações e integrações previstas no projeto."],
  ["Validação", "Testes práticos dos cadastros, mensagens, distribuições, tarefas e acionamentos."],
  ["Treinamento", "Orientação para que a equipe compreenda o processo e utilize corretamente a estrutura."],
  ["Acompanhamento", "Monitoramento inicial, ajustes críticos e direcionamento dos próximos avanços."],
] as const;

const deliverables = ["Diagnóstico da operação comercial", "Mapeamento da jornada do cliente", "Desenho do fluxo de atendimento", "Estruturação da pipeline", "Configuração do CRM", "Organização inicial dos leads", "Integração do canal de atendimento", "Formulários inteligentes", "Agente de primeiro atendimento", "Qualificação inicial", "Distribuição de oportunidades", "Tarefas comerciais", "Lembretes e follow-ups", "Confirmação de agendamentos", "Indicadores", "Treinamento da equipe", "Manual simplificado", "Suporte inicial"];

const indicated = ["Recebem leads, orçamentos ou solicitações pelo WhatsApp", "Investem em marketing ou prospecção", "Possuem vendedores ou atendentes", "Precisam organizar o processo comercial", "Querem reduzir tarefas repetitivas", "Precisam acompanhar negociações", "Desejam crescer com mais controle"];
const notIdeal = ["A empresa ainda não recebe contatos ou oportunidades", "A busca é apenas pelo chatbot mais barato", "Não existe uma pessoa responsável pelos leads", "Não há disposição para organizar ou ajustar o processo"];

const technologies = ["DataCrazy", "GPT Maker", "n8n", "WhatsApp Cloud API", "Lovable", "Supabase", "Integrações via API"];

const faqItems = [
  ["Preciso substituir todas as ferramentas que já utilizo?", "Não. Primeiro analisamos sua estrutura atual. As ferramentas que continuam fazendo sentido podem ser mantidas e integradas."],
  ["O agente de IA substituirá meus vendedores?", "Não necessariamente. A IA pode assumir tarefas iniciais e repetitivas, enquanto as pessoas continuam responsáveis pelo relacionamento, pela negociação e pelas decisões."],
  ["A solução funciona com WhatsApp?", "Sim. A modalidade de conexão será definida conforme as necessidades, o volume e a realidade da operação."],
  ["A implantação acontece em sete dias?", "A implantação inicial pode ser concluída em até sete dias úteis, dependendo do escopo e da disponibilização dos acessos e informações. Projetos mais complexos recebem um cronograma específico."],
  ["Minha equipe receberá treinamento?", "Sim. A orientação da equipe faz parte da implantação para que os responsáveis compreendam o processo e utilizem corretamente a estrutura."],
  ["Existe acompanhamento depois da entrega?", "Sim. O projeto pode incluir um período inicial de suporte. Acompanhamentos recorrentes podem ser contratados separadamente."],
  ["Quanto custa a implantação?", "O investimento depende da complexidade da operação, das integrações e do escopo. A recomendação e o orçamento são apresentados depois do diagnóstico."],
] as const;

function WhatsAppLink({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <Button asChild size="lg" className={className}>
      <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label={label} onClick={() => trackEvent("cta_whatsapp_click", { label })}>
        {children}
      </a>
    </Button>
  );
}

function SectionHeading({ eyebrow, title, copy, inverse = false }: { eyebrow?: string; title: string; copy?: string; inverse?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`font-display text-3xl font-semibold leading-tight md:text-5xl ${inverse ? "text-inverse" : "text-foreground"}`}>{title}</h2>
      {copy && <p className={`mx-auto mt-5 max-w-2xl text-base leading-7 md:text-lg ${inverse ? "text-inverse-muted" : "text-muted-foreground"}`}>{copy}</p>}
    </div>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[auto_1fr_auto]">
        <a href="#inicio" className="min-w-0" aria-label="Felipe Medeiros — início">
          <span className="block truncate font-display text-base font-semibold text-foreground">Felipe Medeiros</span>
          <span className="block truncate text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Vendas • Automação • Inteligência Artificial</span>
        </a>
        <nav className="hidden items-center justify-center gap-7 lg:flex" aria-label="Navegação principal">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">{label}</a>)}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild className="hidden sm:inline-flex"><a href="#diagnostico">Agendar diagnóstico</a></Button>
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Navegação para celular">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-muted">{label}</a>)}
            <Button asChild className="mt-2 sm:hidden"><a href="#diagnostico" onClick={() => setOpen(false)}>Agendar diagnóstico</a></Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-hero pt-28 md:pt-36">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container-shell relative grid min-h-[calc(100vh-4rem)] items-center gap-14 pb-20 lg:grid-cols-[1.08fr_.92fr] lg:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Estratégia comercial + inteligência artificial</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            Transforme seu WhatsApp em uma operação comercial <span className="text-primary">organizada</span>, <span className="text-primary">inteligente</span> e preparada para <span className="relative whitespace-nowrap text-foreground"><span className="relative z-10">vender mais.</span><span className="absolute inset-x-0 bottom-1 h-2 bg-gold/45" aria-hidden="true" /></span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">Eu identifico os gargalos da sua operação e implemento processos, CRM, inteligência artificial e automações para sua empresa atender melhor, acompanhar cada oportunidade e vender com mais controle.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 px-6"><a href="#diagnostico">Quero diagnosticar minha operação <ArrowRight /></a></Button>
            <WhatsAppLink label="Falar com Felipe no WhatsApp" className="h-13 border border-border bg-background px-6 text-foreground shadow-sm hover:bg-muted"><MessageCircle /> Falar com Felipe no WhatsApp</WhatsAppLink>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" /> Diagnóstico estratégico de 30 minutos • Atendimento direto com Felipe Medeiros</p>
        </div>
        <div className="relative mx-auto w-full max-w-xl" aria-label="Representação conceitual de um painel comercial">
          <div className="panel-shell">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Operação comercial</span><p className="mt-1 font-display font-semibold text-foreground">Fluxo de oportunidades</p></div>
              <span className="status-dot"><span /> Em operação</span>
            </div>
            <div className="grid gap-3 p-4 sm:p-5">
              {["Novo lead recebido", "Atendimento iniciado", "Lead qualificado", "Oportunidade criada", "Follow-up programado"].map((item, index) => (
                <div key={item} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-xs">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">{index + 1}</span>
                  <span className="min-w-0 truncate text-sm font-medium text-foreground">{item}</span>
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                </div>
              ))}
            </div>
            <div className="m-4 mt-0 rounded-xl bg-deep p-5 text-inverse sm:m-5 sm:mt-0">
              <div className="flex items-center justify-between"><span className="text-sm text-inverse-muted">Oportunidades acompanhadas</span><TrendingUp className="size-5 text-gold" /></div>
              <div className="mt-4 flex items-end gap-2" aria-hidden="true">{[38, 58, 46, 76, 61, 88, 100].map((height, i) => <span key={i} className="w-full rounded-sm bg-primary" style={{ height: `${height * .55}px`, opacity: .5 + i * .07 }} />)}</div>
            </div>
          </div>
          <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium shadow-lg md:flex"><Zap className="size-4 text-gold" /> Automação ativa</div>
        </div>
      </div>
    </section>
  );
}

export function AuthorityBar() {
  return <section className="border-y border-border bg-background py-7"><div className="container-shell text-center"><p className="font-display text-sm font-medium text-foreground md:text-base">Estratégia comercial <span className="text-gold">|</span> CRM <span className="text-gold">|</span> Inteligência artificial <span className="text-gold">|</span> Automação <span className="text-gold">|</span> Desenvolvimento low-code</p><p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Partner DataCrazy • Agentes de IA com GPT Maker • Integrações com n8n</p></div></section>;
}

export function Problems() {
  return <section className="section-space bg-background"><Reveal className="container-shell"><SectionHeading eyebrow="O gargalo invisível" title="Sua empresa pode estar gerando oportunidades e perdendo vendas no caminho." copy="O lead entra em contato. Alguém responde quando consegue. As informações ficam espalhadas em conversas, planilhas e anotações. O follow-up depende da memória da equipe. E o gestor termina o mês sem saber quantas oportunidades entraram, onde ficaram paradas e quanto dinheiro foi perdido." /><div className="mx-auto mt-10 max-w-4xl border-l-2 border-primary bg-primary-soft px-6 py-5 text-base font-medium leading-7 text-foreground md:text-lg">O problema nem sempre é a falta de leads. Muitas vezes, é a ausência de um processo capaz de transformar interesse em acompanhamento, relacionamento e venda.</div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{problems.map(([Icon, text]) => <div key={text} className="feature-card flex items-center gap-4"><span className="icon-box"><Icon /></span><h3 className="font-display font-medium text-foreground">{text}</h3></div>)}</div><div className="mt-9 text-center"><Button asChild size="lg"><a href="#diagnostico">Identificar gargalos da minha empresa <ArrowRight /></a></Button></div></Reveal></section>;
}

export function Manifesto() {
  return <section className="section-space bg-deep text-inverse"><Reveal className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow text-gold">Uma visão integrada</p><h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">Tecnologia sem estratégia cria ferramentas. Estratégia com implementação cria resultados.</h2></div><div className="space-y-6 border-l border-inverse/20 pl-6 md:pl-10"><p className="text-lg leading-8 text-inverse-muted">Comprar um CRM não organiza automaticamente uma operação. Contratar um agente de IA não corrige sozinho um processo comercial. E automatizar um processo errado apenas faz o erro acontecer mais rápido.</p><p className="text-lg leading-8 text-inverse-muted">Por isso, meu trabalho não começa escolhendo uma ferramenta. Ele começa entendendo como sua empresa recebe, atende, qualifica, acompanha e converte oportunidades.</p><p className="font-display text-xl font-medium leading-8 text-inverse">Eu não entrego apenas tecnologia. Entrego uma operação comercial estruturada, implementada e preparada para funcionar.</p></div></Reveal></section>;
}

export function SolutionCards() {
  return <section id="solucao" className="section-space scroll-mt-20 bg-surface"><Reveal className="container-shell"><SectionHeading eyebrow="Implantação Comercial 4.0" title="Uma operação conectada do primeiro contato ao fechamento." copy="A Implantação Comercial 4.0 conecta estratégia, pessoas e tecnologia para criar uma jornada comercial mais organizada, eficiente e acompanhável." /><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{solutions.map(([Icon, title, copy], index) => <article key={title} className="feature-card relative overflow-hidden"><span className="absolute right-5 top-4 font-display text-5xl font-semibold text-border">0{index + 1}</span><span className="icon-box"><Icon /></span><h3 className="mt-7 font-display text-xl font-semibold text-foreground">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{copy}</p></article>)}</div></Reveal></section>;
}

export function ProcessFlow() {
  return <section id="como-funciona" className="section-space scroll-mt-20 bg-background"><Reveal className="container-shell"><SectionHeading eyebrow="Fluxo da operação" title="Enquanto sua equipe constrói relacionamento, a tecnologia organiza o processo." /><div className="relative mt-14 grid gap-4 md:grid-cols-4 xl:grid-cols-7">{flowSteps.map((step, index) => <div key={step} className="relative grid grid-cols-[auto_1fr] items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm md:block md:min-h-44 md:text-center"><span className="mx-auto grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">{index + 1}</span><p className="min-w-0 text-sm font-medium leading-5 text-foreground md:mt-6">{step}</p>{index < flowSteps.length - 1 && <ChevronRight className="absolute -right-4 top-5 z-10 hidden size-4 text-primary xl:block" />}</div>)}</div></Reveal></section>;
}

export function BeforeAfter() {
  return <section className="section-space bg-surface"><Reveal className="container-shell"><SectionHeading eyebrow="Clareza operacional" title="O que muda na sua operação." /><div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-background shadow-sm lg:grid-cols-2"><div className="p-7 md:p-10"><span className="label-muted">Antes</span><ul className="mt-6 space-y-4">{before.map((item) => <li key={item} className="flex gap-3 text-muted-foreground"><X className="mt-0.5 size-5 shrink-0 text-warning" />{item}</li>)}</ul></div><div className="border-t border-border bg-primary-soft p-7 md:p-10 lg:border-l lg:border-t-0"><span className="label-primary">Depois</span><ul className="mt-6 space-y-4">{after.map((item) => <li key={item} className="flex gap-3 font-medium text-foreground"><Check className="mt-0.5 size-5 shrink-0 text-primary" />{item}</li>)}</ul></div></div></Reveal></section>;
}

export function Methodology() {
  return <section id="implantacao" className="section-space scroll-mt-20 bg-background"><Reveal className="container-shell"><SectionHeading eyebrow="Metodologia" title="Da análise à operação funcionando." /><div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{methodology.map(([title, copy], index) => <article key={title} className="relative border-t border-border pt-7"><span className="absolute -top-5 left-0 grid size-10 place-items-center rounded-full border-4 border-background bg-deep font-display text-sm font-semibold text-inverse">{index + 1}</span><h3 className="mt-3 font-display text-xl font-semibold text-foreground">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{copy}</p></article>)}</div><div className="mt-14 grid gap-3 rounded-2xl bg-deep p-6 text-inverse md:grid-cols-[auto_1fr] md:items-center md:gap-6 md:p-8"><CalendarCheck className="size-10 text-gold" /><div><p className="font-display text-xl font-semibold">Implantação inicial em até 7 dias úteis.</p><p className="mt-2 text-sm leading-6 text-inverse-muted">O prazo começa após a aprovação do escopo e o recebimento dos acessos e informações necessários. Projetos mais complexos recebem um cronograma específico.</p></div></div></Reveal></section>;
}

export function Deliverables() {
  return <section className="section-space bg-surface"><Reveal className="container-shell"><SectionHeading eyebrow="Escopo personalizado" title="O que pode fazer parte da implantação." /><div className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{deliverables.map((item) => <div key={item} className="flex items-center gap-3 border-b border-border py-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Check className="size-4" /></span><span className="text-sm font-medium text-foreground">{item}</span></div>)}</div><p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-6 text-muted-foreground">O escopo final é definido depois do diagnóstico, evitando a contratação de ferramentas e funcionalidades desnecessárias.</p></Reveal></section>;
}

export function Qualification() {
  return <section className="section-space bg-background"><Reveal className="container-shell"><SectionHeading eyebrow="Encaixe ideal" title="Para empresas que desejam crescer com mais organização e controle." /><div className="mt-12 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-background p-7 shadow-sm md:p-9"><h3 className="font-display text-xl font-semibold text-foreground">Esta solução é indicada para empresas que</h3><ul className="mt-6 space-y-4">{indicated.map((item) => <li key={item} className="flex gap-3 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />{item}</li>)}</ul></div><div className="rounded-2xl border border-border bg-muted p-7 md:p-9"><h3 className="font-display text-xl font-semibold text-foreground">Provavelmente não é o momento ideal se</h3><ul className="mt-6 space-y-4">{notIdeal.map((item) => <li key={item} className="flex gap-3 text-muted-foreground"><CircleAlert className="mt-0.5 size-5 shrink-0 text-muted-foreground" />{item}</li>)}</ul></div></div></Reveal></section>;
}

export function Technologies() {
  return <section className="section-space overflow-hidden bg-deep text-inverse"><Reveal className="container-shell"><SectionHeading inverse eyebrow="Tecnologia sob medida" title="A melhor ferramenta não é a mais famosa. É a que resolve o problema certo." copy="Cada operação possui necessidades diferentes. Por isso, as tecnologias são selecionadas somente depois de compreendermos o processo, o volume de atendimento e os objetivos da empresa." /><div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">{technologies.map((item, index) => <div key={item} className={`flex min-h-24 items-center justify-center rounded-xl border border-inverse/15 bg-inverse/5 px-4 text-center font-display text-sm font-medium text-inverse ${index === technologies.length - 1 ? "col-span-2 md:col-span-1" : ""}`}>{item}</div>)}</div><p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-8 text-inverse-muted">Você não precisa dominar essas tecnologias. Meu papel é entender sua operação, escolher a estrutura adequada e fazer as ferramentas trabalharem juntas.</p></Reveal></section>;
}

export function About() {
  const highlights = [[Target, "Estratégia e diagnóstico comercial"], [BriefcaseBusiness, "CRM e gestão de oportunidades"], [BrainCircuit, "Agentes de inteligência artificial"], [Workflow, "Automações e integrações com n8n"], [UsersRound, "Treinamento de vendas e atendimento"], [GitBranch, "Desenvolvimento de soluções low-code"]] as const;
  return <section id="sobre" className="section-space scroll-mt-20 bg-background"><Reveal className="container-shell grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-photo-placeholder"><div className="absolute inset-6 grid place-items-center rounded-xl border border-dashed border-inverse/35 text-center"><div><UserRound className="mx-auto size-12 text-inverse-muted" /><p className="mt-4 font-display text-lg font-medium text-inverse">Foto profissional<br />de Felipe Medeiros</p><p className="mt-2 text-xs text-inverse-muted">Espaço preparado para a imagem real</p></div></div></div><div><p className="eyebrow">Sobre Felipe</p><h2 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">Experiência comercial para entender o problema. Tecnologia para implementar a solução.</h2><div className="mt-6 space-y-4 leading-7 text-muted-foreground"><p>Sou Felipe Medeiros, especialista em vendas, liderança comercial e automação. Minha trajetória foi construída na prática: atendendo clientes, liderando equipes, desenvolvendo pessoas, gerenciando operações e empreendendo.</p><p>São mais de 17 anos de experiência no mercado de alimentação, passando por diferentes funções até chegar à gestão e ao empreendedorismo. Essa vivência me ensinou que uma empresa não cresce apenas com boas ideias ou ferramentas. Ela cresce quando pessoas, processos e tecnologia trabalham na mesma direção.</p><p>Hoje, aplico essa experiência na estruturação e implementação de operações comerciais mais organizadas, inteligentes e eficientes.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{highlights.map(([Icon, text]) => <div key={text} className="flex items-center gap-3 text-sm font-medium text-foreground"><Icon className="size-4 shrink-0 text-primary" />{text}</div>)}</div><div className="mt-9 border-t border-border pt-6"><p className="font-display text-xl font-semibold text-foreground">Felipe Medeiros</p><p className="mt-1 text-sm text-muted-foreground">Especialista em Vendas, Liderança Comercial e Automação</p></div></div></Reveal></section>;
}

export function Differentials() {
  return <section className="section-space bg-surface"><Reveal className="container-shell grid gap-10 lg:grid-cols-[1fr_1fr]"><div><p className="eyebrow">O diferencial</p><h2 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">Da estratégia à execução, com um único responsável pela transformação.</h2></div><div className="space-y-6 text-lg leading-8 text-muted-foreground"><p>Muitos profissionais entendem de vendas, mas não implementam tecnologia. Outros dominam tecnologia, mas não compreendem atendimento, liderança e processo comercial.</p><p className="font-display text-2xl font-semibold text-primary">Meu diferencial é conectar os dois lados.</p><p>Eu analiso a jornada do cliente, identifico gargalos, estruturo o processo, seleciono as tecnologias e participo diretamente da implementação.</p><p className="border-l-2 border-gold pl-5 font-medium text-foreground">Você não recebe apenas um projeto. Recebe estratégia, implementação, treinamento e acompanhamento.</p></div></Reveal></section>;
}

export function DiagnosticCTA() {
  const items = ["Como os leads chegam", "Quanto tempo levam para receber atendimento", "Onde as informações são registradas", "Como as oportunidades são distribuídas", "Como o follow-up é realizado", "Quais tarefas podem ser automatizadas", "Onde a inteligência artificial pode gerar valor"];
  return <section className="section-space bg-blue-deep text-inverse"><Reveal className="container-shell grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]"><div><p className="eyebrow text-gold">Diagnóstico Comercial Estratégico</p><h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">Antes de investir em novas ferramentas, descubra onde sua operação está perdendo oportunidades.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-inverse-muted">Em uma conversa estratégica de 30 minutos, vamos analisar seu atendimento, seu processo de follow-up, sua organização comercial e as oportunidades de automação.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="h-13 bg-inverse px-6 text-deep hover:bg-inverse/90"><a href="#diagnostico">Agendar meu diagnóstico estratégico <ArrowRight /></a></Button><WhatsAppLink label="Falar com Felipe no WhatsApp pelo destaque principal" className="h-13 border border-inverse/25 bg-transparent px-6 text-inverse hover:bg-inverse/10"><MessageCircle /> Falar com Felipe no WhatsApp</WhatsAppLink></div><p className="mt-4 text-xs text-inverse-muted">Atendimento direto com Felipe Medeiros • Agenda sujeita à capacidade de implantação</p></div><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{items.map((item) => <li key={item} className="flex items-center gap-3 rounded-lg border border-inverse/15 bg-inverse/5 px-4 py-3 text-sm"><Check className="size-4 shrink-0 text-gold" />{item}</li>)}</ul></Reveal></section>;
}

type FormStatus = "idle" | "loading" | "error";

export function LeadForm() {
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
    const payload: Record<string, string> = {
      name: String(data.get("name") ?? "").trim(), company: String(data.get("company") ?? "").trim(), role: String(data.get("role") ?? "").trim(), whatsapp: String(data.get("whatsapp") ?? "").trim(), email: String(data.get("email") ?? "").trim(), segment: String(data.get("segment") ?? "").trim(), monthly_leads: String(data.get("monthly_leads") ?? "").trim(), team_size: String(data.get("team_size") ?? "").trim(), main_challenge: String(data.get("main_challenge") ?? "").trim(), source: "landing-page-implantacao-comercial-4-0", page_url: window.location.href, submitted_at: new Date().toISOString(),
    };
    const query = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach((key) => { const value = query.get(key); if (value) payload[key] = value.slice(0, 200); });
    try {
      const webhook = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined;
      if (webhook) {
        const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("Webhook indisponível");
      } else if (import.meta.env.DEV) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
      } else {
        throw new Error("Webhook não configurado");
      }
      trackEvent("diagnostic_form_success");
      window.location.assign(`/obrigado${query.toString() ? `?${query.toString()}` : ""}`);
    } catch {
      setStatus("error");
      trackEvent("diagnostic_form_error");
    }
  }

  const fieldClass = "mt-2 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
  return <section id="diagnostico" className="section-space scroll-mt-20 bg-background"><Reveal className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Vamos conversar</p><h2 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">Quero analisar minha operação comercial.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Preencha as informações e entrarei em contato para compreender melhor o seu cenário.</p><div className="mt-10 space-y-5"><div className="flex gap-4"><span className="icon-box"><PhoneCall /></span><div><p className="font-medium text-foreground">Contato direto</p><p className="mt-1 text-sm text-muted-foreground">A conversa será conduzida por Felipe Medeiros.</p></div></div><div className="flex gap-4"><span className="icon-box"><Route /></span><div><p className="font-medium text-foreground">Diagnóstico antes da ferramenta</p><p className="mt-1 text-sm text-muted-foreground">Primeiro entendemos o processo. Depois, definimos a solução.</p></div></div></div></div><form onSubmit={submit} onFocus={begin} className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-8" noValidate={false}><div className="grid gap-5 sm:grid-cols-2"><FormField label="Nome" name="name" autoComplete="name" maxLength={100} className={fieldClass} /><FormField label="Empresa" name="company" autoComplete="organization" maxLength={120} className={fieldClass} /><FormField label="Cargo" name="role" autoComplete="organization-title" maxLength={100} className={fieldClass} /><FormField label="WhatsApp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} pattern="[0-9()+.\-\s]{8,30}" className={fieldClass} /><FormField label="E-mail" name="email" type="email" autoComplete="email" maxLength={255} className={fieldClass} /><FormField label="Segmento da empresa" name="segment" maxLength={120} className={fieldClass} /><FormSelect label="Volume aproximado de contatos comerciais por mês" name="monthly_leads" options={["Até 50", "De 51 a 200", "De 201 a 500", "Mais de 500"]} className={fieldClass} /><FormSelect label="Número de pessoas no atendimento ou nas vendas" name="team_size" options={["1 pessoa", "2 a 5 pessoas", "6 a 15 pessoas", "Mais de 15 pessoas"]} className={fieldClass} /><label className="sm:col-span-2"><span className="form-label">Principal desafio da operação</span><textarea name="main_challenge" required minLength={10} maxLength={1200} rows={5} className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label></div><div className="mt-5 flex items-start gap-3"><Checkbox id="consent" checked={consent} onCheckedChange={(value) => setConsent(value === true)} required aria-required="true" className="mt-1 size-5" /><label htmlFor="consent" className="text-xs leading-5 text-muted-foreground">Autorizo o contato de Felipe Medeiros e o tratamento das informações fornecidas para fins de atendimento e diagnóstico comercial, conforme a <a href={getSafeExternalUrl(SITE_CONFIG.privacyUrl)} className="font-medium text-primary underline underline-offset-2">Política de Privacidade</a>.</label></div>{status === "error" && <div role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">Não foi possível enviar sua solicitação. Tente novamente ou <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" className="font-semibold text-primary underline">fale diretamente comigo pelo WhatsApp</a>.</div>}<Button type="submit" size="lg" disabled={status === "loading" || !consent} className="mt-6 h-13 w-full">{status === "loading" ? <><span className="spinner" /> Enviando solicitação…</> : <>Solicitar diagnóstico <Send /></>}</Button></form></Reveal></section>;
}

function FormField({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label><span className="form-label">{label}</span><input name={name} required {...props} /></label>;
}

function FormSelect({ label, name, options, className }: { label: string; name: string; options: string[]; className: string }) {
  return <label><span className="form-label">{label}</span><select name={name} required defaultValue="" className={className}><option value="" disabled>Selecione uma opção</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

export function FAQ() {
  return <section id="faq" className="section-space scroll-mt-20 bg-surface"><Reveal className="container-shell max-w-4xl"><SectionHeading eyebrow="Perguntas frequentes" title="Informações para decidir com clareza." /><Accordion type="single" collapsible className="mt-12 rounded-2xl border border-border bg-background px-5 md:px-8">{faqItems.map(([question, answer], index) => <AccordionItem key={question} value={`item-${index}`}><AccordionTrigger className="py-6 text-left font-display text-base font-semibold text-foreground hover:no-underline md:text-lg">{question}</AccordionTrigger><AccordionContent className="max-w-3xl pb-6 text-base leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal></section>;
}

export function FinalCTA() {
  return <section className="bg-background py-20 md:py-28"><Reveal className="container-shell"><div className="rounded-2xl bg-deep px-6 py-14 text-center text-inverse md:px-12 md:py-20"><Sparkles className="mx-auto size-8 text-gold" /><h2 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-5xl">Sua empresa não precisa de mais uma ferramenta isolada.</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-inverse-muted">Precisa de uma operação na qual atendimento, vendas, CRM, inteligência artificial e automação trabalhem juntos.</p><p className="mt-6 font-display text-xl font-medium text-inverse">O primeiro passo é entender onde as oportunidades estão sendo perdidas.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg" className="h-13 bg-inverse px-6 text-deep hover:bg-inverse/90"><a href="#diagnostico">Agendar diagnóstico estratégico <ArrowRight /></a></Button><WhatsAppLink label="Chamar Felipe no WhatsApp pelo final da página" className="h-13 border border-inverse/25 bg-transparent px-6 text-inverse hover:bg-inverse/10"><MessageCircle /> Chamar Felipe no WhatsApp</WhatsAppLink></div></div></Reveal></section>;
}

export function Footer() {
  return <footer className="border-t border-border bg-background py-10"><div className="container-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="font-display text-xl font-semibold text-foreground">Felipe Medeiros</p><p className="mt-1 text-sm text-muted-foreground">Especialista em Vendas, Liderança Comercial e Automação</p><p className="mt-5 max-w-lg text-sm text-muted-foreground">Transformando vendas em resultados reais — com estratégia, método e humanidade.</p></div><div><nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm" aria-label="Links do rodapé"><a href={getSafeExternalUrl(SITE_CONFIG.linkedinUrl)} target="_blank" rel="noreferrer" onClick={() => trackEvent("linkedin_click")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"><Linkedin className="size-4" /> LinkedIn</a><a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">WhatsApp</a><a href={SITE_CONFIG.email.startsWith("[") ? "#" : `mailto:${SITE_CONFIG.email}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"><Mail className="size-4" /> E-mail</a><a href={getSafeExternalUrl(SITE_CONFIG.privacyUrl)} className="text-muted-foreground hover:text-primary">Política de Privacidade</a><a href={getSafeExternalUrl(SITE_CONFIG.termsUrl)} className="text-muted-foreground hover:text-primary">Termos de Uso</a></nav><p className="mt-5 text-xs text-muted-foreground md:text-right">© 2026 Felipe Medeiros. Todos os direitos reservados.</p></div></div></footer>;
}

export function FloatingWhatsApp() {
  return <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" onClick={() => trackEvent("cta_whatsapp_click", { label: "floating" })} className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-inverse shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring" aria-label="Falar com Felipe no WhatsApp"><MessageCircle className="size-6" /></a>;
}

export function LandingPage() {
  return <><Header /><main><Hero /><AuthorityBar /><Problems /><Manifesto /><SolutionCards /><ProcessFlow /><BeforeAfter /><Methodology /><Deliverables /><Qualification /><Technologies /><About /><Differentials /><DiagnosticCTA /><LeadForm /><FAQ /><FinalCTA /></main><Footer /><FloatingWhatsApp /></>;
}
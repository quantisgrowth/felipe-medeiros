import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Calculator,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";
import type { SiteSettings } from "@/lib/site-settings";

interface DemoProps {
  project: Project;
  settings: SiteSettings;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// 1. CALCULADORA DE VAZAMENTO DE FUNIL COMERCIAL
// ---------------------------------------------------------------------------
export function FunnelCalculator({ settings }: { settings: SiteSettings }) {
  const [leads, setLeads] = useState(120);
  const [ticket, setTicket] = useState(3500);
  const [responseTime, setResponseTime] = useState<"rapido" | "medio" | "lento" | "critico">("medio");
  const [followupStructure, setFollowupStructure] = useState<"sem_cadencia" | "manual" | "crm">("manual");

  // Fatores de perda de conversão
  const responseLossMap = {
    rapido: 0.05, // < 10 min
    medio: 0.2, // 15 a 60 min (-20% das oportunidades)
    lento: 0.45, // 2 a 4h (-45%)
    critico: 0.7, // > 24h (-70%)
  };

  const followupLossMap = {
    sem_cadencia: 0.4, // -40% em propostas enviadas
    manual: 0.22, // -22%
    crm: 0.05, // -5%
  };

  // Cálculo: taxa base de fechamento saudável ~ 12%
  const baseConversion = 0.12;
  const potentialDeals = leads * baseConversion;

  // Demora de atendimento afeta perda de leads iniciais
  const lostLeadsFromDelay = potentialDeals * responseLossMap[responseTime];

  // Falha de follow-up afeta propostas que esfriam
  const remainingDeals = potentialDeals - lostLeadsFromDelay;
  const lostDealsFromFollowup = remainingDeals * followupLossMap[followupStructure];

  const totalLostDealsMonth = Math.max(1, Math.round(lostLeadsFromDelay + lostDealsFromFollowup));
  const monthlyLoss = totalLostDealsMonth * ticket;
  const annualLoss = monthlyLoss * 12;

  // Recuperação imediata estimada ao implantar atendimento imediato + automação
  const recoverableMonthly = Math.round(monthlyLoss * 0.45);

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
  const whatsappMsg = `Olá Felipe, fiz a simulação na Calculadora de Vazamento no seu site: recebo ${leads} leads/mês com ticket de R$ ${ticket.toLocaleString("pt-BR")}. O cálculo apontou perda estimada de R$ ${monthlyLoss.toLocaleString("pt-BR")}/mês. Gostaria de conversar sobre um diagnóstico para estancar essa perda na minha operação.`;

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      {/* Controles da Simulação */}
      <div className="space-y-5 lg:col-span-7 bg-background p-4 sm:p-6 rounded-xl border border-border shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Simulador Financeiro</span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Calcule onde sua operação comercial está perdendo dinheiro
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Ajuste os indicadores da sua empresa para estimar o impacto financeiro da demora de resposta e da ausência de cadência de follow-up.
          </p>
        </div>

        {/* Volume de Leads */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="input-leads" className="font-bold text-foreground">
              Volume mensal de leads recebidos:
            </label>
            <span className="font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded text-xs">
              {leads} leads / mês
            </span>
          </div>
          <input
            id="input-leads"
            type="range"
            min={20}
            max={800}
            step={10}
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="w-full accent-gold cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
            <span>20 leads</span>
            <span>250 leads</span>
            <span>500 leads</span>
            <span>800 leads</span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="input-ticket" className="font-bold text-foreground">
              Ticket médio por venda fechada:
            </label>
            <span className="font-mono font-bold text-foreground">
              R$ {ticket.toLocaleString("pt-BR")}
            </span>
          </div>
          <input
            id="input-ticket"
            type="number"
            min={500}
            step={500}
            value={ticket}
            onChange={(e) => setTicket(Math.max(100, Number(e.target.value)))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-gold"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1500, 3500, 7000, 15000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTicket(val)}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold transition-all ${
                  ticket === val
                    ? "bg-gold text-primary border-gold font-bold"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                R$ {val.toLocaleString("pt-BR")}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo de Primeira Resposta */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">
            Tempo médio de primeiro contato com o lead:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "rapido", label: "< 10 min", sub: "Atendimento imediato" },
              { id: "medio", label: "15 a 60 min", sub: "-20% conversão" },
              { id: "lento", label: "2 a 4 horas", sub: "-45% conversão" },
              { id: "critico", label: "+ de 24 horas", sub: "-70% conversão" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setResponseTime(opt.id as typeof responseTime)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  responseTime === opt.id
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span className="block text-xs font-bold text-foreground">{opt.label}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cadência de Follow-up */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">
            Como é feito o follow-up de orçamentos e propostas?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "sem_cadencia", label: "Sem cadência", sub: "1 tentativa e desiste" },
              { id: "manual", label: "Manual (Planilha)", sub: "Quando o vendedor lembra" },
              { id: "crm", label: "Automatizado no CRM", sub: "Cadência multicanal ativa" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFollowupStructure(opt.id as typeof followupStructure)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  followupStructure === opt.id
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span className="block text-xs font-bold text-foreground">{opt.label}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Painel de Resultados / Diagnóstico Financeiro */}
      <div className="flex flex-col justify-between space-y-4 lg:col-span-5 bg-gradient-to-br from-primary via-primary to-deep text-inverse p-5 sm:p-6 rounded-xl border border-inverse/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-gold-light" />
            <span className="text-xs font-bold uppercase tracking-wider text-gold-light">
              Diagnóstico de Desperdício
            </span>
          </div>

          <div className="mt-4 rounded-xl bg-inverse/5 p-4 border border-inverse/10">
            <span className="text-xs text-inverse-muted block">Perda estimada por mês:</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-gold-light mt-0.5">
              R$ {monthlyLoss.toLocaleString("pt-BR")},00
            </div>
            <span className="text-[11px] text-inverse-muted block mt-1">
              Equivalente a cerca de{" "}
              <strong className="text-inverse">{totalLostDealsMonth} vendas perdidas</strong> todo mês.
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-inverse/5 border border-inverse/10">
              <span className="text-[10px] text-inverse-muted block">Impacto anualizado:</span>
              <span className="text-sm font-bold text-inverse mt-0.5 block">
                R$ {annualLoss.toLocaleString("pt-BR")},00
              </span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 block font-semibold">Potencial recuperável:</span>
              <span className="text-sm font-bold text-emerald-300 mt-0.5 block">
                +R$ {recoverableMonthly.toLocaleString("pt-BR")}/mês
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-inverse/10 pt-4 text-xs text-inverse-muted">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold-light shrink-0 mt-0.5" />
              <span>
                Com <strong>agente de qualificação imediata</strong>, nenhum lead espera mais que 2 minutos para o primeiro contato.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold-light shrink-0 mt-0.5" />
              <span>
                Com <strong>cadência automática de follow-up no CRM</strong>, as propostas são cobradas até receber um sim ou não definitivo.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-inverse/10">
          <Button asChild className="w-full button-gold gap-2 font-bold text-xs py-5">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Estancar vazamento na minha empresa
            </a>
          </Button>
          <span className="text-[10px] text-center text-inverse-muted block mt-2">
            Conversa direta e sigilosa com Felipe Medeiros
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. SIMULADOR DO AGENTE DE QUALIFICAÇÃO SDR (WHATSAPP)
// ---------------------------------------------------------------------------
export function AiSdrSimulator({ settings }: { settings: SiteSettings }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [segment, setSegment] = useState("");
  const [pain, setPain] = useState("");

  function handleReset() {
    setStep(1);
    setSegment("");
    setPain("");
  }

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      {/* Coluna da Esquerda: Explicação da Tecnologia */}
      <div className="space-y-4 lg:col-span-5 bg-background p-5 sm:p-6 rounded-xl border border-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Inteligência Artificial Comercial
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Agente SDR de Qualificação 24/7
          </h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Este agente atende contatos que chegam pelo site, anúncios ou redes sociais. Ele coleta informações
            estratégicas, valida o perfil ideal de cliente (ICP) e só agenda reunião para leads qualificados.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Clock className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Primeiro contato em 15 segundos</h4>
              <p className="text-[11px] text-muted-foreground">Elimina a perda de leads que esfriam esperando atendimento.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Filtro de ICP com regras de negócio</h4>
              <p className="text-[11px] text-muted-foreground">Vendedores só recebem reuniões de quem tem capacidade de compra.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Workflow className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Sincronização com CRM & Notificação</h4>
              <p className="text-[11px] text-muted-foreground">Cria o negócio no DataCrazy/HubSpot e notifica o gestor na hora.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-2">
          <Button asChild className="button-gold gap-2 w-full text-xs font-bold">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                "Olá Felipe, testei o Agente SDR de IA no seu site e gostaria de estruturar um atendimento inteligente como esse na minha empresa.",
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Quero um agente como esse
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-xs text-muted-foreground">
            <RefreshCw className="size-3.5" /> Reiniciar simulação do chat
          </Button>
        </div>
      </div>

      {/* Coluna da Direita: Mockup do Chat do WhatsApp */}
      <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border bg-[#e5ddd5] dark:bg-[#0b141a] overflow-hidden shadow-md">
        {/* Chat Header */}
        <div className="bg-[#075e54] dark:bg-[#202c33] px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">
              <Bot className="size-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">Felipe Medeiros • SDR IA</h4>
              <span className="text-[11px] text-emerald-200 dark:text-emerald-400 flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> online agora
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">Simulador</span>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] sm:min-h-[400px]">
          {/* Mensagem 1 - SDR */}
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="bg-white dark:bg-[#1f2c34] text-foreground p-3 rounded-2xl rounded-tl-none shadow-xs text-xs leading-relaxed">
              Olá! 👋 Sou o assistente de qualificação da equipe do <strong>Felipe Medeiros</strong>.
              <br />
              <br />
              Para te direcionar ao melhor especialista, qual é o segmento principal da sua empresa?
            </div>
          </div>

          {/* Opções de Segmento (Step 1) */}
          {step === 1 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {["Serviços B2B / Consultoria", "Distribuição / Indústria", "Tecnologia / Software", "Outro segmento"].map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSegment(opt);
                      setStep(2);
                    }}
                    className="bg-white dark:bg-[#2a3942] hover:bg-gold/20 hover:border-gold border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all text-left"
                  >
                    {opt}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Resposta do Usuário (Step >= 2) */}
          {step >= 2 && (
            <div className="flex justify-end">
              <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-foreground dark:text-white p-3 rounded-2xl rounded-tr-none shadow-xs text-xs max-w-[85%]">
                Atuamos no segmento de <strong>{segment}</strong>.
              </div>
            </div>
          )}

          {/* Mensagem 2 - SDR */}
          {step >= 2 && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="bg-white dark:bg-[#1f2c34] text-foreground p-3 rounded-2xl rounded-tl-none shadow-xs text-xs leading-relaxed animate-in fade-in">
                Excelente! E hoje, qual é o <strong>principal gargalo</strong> que você quer resolver na sua operação de vendas?
              </div>
            </div>
          )}

          {/* Opções de Gargalo (Step 2) */}
          {step === 2 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {[
                "Demora para responder leads que chegam pelo site",
                "Vendedores não fazem follow-up das propostas",
                "Quero estruturar um CRM confiável com métricas",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setPain(opt);
                    setStep(3);
                  }}
                  className="bg-white dark:bg-[#2a3942] hover:bg-gold/20 hover:border-gold border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Resposta do Usuário (Step >= 3) */}
          {step >= 3 && (
            <div className="flex justify-end">
              <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-foreground dark:text-white p-3 rounded-2xl rounded-tr-none shadow-xs text-xs max-w-[85%]">
                Nosso maior gargalo é: <strong>{pain}</strong>.
              </div>
            </div>
          )}

          {/* Mensagem 3 - Qualificação & Automação de Agendamento */}
          {step >= 3 && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="bg-white dark:bg-[#1f2c34] text-foreground p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs leading-relaxed space-y-2 border-l-4 border-emerald-500 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="size-4" /> PERFIL QUALIFICADO IDENTIFICADO
                </div>
                <p>
                  Perfeito. Essa é exatamente a especialidade da consultoria do <strong>Felipe Medeiros</strong>.
                </p>
                <div className="p-2 rounded bg-muted/70 text-[11px] font-mono space-y-0.5 text-muted-foreground">
                  <div>✓ Negócio criado automaticamente no CRM</div>
                  <div>✓ Tag adicionada: [Lead-Qualificado-SDR]</div>
                  <div>✓ Notificação prioritária enviada à equipe</div>
                </div>
                <p className="font-semibold text-foreground pt-1">
                  Gostaria de agendar 30 minutos de diagnóstico estratégico com o Felipe?
                </p>
                <Button asChild size="sm" className="button-gold w-full mt-2 font-bold text-xs gap-1.5">
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                      `Olá Felipe! Passei pelo fluxo de simulação do Agente SDR: minha empresa é de ${segment} e nosso desafio é "${pain}". Gostaria de agendar o diagnóstico comercial.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Confirmar conversa no WhatsApp <ArrowRight className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. DIAGNÓSTICO DE MATURIDADE COMERCIAL 360°
// ---------------------------------------------------------------------------
export function MaturityAssessment({ settings }: { settings: SiteSettings }) {
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });

  const questions = [
    {
      id: 1,
      title: "Como os contatos e oportunidades são organizados?",
      options: [
        { score: 5, label: "Em cadernos, WhatsApp pessoal ou na cabeça de cada vendedor" },
        { score: 15, label: "Em planilhas compartilhadas que ficam desatualizadas" },
        { score: 25, label: "Em um CRM estruturado onde toda a equipe registra as etapas" },
      ],
    },
    {
      id: 2,
      title: "Qual o tempo médio de primeira resposta para um novo lead?",
      options: [
        { score: 5, label: "Demora várias horas ou dias (quando o vendedor tem tempo)" },
        { score: 15, label: "Entre 30 minutos e 2 horas" },
        { score: 25, label: "Menos de 10 minutos (ou atendimento imediato por automação/IA)" },
      ],
    },
    {
      id: 3,
      title: "Como é a rotina de follow-up de propostas enviadas?",
      options: [
        { score: 5, label: "O vendedor envia o preço e aguarda o cliente responder" },
        { score: 15, label: "Faz 1 ou 2 cobranças manuais se lembrar" },
        { score: 25, label: "Cadência com múltiplos pontos de contato até o sim ou não definitivo" },
      ],
    },
    {
      id: 4,
      title: "Como a liderança acompanha métricas e conversão?",
      options: [
        { score: 5, label: "Por intuição e fechamento de caixa no fim do mês" },
        { score: 15, label: "Planilhas preenchidas semanalmente de forma manual" },
        { score: 25, label: "Dashboards em tempo real com taxas por etapa e por vendedor" },
      ],
    },
  ];

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);

  function getLevel(score: number) {
    if (score <= 35) {
      return {
        level: "Nível 1: Operação Artesanal",
        badge: "text-red-500 bg-red-500/10 border-red-500/30",
        summary:
          "Sua empresa depende excessivamente da memória dos vendedores e de esforço manual. Há um vazamento grave de oportunidades e falta de previsibilidade.",
        priority: "Prioridade: Implantar CRM com funil claro e atendimento rápido a novos leads.",
      };
    }
    if (score <= 65) {
      return {
        level: "Nível 2: Operação em Transição",
        badge: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        summary:
          "Você já tem consciência da importância dos processos e usa algumas ferramentas, mas ainda perde negócios valiosos por falta de cadência de follow-up e automação.",
        priority: "Prioridade: Padronizar playbook de follow-up e integrar WhatsApp ao CRM.",
      };
    }
    if (score <= 85) {
      return {
        level: "Nível 3: Operação Estruturada",
        badge: "text-blue-500 bg-blue-500/10 border-blue-500/30",
        summary:
          "Sua equipe já segue rotinas comerciais organizadas e utiliza CRM com consistência. O próximo passo é inteligência e eficiência máxima com IA.",
        priority: "Prioridade: Adicionar agentes inteligentes de qualificação e métricas avançadas.",
      };
    }
    return {
      level: "Nível 4: Operação Inteligente & Escalável",
      badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      summary:
        "Operação comercial de altíssimo nível, orientada a dados e com automação profunda. Excelente eficiência e baixa perda de funil.",
      priority: "Prioridade: Otimização contínua de CAC e testes de novos canais de aquisição.",
    };
  }

  const result = getLevel(totalScore);
  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      {/* Questionário */}
      <div className="space-y-4 lg:col-span-7 bg-background p-5 sm:p-6 rounded-xl border border-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Diagnóstico Rápido</span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Maturidade Comercial da sua Operação
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione o cenário que melhor reflete a realidade do seu time hoje:
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2 border-b border-border pb-3 last:border-0 last:pb-0">
              <h4 className="text-xs font-bold text-foreground">{q.title}</h4>
              <div className="space-y-1.5">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [q.id]: opt.score })}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-gold bg-gold/10 font-bold text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      <span className="pr-3 leading-snug">{opt.label}</span>
                      <span
                        className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-gold bg-gold text-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <span className="size-1.5 rounded-full bg-primary" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div className="flex flex-col justify-between space-y-4 lg:col-span-5 bg-gradient-to-br from-primary via-primary to-deep text-inverse p-5 sm:p-6 rounded-xl border border-inverse/10 shadow-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-light">Resultado do Assessment</span>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-gold-light">{totalScore}</span>
            <span className="text-xs text-inverse-muted font-semibold">de 100 pontos</span>
          </div>

          <div className="mt-2 w-full h-2 rounded-full bg-inverse/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
              style={{ width: `${totalScore}%` }}
            />
          </div>

          <div className="mt-4">
            <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold border ${result.badge}`}>
              {result.level}
            </span>
            <p className="text-xs text-inverse-muted mt-3 leading-relaxed">{result.summary}</p>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-inverse/5 border border-inverse/10 text-xs">
            <strong className="text-gold-light block font-semibold mb-1">Recomendação Estratégica:</strong>
            <span className="text-inverse">{result.priority}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-inverse/10">
          <Button asChild className="w-full button-gold gap-2 font-bold text-xs py-5">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                `Olá Felipe! Completei o Diagnóstico de Maturidade no seu site com pontuação ${totalScore}/100 (${result.level}). Gostaria de entender quais etapas você sugere para evoluirmos essa operação.`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Discutir plano de evolução com Felipe
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. PREVIEW DE PLAYBOOK / DOCUMENTO PDF
// ---------------------------------------------------------------------------
export function PlaybookPreview({
  project,
  settings,
}: {
  project: Project;
  settings: SiteSettings;
}) {
  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  // Se o projeto tiver uma URL de PDF real carregada
  if (project.fileUrl) {
    return (
      <div className="flex flex-col h-full w-full space-y-4">
        <div className="flex-1 w-full min-h-[460px] rounded-xl overflow-hidden border border-border bg-muted shadow-inner">
          <iframe
            src={`${project.fileUrl}#toolbar=1`}
            title={project.title}
            className="w-full h-full min-h-[460px] border-0"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={project.fileUrl} download target="_blank" rel="noreferrer">
              <Download className="size-4" /> Baixar PDF
            </a>
          </Button>
          <Button asChild className="button-gold gap-2 text-xs font-bold">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                `Olá Felipe, visualizei o material "${project.title}" e gostaria de conversar sobre a aplicação prática na minha equipe.`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Conversar sobre este material
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Se for um item de demonstração sem PDF subido ainda
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      <div className="space-y-4 lg:col-span-7 bg-background p-5 sm:p-6 rounded-xl border border-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Material Estratégico Exclusivo
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">{project.title}</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{project.description}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="text-xs font-bold text-foreground">Conteúdo abordado neste material:</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Matriz de Contato Imediato:</strong> Como estruturar o SLA de 10 minutos para novos contatos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Cadência de 7 Pontos de Contato:</strong> Roteiro alternado entre WhatsApp, e-mail e ligação.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Gatilhos para Reativação:</strong> Scripts prontos para reativar orçamentos parados há mais de 15 dias.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                <strong>Checklist de Transição para o Fechador:</strong> Como o SDR passa a oportunidade limpa para o Closer.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-between space-y-4 lg:col-span-5 bg-gradient-to-br from-primary via-primary to-deep text-inverse p-5 sm:p-6 rounded-xl border border-inverse/10 shadow-lg">
        <div className="text-center py-4">
          <FileText className="size-16 text-gold-light mx-auto" />
          <h4 className="text-base font-bold text-inverse mt-3">Receba o documento completo</h4>
          <p className="text-xs text-inverse-muted mt-1 max-w-xs mx-auto">
            Este playbook faz parte dos materiais aplicados na consultoria comercial do Felipe Medeiros.
          </p>
        </div>

        <div className="pt-4 border-t border-inverse/10">
          <Button asChild className="w-full button-gold gap-2 font-bold text-xs py-5">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                `Olá Felipe! Gostaria de receber o PDF completo do "${project.title}".`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Solicitar PDF no WhatsApp
            </a>
          </Button>
          <span className="text-[10px] text-center text-inverse-muted block mt-2">
            Disponibilizado sem custos para gestores comerciais
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. PREVIEW DE ARQUITETURA DE AUTOMAÇÃO (DATACRAZY + N8N)
// ---------------------------------------------------------------------------
export function PipelineArchitectureView({ settings }: { settings: SiteSettings }) {
  const cleanWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 h-full">
      <div className="space-y-4 lg:col-span-7 bg-background p-5 sm:p-6 rounded-xl border border-border">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Arquitetura Operacional
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
            Esteira Automatizada de Vendas B2B
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Fluxo inteligente de captação, enriquecimento de dados, distribuição de oportunidades e acompanhamento
            automatizado no CRM.
          </p>
        </div>

        {/* Steps Diagram */}
        <div className="space-y-3 pt-2">
          {[
            {
              step: "01",
              title: "Captação & Webhook",
              desc: "Lead preenche o formulário ou envia mensagem no WhatsApp. Dados com UTMs são disparados instantaneamente.",
            },
            {
              step: "02",
              title: "Tratamento & Roteamento (n8n)",
              desc: "Higienização de telefone, validação de e-mail corporativo e verificação se o contato já existe no banco.",
            },
            {
              step: "03",
              title: "Criação no CRM DataCrazy",
              desc: "Criação do negócio no funil correspondente com responsável definido por regras de round-robin ou segmento.",
            },
            {
              step: "04",
              title: "Alerta Instantâneo & Cadência",
              desc: "Notificação no WhatsApp/Slack do vendedor e ativação automática da cadência de boas-vindas.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
              <span className="size-7 rounded-md bg-gold/15 text-gold font-bold text-xs flex items-center justify-center shrink-0">
                {item.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between space-y-4 lg:col-span-5 bg-gradient-to-br from-primary via-primary to-deep text-inverse p-5 sm:p-6 rounded-xl border border-inverse/10 shadow-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-light">Benefícios Diretos</span>
          <h4 className="text-base sm:text-lg font-bold text-inverse mt-1">Zero leads perdidos por falha humana</h4>
          <p className="text-xs text-inverse-muted mt-2 leading-relaxed">
            Elimina o tempo gasto copiando e colando dados de planilhas para o CRM e garante que todo novo contato
            receba atenção imediata da equipe comercial.
          </p>

          <div className="mt-4 space-y-2 text-xs text-inverse-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Tempo de implantação: 5 a 10 dias úteis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Compatível com WhatsApp API oficial e Webhooks</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-inverse/10">
          <Button asChild className="w-full button-gold gap-2 font-bold text-xs py-5">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                "Olá Felipe! Gostaria de entender como implantar uma esteira de automação com DataCrazy/n8n na minha empresa.",
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" /> Conversar sobre implantação
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. RENDERIZADOR RESPONSIVO PRINCIPAL DO PROJETO
// ---------------------------------------------------------------------------
export function ProjectContentRenderer({ project, settings, onClose }: DemoProps) {
  // Se for um arquivo HTML carregado ou link externo com URL válida
  if (project.contentType === "html" && project.fileUrl && !project.fileUrl.includes("projetos-showcase.html")) {
    return (
      <div className="flex-1 w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-border bg-white shadow-inner">
        <iframe
          src={project.fileUrl}
          title={project.title}
          className="w-full h-full min-h-[480px] border-0"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />
      </div>
    );
  }

  // Renderizadores dedicados para as ferramentas interativas
  if (project.id === "calc-vazamento" || project.slug.includes("calculadora")) {
    return <FunnelCalculator settings={settings} />;
  }

  if (project.id === "agente-sdr-ia" || project.slug.includes("sdr") || project.category === "ia") {
    return <AiSdrSimulator settings={settings} />;
  }

  if (project.id === "matriz-maturidade" || project.slug.includes("maturidade")) {
    return <MaturityAssessment settings={settings} />;
  }

  if (project.id === "pipeline-datacrazy" || project.id === "lp-alta-conversao" || project.category === "crm") {
    return <PipelineArchitectureView settings={settings} />;
  }

  if (project.contentType === "pdf" || project.category === "playbook") {
    return <PlaybookPreview project={project} settings={settings} />;
  }

  // Fallback padrão para qualquer outro projeto ou material
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
      <FileText className="size-16 text-gold" />
      <h3 className="text-xl font-bold text-foreground mt-4">{project.title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mt-2">{project.description}</p>
      <div className="mt-6 flex gap-3">
        {project.fileUrl && (
          <Button asChild variant="outline">
            <a href={project.fileUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Abrir Arquivo
            </a>
          </Button>
        )}
        <Button asChild className="button-gold">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Olá Felipe, estou visualizando o projeto "${project.title}" no seu site e gostaria de saber mais.`,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4" /> Falar com Felipe no WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}


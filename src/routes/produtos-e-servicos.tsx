import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Header, Footer } from "@/components/landing-page";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { getWhatsAppUrl } from "@/lib/site-settings";
import { trackEvent } from "@/lib/analytics";

const title = "Treinamento de Vendas, Consultoria e Automação | Felipe Medeiros";
const description =
  "Treinamento de vendas, consultoria e mentoria de gestão. Implementação de DataCrazy, Manychat, GPT Maker e Google Agenda com Felipe Medeiros, partner DataCrazy.";
const canonical = "https://felipe-medeiros.lovable.app/produtos-e-servicos";

export const Route = createFileRoute("/produtos-e-servicos")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: ProductsAndServices,
});

const products = [
  {
    id: "treinamento-de-vendas",
    number: "01",
    name: "Treinamento de Vendas",
    goal: "Desenvolva a equipe para conduzir cada etapa da venda.",
    audience: "Para equipes e profissionais que precisam aprimorar sua abordagem comercial.",
    text: "Treinamento voltado à prática, da abertura de uma oportunidade à condução do fechamento.",
    items: [
      ["Prospecção", "Abordagem e abertura de conversas com potenciais clientes."],
      [
        "Diagnóstico online",
        "Perguntas e condução de reuniões para compreender necessidades e oportunidades.",
      ],
      [
        "Fechamento de vendas",
        "Tratamento de objeções, negociação e definição dos próximos passos.",
      ],
    ],
    cta: "Conversar sobre treinamento",
  },
  {
    id: "consultoria-de-gestao",
    number: "02",
    name: "Consultoria de Gestão",
    goal: "Transforme o processo comercial em uma rotina mais estruturada.",
    audience: "Para empresas que precisam identificar gargalos e melhorar a operação.",
    text: "Avalio o processo atual e ajudo a construir melhorias com playbooks e ferramentas adequadas à realidade do negócio.",
    items: [
      [
        "Assessment do processo",
        "Análise de como a operação funciona e de onde estão os pontos de melhoria.",
      ],
      ["Playbooks", "Orientações para padronizar abordagens, etapas e responsabilidades."],
      ["Ferramentas de gestão", "Apoio na escolha e no uso de recursos que sustentem o processo."],
    ],
    cta: "Conversar sobre consultoria",
  },
  {
    id: "mentoria-de-gestao",
    number: "03",
    name: "Mentoria de Gestão",
    goal: "Tenha mais clareza para decidir e direcionar o negócio.",
    audience: "Para gestores e donos de negócios que buscam uma visão estratégica da operação.",
    text: "Analisamos os indicadores e construímos um plano estratégico conectado aos desafios e objetivos da empresa.",
    items: [
      [
        "Análise de indicadores",
        "Leitura dos números para entender o cenário e os desafios da gestão.",
      ],
      [
        "Prioridades de gestão",
        "Identificação dos pontos que precisam de atenção e direcionamento.",
      ],
      [
        "Plano estratégico",
        "Construção de objetivos, ações e próximos passos para orientar as decisões.",
      ],
    ],
    cta: "Conversar sobre mentoria",
  },
];
const services = [
  {
    name: "DataCrazy",
    tag: "Partner DataCrazy",
    text: "Implementação do CRM para organizar contatos, funil, etapas e rotina comercial conforme o processo da empresa.",
  },
  {
    name: "Manychat",
    tag: "Automação de conversas",
    text: "Implementação de fluxos de conversa e automações para apoiar o atendimento e o relacionamento nos canais definidos no projeto.",
  },
  {
    name: "GPT Maker",
    tag: "Agentes de IA",
    text: "Implementação de agentes de inteligência artificial com orientações e fluxos alinhados às necessidades do atendimento.",
  },
  {
    name: "Google Agenda",
    tag: "Organização de agendamentos",
    text: "Configuração de agendas e fluxos de agendamento para organizar compromissos e a rotina de atendimento.",
  },
];

function ProductsAndServices() {
  const settings = useSiteSettings();
  function contactUrl(subject: string) {
    const url = new URL(getWhatsAppUrl(settings));
    url.searchParams.set("text", `Olá, Felipe. Gostaria de conversar sobre ${subject}.`);
    return url.href;
  }
  function contact(subject: string, label: string, outline = false) {
    return (
      <Button asChild size="lg" className={outline ? "button-outline-dark" : "button-gold"}>
        <a
          href={contactUrl(subject)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("cta_whatsapp_click", { subject })}
        >
          {label}
          <ArrowRight aria-hidden="true" />
        </a>
      </Button>
    );
  }
  return (
    <>
      <Header />
      <main id="inicio">
        <section className="bg-deep pb-16 pt-32 text-inverse sm:pb-20 sm:pt-40">
          <div className="container-shell">
            <nav
              aria-label="Caminho da página"
              className="mb-10 flex flex-wrap gap-2 text-sm text-inverse-muted"
            >
              <a href="/" className="underline underline-offset-4">
                Início
              </a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Produtos e serviços</span>
            </nav>
            <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_.7fr]">
              <div>
                <p className="eyebrow">Produtos e serviços</p>
                <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Pessoas preparadas.
                  <br />
                  Gestão com direção.
                  <br />
                  <em className="editorial-emphasis">Tecnologia em ação.</em>
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-inverse-muted">
                  Treinamento de vendas, consultoria e mentoria de gestão, com serviços de
                  implementação para colocar a estratégia em prática.
                </p>
              </div>
              <aside className="border-l-2 border-gold pl-6">
                <p className="text-sm font-bold uppercase tracking-wider text-gold-light">
                  Felipe Medeiros
                </p>
                <p className="mt-3 leading-7 text-inverse-muted">
                  Da conversa comercial à organização da operação, escolha o apoio que faz sentido
                  para o seu momento.
                </p>
                <p className="mt-5 text-sm font-bold text-inverse">Partner DataCrazy</p>
              </aside>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild size="lg" className="button-gold">
                <a href="#produtos">
                  Conhecer os produtos
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" className="button-outline-dark">
                <a href="#implementacoes">Ver implementações</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="produtos" className="section-space scroll-mt-24">
          <div className="container-shell">
            <p className="eyebrow">Desenvolvimento e gestão</p>
            <h2 className="section-title max-w-2xl">
              Três formas de evoluir sua operação comercial.
            </h2>
            <p className="mt-6 max-w-2xl leading-7 text-muted-foreground">
              Desenvolva habilidades, estruture processos ou ganhe direção estratégica. Cada produto
              atende a uma necessidade diferente.
            </p>
            <div className="mt-12 divide-y divide-border border-y border-border">
              {products.map((product) => (
                <article
                  id={product.id}
                  key={product.id}
                  className="grid scroll-mt-24 gap-8 py-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20"
                >
                  <div>
                    <p className="mb-4 font-serif text-2xl italic text-gold">{product.number}</p>
                    <h3 className="text-2xl font-bold sm:text-3xl">{product.name}</h3>
                    <p className="mt-4 text-xl leading-8">{product.goal}</p>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {product.audience}
                    </p>
                  </div>
                  <div>
                    <p className="leading-7 text-muted-foreground">{product.text}</p>
                    <ul className="my-7 space-y-5">
                      {product.items.map(([name, text]) => (
                        <li key={name} className="flex gap-3">
                          <Check className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
                          <div>
                            <p className="font-bold">{name}</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {contact(product.name, product.cta)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="implementacoes" className="section-space scroll-mt-24 bg-surface">
          <div className="container-shell">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
              <div>
                <p className="eyebrow">Serviços de implementação</p>
                <h2 className="section-title">
                  As ferramentas certas, conectadas ao seu processo.
                </h2>
              </div>
              <p className="self-end leading-7 text-muted-foreground">
                Implemento as soluções conforme a necessidade do projeto. Escopo, canais,
                integrações e recursos são definidos depois de entendermos sua operação.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.name}
                  className="flex flex-col border border-border bg-background p-6 sm:p-8"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {service.tag}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold">{service.name}</h3>
                  <p className="mb-7 mt-4 flex-1 leading-7 text-muted-foreground">{service.text}</p>
                  <a
                    className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
                    href={contactUrl(`implementação de ${service.name}`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("cta_whatsapp_click", { subject: service.name })}
                  >
                    Conversar sobre {service.name}
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground">
              A contratação do serviço de implementação e as eventuais licenças das plataformas são
              tratadas na proposta, com clareza sobre o que está incluído.
            </p>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow">Por onde começar</p>
              <h2 className="section-title">O seu momento orienta a escolha.</h2>
            </div>
            <dl className="divide-y divide-border">
              {[
                [
                  "Minha equipe precisa vender melhor.",
                  "Comece pelo Treinamento de Vendas.",
                  "treinamento-de-vendas",
                ],
                [
                  "Preciso organizar o processo e as ferramentas.",
                  "Conheça a Consultoria de Gestão.",
                  "consultoria-de-gestao",
                ],
                [
                  "Preciso analisar os números e definir um rumo.",
                  "Conheça a Mentoria de Gestão.",
                  "mentoria-de-gestao",
                ],
                [
                  "Já sei qual plataforma quero implementar.",
                  "Veja os serviços de implementação.",
                  "implementacoes",
                ],
              ].map(([question, answer, id]) => (
                <div key={id} className="py-6 first:pt-0">
                  <dt className="font-bold">{question}</dt>
                  <dd className="mt-2">
                    <a
                      className="inline-flex min-h-11 items-center gap-2 text-muted-foreground underline underline-offset-4"
                      href={`#${id}`}
                    >
                      {answer}
                      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section-space bg-deep text-inverse">
          <div className="container-shell max-w-4xl text-center">
            <p className="eyebrow">Vamos conversar</p>
            <h2 className="section-title">Qual é o próximo passo para o seu negócio?</h2>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-inverse-muted">
              Conte seu cenário e o que você precisa melhorar. A partir dessa conversa, alinhamos o
              produto ou serviço, o formato e o escopo da proposta.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {contact("os produtos e serviços para minha empresa", "Falar com Felipe")}
              <Button asChild size="lg" className="button-outline-dark">
                <a href="/#diagnostico">
                  Solicitar diagnóstico
                  <MessageCircle aria-hidden="true" />
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-inverse-muted">
              Atendimento direto com Felipe Medeiros.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

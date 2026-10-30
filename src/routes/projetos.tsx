import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Calculator,
  Check,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Layers,
  MessageCircle,
  Play,
  Search,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { Header, Footer, FloatingWhatsApp } from "@/components/landing-page";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-settings-context";
import { getWhatsAppUrl } from "@/lib/site-settings";
import { trackEvent } from "@/lib/analytics";
import { ProjectContentRenderer } from "@/components/project-demos";
import {
  DEFAULT_PROJECTS,
  fetchProjects,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";

const title = "Projetos, Ferramentas com IA e Diagnósticos | Felipe Medeiros";
const description =
  "Explore ferramentas interativas, diagnósticos comerciais, agentes de IA e materiais práticos desenvolvidos por Felipe Medeiros para operações de vendas.";
const canonical = "https://felipe-medeiros.lovable.app/projetos";

export const Route = createFileRoute("/projetos")({
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
  component: ProjectsPage,
});

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "ia", label: "Agentes & IA" },
  { id: "diagnostico", label: "Diagnósticos & Calculadoras" },
  { id: "playbook", label: "Playbooks & Guias" },
  { id: "crm", label: "CRM & Automação" },
  { id: "web", label: "Web & LPs" },
];

export function ProjectsPage() {
  const settings = useSiteSettings();
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ProjectCategory>("todos");
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Carrega projetos do Supabase com fallback seguro
  useEffect(() => {
    fetchProjects().then((items) => {
      setProjects(items);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchCategory = category === "todos" || p.category === category;
    const matchSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  function getCategoryBadge(cat: Project["category"]) {
    switch (cat) {
      case "ia":
        return { label: "Agente de IA", icon: Bot, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "diagnostico":
        return { label: "Diagnóstico", icon: Calculator, color: "text-[#dfb743] bg-[#c59b27]/15 border-[#c59b27]/30" };
      case "playbook":
        return { label: "PDF / Guia", icon: FileText, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
      case "crm":
        return { label: "Automação CRM", icon: Workflow, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      default:
        return { label: "Projeto", icon: Layers, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero da Página de Projetos */}
        <section className="relative overflow-hidden bg-deep pb-16 pt-24 text-inverse sm:pt-32">
          <div className="editorial-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
          <div className="container-shell relative z-10">
            <span className="eyebrow block">Showcase & Aplicações Práticas</span>
            <h1 className="page-title text-inverse">
              Projetos, ferramentas de IA e{" "}
              <em className="editorial-emphasis font-serif">diagnósticos comerciais.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-inverse-muted sm:text-lg sm:leading-8">
              Explore ferramentas interativas, PDFs de diagnósticos estratégicos e esteiras de automação
              desenvolvidas para acelerar vendas e organizar operações comerciais.
            </p>

            {/* Barra de Filtros e Busca */}
            <div className="mt-10 flex flex-col gap-4 border-t border-inverse/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Categorias */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const isActive = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCategory(c.id);
                        trackEvent("cta_whatsapp_click", { action: "filter_project", category: c.id });
                      }}
                      className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                        isActive
                          ? "bg-gold text-primary shadow-xs"
                          : "bg-inverse/10 text-inverse-muted hover:bg-inverse/15 hover:text-inverse"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Input de Busca */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-inverse-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por ferramenta ou tag..."
                  className="h-10 w-full rounded-lg border border-inverse/20 bg-inverse/5 pl-9 pr-3 text-xs text-inverse placeholder-inverse-muted outline-none transition-colors focus:border-gold"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Projetos */}
        <section className="section-space bg-surface">
          <div className="container-shell">
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-12 text-center">
                <p className="text-lg font-bold text-foreground">Nenhum projeto encontrado</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tente alterar os filtros ou o termo de busca.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategory("todos");
                    setSearch("");
                  }}
                  className="mt-6"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const badge = getCategoryBadge(project.category);
                  const Icon = badge.icon;
                  const isPdf = project.contentType === "pdf";

                  return (
                    <article
                      key={project.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xs transition-all hover:shadow-md"
                    >
                      {/* Top Banner / Cover */}
                      <div className="relative flex h-44 flex-col justify-between overflow-hidden bg-gradient-to-br from-deep via-primary to-primary p-5 text-inverse">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${badge.color}`}
                          >
                            <Icon className="size-3.5" />
                            {badge.label}
                          </span>
                          {project.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-light">
                              <Sparkles className="size-3.5" /> Destaque
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-inverse-muted">
                            {isPdf ? "Documento Estratégico" : "Ferramenta Interativa"}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-inverse">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {project.description}
                          </p>

                          {/* Tags */}
                          {project.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Action Buttons */}
                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                          <Button
                            onClick={() => {
                              setActiveProject(project);
                              trackEvent("cta_whatsapp_click", {
                                action: "open_project_demo",
                                title: project.title,
                              });
                            }}
                            className="button-gold flex-1 gap-2 text-xs font-bold"
                          >
                            {isPdf ? (
                              <>
                                <Eye className="size-4" /> Ver / Baixar PDF
                              </>
                            ) : (
                              <>
                                <Play className="size-4" /> Testar Ferramenta
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Modal Responsivo de Visualização do Projeto (PC e Mobile) */}
        {activeProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveProject(null)}
          >
            <div
              className="relative flex flex-col w-full h-full sm:h-[90vh] sm:max-h-[920px] sm:max-w-6xl rounded-none sm:rounded-2xl bg-background border-0 sm:border sm:border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-inverse/10 bg-primary px-4 sm:px-6 py-3.5 text-inverse shrink-0">
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                      {activeProject.contentType === "pdf" ? "Material em PDF" : "Demonstração Interativa"}
                    </span>
                    {activeProject.isFeatured && (
                      <span className="text-[10px] font-bold text-gold-light/90 hidden sm:inline-flex items-center gap-1">
                        • Destaque
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold truncate text-inverse">
                    {activeProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(activeProject.fileUrl || activeProject.externalUrl) && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-inverse-muted hover:text-inverse hover:bg-inverse/10 text-xs hidden sm:inline-flex gap-1.5"
                    >
                      <a
                        href={activeProject.fileUrl || activeProject.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3.5" /> Abrir em nova aba
                      </a>
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    className="rounded-lg p-1.5 text-inverse-muted transition-colors hover:bg-inverse/10 hover:text-inverse cursor-pointer"
                    aria-label="Fechar"
                  >
                    <X className="size-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Adaptável a PC e Mobile, sem aspecto quadrado fixo */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-4 sm:p-6 flex flex-col">
                <ProjectContentRenderer
                  project={activeProject}
                  settings={settings}
                  onClose={() => setActiveProject(null)}
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 border-t border-border bg-background px-4 sm:px-6 py-3 shrink-0">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  Quer estruturar uma solução personalizada como essa na sua empresa?
                </p>
                <Button asChild size="sm" className="button-gold shrink-0 text-xs font-bold gap-1.5">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá Felipe, estive olhando o projeto "${activeProject.title}" e gostaria de conversar.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-3.5" /> Conversar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CTA Final */}
        <section className="border-t border-inverse/10 bg-deep py-20 text-inverse">
          <div className="container-shell max-w-4xl text-center">
            <span className="eyebrow block">Próximo Passo</span>
            <h2 className="section-title text-inverse">
              Tem uma necessidade específica ou ideia de projeto?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-inverse-muted sm:text-lg">
              Desenvolvo diagnósticos personalizados, agentes de IA com regras de negócio e esteiras
              de automação desenhadas para a realidade da sua equipe comercial.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="button-gold">
                <a href="/#diagnostico">
                  Solicitar diagnóstico estratégico <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="button-outline-dark">
                <a
                  href={getWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("cta_whatsapp_click", { label: "projects_page_bottom" })}
                >
                  <MessageCircle className="size-4" /> Falar com Felipe no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}


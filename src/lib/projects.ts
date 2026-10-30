import { getPublicSupabaseClient, getSupabaseClient } from "./supabase";

export type ProjectCategory =
  | "todos"
  | "ia"
  | "diagnostico"
  | "playbook"
  | "crm"
  | "web"
  | "outro";

export type ProjectContentType = "pdf" | "html" | "link";

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "ia" | "diagnostico" | "playbook" | "crm" | "web" | "outro";
  contentType: ProjectContentType;
  fileUrl: string;
  externalUrl?: string;
  coverUrl?: string;
  tags: string[];
  isFeatured?: boolean;
  orderIndex?: number;
  createdAt?: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  content_type: string;
  file_url: string;
  external_url: string;
  cover_url: string;
  tags: string[];
  is_featured: boolean;
  order_index: number;
  created_at: string;
};

// Materiais e projetos padrão (caso o banco ainda não possua registros cadastrados)
export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "calc-vazamento",
    title: "Calculadora de Vazamento de Funil Comercial",
    slug: "calculadora-vazamento-funil",
    description:
      "Simulador interativo de perdas de vendas causadas por demora no primeiro atendimento e falhas no follow-up.",
    category: "diagnostico",
    contentType: "html",
    fileUrl: "",
    tags: ["Simulação", "Tempo Real", "Diagnóstico Financeiro"],
    isFeatured: true,
  },
  {
    id: "agente-sdr-ia",
    title: "Agente de Qualificação Comercial SDR (WhatsApp)",
    slug: "agente-qualificacao-sdr",
    description:
      "Estrutura de agente inteligente para atendimento inicial, coleta de faturamento e roteamento de oportunidades.",
    category: "ia",
    contentType: "html",
    fileUrl: "",
    tags: ["GPT Maker", "WhatsApp API", "n8n"],
    isFeatured: true,
  },
  {
    id: "playbook-comercial-pdf",
    title: "Playbook de Atendimento e Follow-up Estruturado",
    slug: "playbook-atendimento-comercial",
    description:
      "Roteiro prático para equipes comerciais conduzirem abordagens, tratativas de objeções e acompanhamento de propostas sem perder negócios.",
    category: "playbook",
    contentType: "pdf",
    fileUrl: "",
    tags: ["Playbook", "Vendas B2B", "Follow-up"],
    isFeatured: true,
  },
  {
    id: "matriz-maturidade",
    title: "Diagnóstico de Maturidade Comercial 360°",
    slug: "diagnostico-maturidade-comercial",
    description:
      "Questionário que classifica a operação comercial entre os 4 níveis de maturidade (do artesanal ao inteligente).",
    category: "diagnostico",
    contentType: "html",
    fileUrl: "",
    tags: ["Assessment", "Processos", "Gestão"],
    isFeatured: false,
  },
  {
    id: "pipeline-datacrazy",
    title: "Esteira de Automação DataCrazy + n8n",
    slug: "pipeline-datacrazy-n8n",
    description:
      "Fluxo operacional de captura de contatos, criação de negócios no CRM e notificação instantânea para os vendedores.",
    category: "crm",
    contentType: "html",
    fileUrl: "",
    tags: ["DataCrazy", "n8n", "Webhooks"],
    isFeatured: false,
  },
  {
    id: "lp-alta-conversao",
    title: "Estrutura de Landing Page para Captação B2B",
    slug: "landing-page-alta-conversao",
    description:
      "Arquitetura de página de captura de alta performance com formulário qualificado, rastreamento de UTMs e disparo para CRM.",
    category: "web",
    contentType: "html",
    fileUrl: "",
    tags: ["Vite / React", "Tailwind CSS", "Supabase"],
    isFeatured: false,
  },
];

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    category: (row.category as Project["category"]) || "diagnostico",
    contentType: (row.content_type as ProjectContentType) || "pdf",
    fileUrl: row.file_url || "",
    externalUrl: row.external_url || "",
    coverUrl: row.cover_url || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    isFeatured: Boolean(row.is_featured),
    orderIndex: row.order_index ?? 0,
    createdAt: row.created_at,
  };
}

/**
 * Busca todos os projetos no Supabase.
 * Nunca lança erro — se a tabela ainda não existir ou a rede falhar,
 * retorna a lista padrão de projetos para o site nunca ficar quebrado.
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = getPublicSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return data.map((item) => rowToProject(item as ProjectRow));
  } catch {
    return DEFAULT_PROJECTS;
  }
}

/**
 * Envia um arquivo PDF ou HTML para o Supabase Storage.
 * Tenta primeiro o bucket 'project-files', e faz fallback transparente para 'site-photos'
 * caso o bucket ainda não tenha sido criado manualmente no dashboard.
 */
export async function uploadProjectFile(
  file: File,
  prefix = "materials",
): Promise<{ url: string; error?: string }> {
  const supabase = getSupabaseClient();
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 40);
  const path = `${prefix}/${Date.now()}-${safeName}.${fileExt}`;

  // Tenta bucket project-files primeiro
  const primaryUpload = await supabase.storage.from("project-files").upload(path, file, {
    upsert: true,
    contentType: file.type || (fileExt === "pdf" ? "application/pdf" : "text/html"),
  });

  if (!primaryUpload.error) {
    const { data } = supabase.storage.from("project-files").getPublicUrl(path);
    return { url: data.publicUrl };
  }

  // Fallback para o bucket existente 'site-photos'
  const fallbackUpload = await supabase.storage.from("site-photos").upload(path, file, {
    upsert: true,
    contentType: file.type || (fileExt === "pdf" ? "application/pdf" : "text/html"),
  });

  if (fallbackUpload.error) {
    return { url: "", error: fallbackUpload.error.message };
  }

  const { data } = supabase.storage.from("site-photos").getPublicUrl(path);
  return { url: data.publicUrl };
}

/**
 * Salva ou atualiza um projeto no banco.
 */
export async function saveProject(
  project: Omit<Project, "id"> & { id?: string | undefined },
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const slug =
      project.slug.trim() ||
      project.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 60);

    const record = {
      title: project.title.trim(),
      slug,
      description: project.description.trim(),
      category: project.category,
      content_type: project.contentType,
      file_url: project.fileUrl.trim(),
      external_url: project.externalUrl?.trim() || "",
      cover_url: project.coverUrl?.trim() || "",
      tags: project.tags || [],
      is_featured: Boolean(project.isFeatured),
      order_index: project.orderIndex ?? 0,
      updated_at: new Date().toISOString(),
    };

    const isUuid = Boolean(
      project.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id),
    );

    if (isUuid && project.id) {
      const { error } = await supabase.from("projects").update(record).eq("id", project.id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const { error } = await supabase.from("projects").insert(record);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Exclui um projeto pelo ID.
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      return { success: true };
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}


-- Criação da tabela de projetos e materiais compartilháveis (PDFs, HTMLs, Ferramentas)
begin;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'diagnostico', -- 'ia', 'diagnostico', 'crm', 'playbook', 'web', 'outro'
  content_type text not null default 'pdf',     -- 'pdf', 'html', 'link'
  file_url text not null default '',
  external_url text not null default '',
  cover_url text not null default '',
  tags text[] not null default array[]::text[],
  is_featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Leitura pública para visitantes
drop policy if exists "public can read projects" on public.projects;
create policy "public can read projects"
  on public.projects for select to anon, authenticated
  using (true);

-- Gerenciamento restrito a usuários autenticados (Admin)
drop policy if exists "authenticated can manage projects" on public.projects;
create policy "authenticated can manage projects"
  on public.projects for all to authenticated
  using (true)
  with check (true);

commit;

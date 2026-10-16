-- Apply before deploying the form and Manager changes. Additive only; existing policies remain unchanged.
BEGIN;
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS form_roles text[] NOT NULL DEFAULT ARRAY['Sócio(a) / Proprietário(a)', 'CEO / Diretor(a) executivo(a)', 'Diretor(a) comercial', 'Gerente comercial', 'Coordenador(a) comercial', 'Gestor(a) de pré-vendas', 'Diretor(a) financeiro(a)', 'Gerente financeiro(a)', 'Diretor(a) de operações', 'Gerente de operações', 'Gerente administrativo(a)', 'Outro']::text[],
  ADD COLUMN IF NOT EXISTS form_segments text[] NOT NULL DEFAULT ARRAY['Tecnologia / SaaS', 'Serviços profissionais', 'Consultoria', 'Agência / Marketing', 'Comércio / Varejo', 'Indústria', 'Construção / Imobiliário', 'Saúde', 'Educação', 'Logística / Transportes', 'Serviços financeiros', 'Outro']::text[];
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tools text[] NOT NULL DEFAULT ARRAY[]::text[];
COMMIT;

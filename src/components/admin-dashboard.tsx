import { useNavigate } from "@tanstack/react-router";
import { LogOut, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoCropDialog } from "@/components/photo-crop-dialog";
import { getSupabaseClient } from "@/lib/supabase";
import { settingsToRow, type SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

type LoadState = "checking" | "ready" | "unauthenticated";

export function AdminDashboard() {
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  const [loadState, setLoadState] = useState<LoadState>("checking");
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const active = true;

    async function bootstrap() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;

      if (!sessionData.session) {
        setLoadState("unauthenticated");
        navigate({ to: "/admin/login" });
        return;
      }

      setUserEmail(sessionData.session.user.email ?? "");

      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "whatsapp_number, whatsapp_message, email, linkedin_url, privacy_url, terms_url, ga_measurement_id, meta_pixel_id, custom_head_scripts, footer_tagline, hero_photo_url, about_photo_url, lead_webhook_url",
        )
        .eq("id", true)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        toast.error("Não foi possível carregar as configurações atuais.");
      } else {
        setSettings({
          whatsappNumber: data.whatsapp_number,
          whatsappMessage: data.whatsapp_message,
          email: data.email,
          linkedinUrl: data.linkedin_url,
          privacyUrl: data.privacy_url,
          termsUrl: data.terms_url,
          gaMeasurementId: data.ga_measurement_id,
          metaPixelId: data.meta_pixel_id,
          customHeadScripts: data.custom_head_scripts,
          footerTagline: data.footer_tagline,
          heroPhotoUrl: data.hero_photo_url,
          aboutPhotoUrl: data.about_photo_url,
          leadWebhookUrl: data.lead_webhook_url,
        });
      }
      setLoadState("ready");
    }

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update(settingsToRow(settings))
      .eq("id", true);
    setSaving(false);

    if (error) {
      toast.error("Não foi possível salvar", { description: error.message });
      return;
    }
    toast.success("Configurações salvas! O site já reflete as mudanças.");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loadState !== "ready") {
    return (
      <main className="grid min-h-screen place-items-center bg-background">
        <p className="text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="text-2xl font-bold text-foreground">Configurações do site</h1>
            {userEmail && (
              <p className="mt-1 text-sm text-muted-foreground">Logado como {userEmail}</p>
            )}
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" /> Sair
          </Button>
        </div>

        <Tabs defaultValue="conteudo" className="mt-8">
          <TabsList>
            <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
            <TabsTrigger value="tags">Tags & tracking</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="seguranca">Senha</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSave}>
            <TabsContent
              value="conteudo"
              className="space-y-6 rounded-lg border border-border bg-surface p-6"
            >
              <Field label="Número do WhatsApp (com DDI e DDD, só números)">
                <input
                  className="form-control"
                  value={settings.whatsappNumber}
                  onChange={(e) => update("whatsappNumber", e.target.value)}
                  placeholder="5515981103345"
                />
              </Field>
              <Field label="Mensagem inicial do WhatsApp">
                <textarea
                  className="form-control h-auto resize-y py-3"
                  rows={3}
                  value={settings.whatsappMessage}
                  onChange={(e) => update("whatsappMessage", e.target.value)}
                />
              </Field>
              <Field label="E-mail de contato">
                <input
                  type="email"
                  className="form-control"
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="Frase do rodapé">
                <input
                  className="form-control"
                  value={settings.footerTagline}
                  onChange={(e) => update("footerTagline", e.target.value)}
                />
              </Field>
              <Field label="Link do LinkedIn">
                <input
                  className="form-control"
                  value={settings.linkedinUrl}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="Link da Política de Privacidade">
                <input
                  className="form-control"
                  value={settings.privacyUrl}
                  onChange={(e) => update("privacyUrl", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Link dos Termos de Uso">
                <input
                  className="form-control"
                  value={settings.termsUrl}
                  onChange={(e) => update("termsUrl", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </TabsContent>

            <TabsContent
              value="fotos"
              className="space-y-6 rounded-lg border border-border bg-surface p-6"
            >
              <PhotoField
                label="Foto de destaque (topo da página)"
                value={settings.heroPhotoUrl}
                onUploaded={(url) => update("heroPhotoUrl", url)}
                aspect={4 / 5}
                maxDimension={1600}
                recommendedDimensions="1600×2000px (retrato, proporção 4:5)"
                maxSourceMB={15}
              />
              <PhotoField
                label="Foto da seção 'Sobre'"
                value={settings.aboutPhotoUrl}
                onUploaded={(url) => update("aboutPhotoUrl", url)}
                aspect={1}
                maxDimension={1200}
                recommendedDimensions="1200×1200px (quadrada)"
                maxSourceMB={10}
                circular
              />
            </TabsContent>

            <TabsContent
              value="tags"
              className="space-y-6 rounded-lg border border-border bg-surface p-6"
            >
              <Field label="Google Analytics — Measurement ID">
                <input
                  className="form-control"
                  value={settings.gaMeasurementId}
                  onChange={(e) => update("gaMeasurementId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </Field>
              <Field label="Meta Pixel ID">
                <input
                  className="form-control"
                  value={settings.metaPixelId}
                  onChange={(e) => update("metaPixelId", e.target.value)}
                  placeholder="000000000000000"
                />
              </Field>
              <Field
                label="Scripts customizados (avançado)"
                hint="Cole aqui tags adicionais completas (ex.: TikTok Pixel, Google Ads, GTM). O conteúdo é inserido diretamente no <head> do site — use com cuidado, só cole scripts em que você confia."
              >
                <textarea
                  className="form-control h-auto resize-y py-3 font-mono text-xs"
                  rows={6}
                  value={settings.customHeadScripts}
                  onChange={(e) => update("customHeadScripts", e.target.value)}
                  placeholder="<script>...</script>"
                />
              </Field>
              <Field
                label="Webhook de leads (opcional, avançado)"
                hint="Se você usa n8n ou outra automação, cole aqui a URL que deve receber cada solicitação do formulário em paralelo. Não é obrigatório: os leads já ficam salvos e visíveis na aba 'Leads' mesmo sem isso."
              >
                <input
                  className="form-control"
                  value={settings.leadWebhookUrl}
                  onChange={(e) => update("leadWebhookUrl", e.target.value)}
                  placeholder="https://seu-n8n.com/webhook/..."
                />
              </Field>
            </TabsContent>

            <div className="sticky bottom-4 mt-6 flex justify-end">
              <Button type="submit" size="lg" className="button-gold shadow-lg" disabled={saving}>
                {saving ? "Salvando…" : "Salvar alterações"}
              </Button>
            </div>
          </form>

          <TabsContent value="leads" className="rounded-lg border border-border bg-surface p-6">
            <LeadsList />
          </TabsContent>

          <TabsContent value="equipe" className="rounded-lg border border-border bg-surface p-6">
            <InviteTeammate />
          </TabsContent>

          <TabsContent value="seguranca" className="rounded-lg border border-border bg-surface p-6">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PhotoField({
  label,
  value,
  onUploaded,
  aspect,
  maxDimension,
  recommendedDimensions,
  maxSourceMB,
  circular = false,
}: {
  label: string;
  value: string;
  onUploaded: (url: string) => void;
  aspect: number;
  maxDimension: number;
  recommendedDimensions: string;
  maxSourceMB: number;
  circular?: boolean;
}) {
  const supabase = getSupabaseClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > maxSourceMB * 1024 * 1024) {
      toast.error(`A imagem original precisa ter até ${maxSourceMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPendingImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleCropConfirm(blob: Blob) {
    setPendingImageSrc(null);
    setUploading(true);

    const path = `${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from("site-photos").upload(path, blob, {
      upsert: true,
      cacheControl: "3600",
      contentType: "image/jpeg",
    });
    setUploading(false);

    if (error) {
      toast.error("Não foi possível enviar a foto", { description: error.message });
      return;
    }

    const { data } = supabase.storage.from("site-photos").getPublicUrl(path);
    onUploaded(data.publicUrl);
    toast.success('Foto enviada! Clique em "Salvar alterações" para publicar.');
  }

  return (
    <div>
      <Label className="text-foreground">{label}</Label>
      <div className="mt-2 flex items-center gap-4">
        {value ? (
          <img
            src={value}
            alt=""
            className={`size-20 border border-border object-cover ${circular ? "rounded-full" : "rounded-lg"}`}
          />
        ) : (
          <div className="grid size-20 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
            <UploadCloud className="size-6" />
          </div>
        )}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Enviando…" : "Trocar foto"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Ideal: {recommendedDimensions}. Envie o arquivo original em até {maxSourceMB}MB — depois de
        recortar, nós otimizamos automaticamente o tamanho pra não pesar o carregamento do site.
      </p>

      {pendingImageSrc && (
        <PhotoCropDialog
          imageSrc={pendingImageSrc}
          aspect={aspect}
          maxDimension={maxDimension}
          onCancel={() => setPendingImageSrc(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}

type Lead = {
  id: string;
  created_at: string;
  name: string;
  company: string;
  role: string;
  whatsapp: string;
  email: string;
  segment: string;
  monthly_leads: string;
  team_size: string;
  main_challenge: string;
  source: string;
};

function LeadsList() {
  const supabase = getSupabaseClient();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("leads")
        .select(
          "id, created_at, name, company, role, whatsapp, email, segment, monthly_leads, team_size, main_challenge, source",
        )
        .order("created_at", { ascending: false })
        .limit(200);
      if (!active) return;
      if (error) {
        toast.error("Não foi possível carregar os leads.", { description: error.message });
        setLeads([]);
        return;
      }
      setLeads(data ?? []);
    }
    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (leads === null) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  if (leads.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma solicitação recebida ainda. Assim que alguém preencher o formulário do site, vai
        aparecer aqui.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">Solicitações recebidas</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {leads.length} {leads.length === 1 ? "solicitação" : "solicitações"} — clique em uma linha
        pra ver os detalhes.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="py-2 pr-4">Data</th>
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4">Empresa</th>
              <th className="py-2 pr-4">WhatsApp</th>
              <th className="py-2 pr-4">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="cursor-pointer border-b border-border/60 hover:bg-muted/40"
              >
                <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                  {new Date(lead.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="py-2 pr-4 font-medium text-foreground">{lead.name}</td>
                <td className="py-2 pr-4">{lead.company}</td>
                <td className="py-2 pr-4">{lead.whatsapp}</td>
                <td className="py-2 pr-4">{lead.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <DetailRow label="Empresa" value={selected.company} />
              <DetailRow label="Cargo" value={selected.role} />
              <DetailRow label="WhatsApp" value={selected.whatsapp} />
              <DetailRow label="E-mail" value={selected.email} />
              <DetailRow label="Segmento" value={selected.segment} />
              <DetailRow label="Volume de leads" value={selected.monthly_leads} />
              <DetailRow label="Tamanho da equipe" value={selected.team_size} />
              <DetailRow label="Origem" value={selected.source} />
              <div>
                <p className="font-semibold text-foreground">Principal desafio</p>
                <p className="mt-1 text-muted-foreground">{selected.main_challenge}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p>
      <span className="font-semibold text-foreground">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </p>
  );
}

function ChangePassword() {
  const supabase = getSupabaseClient();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error("Não foi possível salvar a senha", { description: error.message });
      return;
    }
    (event.target as HTMLFormElement).reset();
    toast.success("Senha atualizada!");
  }

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-bold text-foreground">Definir / trocar senha</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Use isso logo após entrar por um link de convite, ou sempre que quiser trocar sua senha de
        acesso ao admin.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <Label htmlFor="password">Nova senha</Label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="form-control mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="form-control mt-1.5"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Salvar senha"}
        </Button>
      </form>
    </div>
  );
}

function InviteTeammate() {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInviting(true);

    const { error } = await supabase.functions.invoke("invite-admin", {
      body: { email: email.trim() },
    });

    setInviting(false);

    if (error) {
      toast.error("Não foi possível enviar o convite", { description: error.message });
      return;
    }

    toast.success(`Convite enviado para ${email}.`);
    setEmail("");
  }

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-bold text-foreground">Convidar pessoas para o admin</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A pessoa recebe um e-mail com um link para criar a própria senha e acessar este painel. Todo
        mundo convidado tem o mesmo acesso (pode editar tudo e convidar outras pessoas).
      </p>
      <form onSubmit={handleInvite} className="mt-5 flex gap-3">
        <input
          type="email"
          required
          placeholder="email@agencia.com"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={inviting} className="shrink-0">
          {inviting ? "Enviando…" : "Convidar"}
        </Button>
      </form>
    </div>
  );
}

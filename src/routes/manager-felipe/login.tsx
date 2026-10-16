import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getSupabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/manager-felipe/login")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ title: "Entrar | Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLoginPage,
});

// Quando a pessoa clica no link de convite por e-mail, o Supabase já cria uma
// sessão temporária e volta pra cá com "#type=invite" (ou "recovery") na URL.
// Nesse caso pedimos pra ela definir a própria senha em vez de mostrar login.
function isInviteOrRecoveryLink() {
  if (typeof window === "undefined") return false;
  return /type=(invite|recovery)/.test(window.location.hash);
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  const [mode, setMode] = useState<"checking" | "login" | "set-password">("checking");
  const [loading, setLoading] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  function toggleButtonProps(show: boolean, onToggle: () => void) {
    return {
      type: "button" as const,
      variant: "ghost" as const,
      size: "icon" as const,
      onClick: onToggle,
      "aria-label": show ? "Ocultar senha" : "Mostrar senha",
      "aria-pressed": show,
      className:
        "absolute right-1.5 top-1/2 -translate-y-1/2 size-8 text-inverse-muted hover:text-inverse hover:bg-transparent",
    };
  }

  useEffect(() => {
    let active = true;

    async function resolveMode() {
      const invite = isInviteOrRecoveryLink();
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (data.session && invite) {
        setMode("set-password");
      } else if (data.session) {
        navigate({ to: "/manager-felipe" });
      } else {
        setMode("login");
      }
    }

    resolveMode();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") {
        setMode("set-password");
      } else if (session && isInviteOrRecoveryLink()) {
        setMode("set-password");
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível entrar", { description: "Confira o e-mail e a senha." });
      return;
    }
    navigate({ to: "/manager-felipe" });
  }

  async function handleForgotPassword() {
    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const email = emailInput?.value.trim() ?? "";

    if (!email) {
      toast.error("Digite seu e-mail primeiro", {
        description: "Informe o e-mail do admin no campo acima para receber o link.",
      });
      emailInput?.focus();
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/manager-felipe/login`,
    });
    setResetLoading(false);

    if (error) {
      toast.error("Não foi possível enviar o link", { description: error.message });
      return;
    }
    toast.success("Link de redefinição enviado", {
      description: `Confira a caixa de entrada de ${email}. Ao abrir o link, você definirá uma nova senha.`,
      duration: 8000,
    });
  }

  async function handleSetPassword(event: FormEvent<HTMLFormElement>) {
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

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível definir a senha", { description: error.message });
      return;
    }
    toast.success("Senha definida! Bem-vindo(a).");
    navigate({ to: "/manager-felipe" });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-deep px-5 text-inverse">
      <div className="w-full max-w-sm rounded-lg border border-inverse/15 bg-primary p-8 shadow-xl">
        <p className="eyebrow">Área restrita</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-inverse">
          {mode === "set-password" ? "Defina sua senha" : "Entrar no admin"}
        </h1>

        {mode === "checking" && <p className="mt-6 text-sm text-inverse-muted">Carregando…</p>}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <div>
              <Label htmlFor="email" className="text-inverse-muted">
                E-mail
              </Label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="form-control mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-inverse-muted">
                Senha
              </Label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="form-control pr-12"
                />
                <Button {...toggleButtonProps(showPassword, () => setShowPassword((v) => !v))}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <Button type="submit" size="lg" disabled={loading} className="button-gold w-full">
              {loading ? "Entrando…" : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="mx-auto block text-xs font-bold text-inverse-muted underline underline-offset-4 transition-colors hover:text-gold-light disabled:opacity-60"
            >
              {resetLoading ? "Enviando link…" : "Esqueci minha senha"}
            </button>
          </form>
        )}

        {mode === "set-password" && (
          <form onSubmit={handleSetPassword} className="mt-7 space-y-5">
            <p className="text-sm text-inverse-muted">
              Você foi convidado(a) para gerenciar o site. Crie uma senha para acessar o admin daqui
              pra frente.
            </p>
            <div>
              <Label htmlFor="password" className="text-inverse-muted">
                Nova senha
              </Label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="form-control pr-12"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
                <Button {...toggleButtonProps(showPassword, () => setShowPassword((v) => !v))}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-inverse-muted">
                Confirmar senha
              </Label>
              <div className="relative mt-1.5">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="form-control pr-12"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  aria-describedby="password-match"
                />
                <Button
                  {...toggleButtonProps(showConfirmPassword, () =>
                    setShowConfirmPassword((v) => !v),
                  )}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <p
                id="password-match"
                aria-live="polite"
                className={`mt-2 flex items-center gap-1.5 text-sm ${newPw === confirmPw ? "text-emerald-400" : "text-destructive"}`}
              >
                {confirmPw.length > 0 &&
                  (newPw === confirmPw ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Tá certinho, pode confirmar
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Tem algo errado ai na senha
                    </>
                  ))}
              </p>
            </div>
            <Button type="submit" size="lg" disabled={loading} className="button-gold w-full">
              {loading ? "Salvando…" : "Salvar senha e entrar"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

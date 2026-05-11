import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success(lang === "ar" ? "أهلاً" : "Welcome");
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success(lang === "ar" ? "تحقق من بريدك" : "Check your email");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <form onSubmit={submit} className="glass-strong rounded-2xl p-6 space-y-4">
          <h1 className="text-2xl font-bold gradient-text">{mode === "login" ? t("login") : t("signup")}</h1>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("email")}
            className="w-full glass rounded-lg px-3 py-2.5 bg-transparent outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("password")}
            className="w-full glass rounded-lg px-3 py-2.5 bg-transparent outline-none focus:ring-2 focus:ring-primary" />
          <button disabled={busy} className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold disabled:opacity-50">
            {mode === "login" ? t("login") : t("signup")}
          </button>
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
            {mode === "login" ? t("signup") : t("login")}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            {lang === "ar" ? "بعد إنشاء أول حساب، تواصل مع المسؤول لمنح صلاحية الإدارة." : "After signing up, contact the admin for admin access."}
          </p>
        </form>
      </div>
    </Layout>
  );
}

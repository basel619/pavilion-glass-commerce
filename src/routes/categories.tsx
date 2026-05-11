import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Laptop, Cpu, Battery, Monitor, Plug, Package } from "lucide-react";

const ICONS: Record<string, any> = { laptops: Laptop, parts: Cpu, batteries: Battery, screens: Monitor, chargers: Plug };

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "الأقسام — Pavilion" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { lang, t } = useI18n();
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { supabase.from("categories").select("*").order("name_en").then(({ data }) => setCats(data ?? [])); }, []);
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{t("categories")}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c) => {
          const Icon = ICONS[c.slug] ?? Package;
          return (
            <Link key={c.id} to="/shop"
              className="glass rounded-2xl p-6 flex flex-col items-center gap-3 hover:glass-strong hover:-translate-y-1 transition group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:glow-primary transition">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="font-semibold text-center">{lang === "ar" ? c.name_ar : c.name_en}</span>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard, type Product } from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Sparkles, Truck, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t, lang, dir } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setProducts((data ?? []) as Product[]));
    supabase.from("visits").insert({ path: "/" });
  }, []);

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      <section className="glass-strong rounded-3xl px-6 sm:px-10 py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            {t("location")}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            <span className="gradient-text">{t("hero_title")}</span>
          </h1>
          <p className="text-muted-foreground text-lg">{t("hero_sub")}</p>
          <div className="flex gap-3 pt-2">
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-6 py-3 rounded-xl font-semibold glow-primary hover:opacity-90 transition">
              {t("shop_now")} <Arrow className="w-4 h-4" />
            </Link>
            <Link to="/categories" className="glass rounded-xl px-6 py-3 font-semibold hover:bg-white/10 transition">
              {t("categories")}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { icon: Truck, t: lang === "ar" ? "توصيل سريع" : "Fast Delivery", d: lang === "ar" ? "خلال 24 ساعة في بغداد" : "Within 24h in Baghdad" },
          { icon: ShieldCheck, t: lang === "ar" ? "ضمان أصلي" : "Genuine Warranty", d: lang === "ar" ? "قطع أصلية مضمونة" : "Authentic guaranteed parts" },
          { icon: MapPin, t: lang === "ar" ? "موقع مركزي" : "Central Location", d: t("location") },
        ].map((f, i) => (
          <div key={i} className="glass rounded-2xl p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold">{f.t}</div>
              <div className="text-xs text-muted-foreground mt-1">{f.d}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{lang === "ar" ? "الأحدث" : "Latest"}</h2>
          <Link to="/shop" className="text-sm text-primary-glow hover:underline">{t("shop_now")}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </Layout>
  );
}

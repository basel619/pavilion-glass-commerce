import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Search, Languages, Phone, MapPin, Laptop } from "lucide-react";
import { ReactNode, useState } from "react";
import { CartDrawer } from "./CartDrawer";

export function Layout({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const count = useCart((s) => s.count());
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [openCart, setOpenCart] = useState(false);

  const nav = [
    { to: "/", label: t("home") },
    { to: "/shop", label: t("shop") },
    { to: "/categories", label: t("categories") },
    { to: "/contact", label: t("contact") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-4 z-40 mx-3 sm:mx-6 mt-4">
        <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center glow-primary">
              <Laptop className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base leading-tight gradient-text">{t("brand")}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{t("tagline")}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 ms-auto">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="glass rounded-lg w-9 h-9 flex items-center justify-center hover:bg-white/10 transition" title="Lang">
              <Languages className="w-4 h-4" />
            </button>
            <button onClick={() => setOpenCart(true)}
              className="glass rounded-lg h-9 px-3 flex items-center gap-2 hover:bg-white/10 transition relative">
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -end-1 bg-accent text-accent-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
            <Link to="/admin" className="hidden sm:inline-flex glass rounded-lg h-9 px-3 items-center text-sm hover:bg-white/10 transition">
              {t("admin")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-6 py-6">{children}</main>

      <footer className="mx-3 sm:mx-6 mb-4 mt-8">
        <div className="glass rounded-2xl px-6 py-6 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold text-lg gradient-text mb-2">{t("brand")}</div>
            <p className="text-muted-foreground">{t("tagline")}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" /> {t("location")}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" /> 009647712715130
            </div>
          </div>
          <div className="text-muted-foreground sm:text-end">
            © {new Date().getFullYear()} Pavilion. All rights reserved.
          </div>
        </div>
      </footer>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </div>
  );
}

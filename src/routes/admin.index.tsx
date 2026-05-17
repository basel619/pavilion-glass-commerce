import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Package, ShoppingBag, Users, DollarSign, Plus, Trash2, Edit2, X, LogOut, Printer } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

interface Product {
  id?: string; sku?: string | null; name_ar: string; name_en: string;
  description_ar?: string | null; description_en?: string | null;
  regular_price: number; sale_price?: number | null;
  stock: number; in_stock: boolean; rating?: number;
  image?: string | null; gallery?: string[] | null;
  category_id?: string | null; brand_id?: string | null; model_id?: string | null;
  tags?: string[] | null;
}

function AdminDashboard() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "categories">("overview");
  const [stats, setStats] = useState({ visits: 0, orders: 0, revenue: 0, products: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id);
      else if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true);
    });

    // Real-time Order Notifications
    const channel = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        toast.info(lang === "ar" ? `طلب جديد من ${payload.new.customer_name}` : `New order from ${payload.new.customer_name}`, {
          description: `${payload.new.total.toLocaleString()} ${t("iqd")}`,
          duration: 10000,
        });
        loadAll();
      })
      .subscribe();

    const onTab = (e: any) => setTab(e.detail);
    window.addEventListener("admin-tab-change", onTab);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("admin-tab-change", onTab);
    };
  }, [nav]);

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data || localStorage.getItem("isAdmin") === "true");
    if (data || localStorage.getItem("isAdmin") === "true") loadAll();
  };

  const loadAll = async () => {
    const [v, o, p, c, b] = await Promise.all([
      supabase.from("visits").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
      supabase.from("brands").select("*"),
    ]);
    setOrders(o.data ?? []);
    setProducts((p.data ?? []) as Product[]);
    setCats(c.data ?? []);
    setBrands(b.data ?? []);
    const revenue = (o.data ?? []).reduce((s, x: any) => s + Number(x.total || 0), 0);
    setStats({ visits: v.count ?? 0, orders: (o.data ?? []).length, revenue, products: (p.data ?? []).length });
  };

  const saveProduct = async (p: Product) => {
    const payload: any = { ...p };
    if (payload.tags && typeof payload.tags === "string") payload.tags = (payload.tags as any).split(",").map((s: string) => s.trim()).filter(Boolean);
    delete payload.id;
    const res = p.id
      ? await supabase.from("products").update(payload).eq("id", p.id)
      : await supabase.from("products").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(lang === "ar" ? "تم الحفظ" : "Saved");
    setEditing(null);
    loadAll();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد؟" : "Sure?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    loadAll();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    loadAll();
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusAr = (s: string) => {
    const map: any = {
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغي"
    };
    return map[s] || s;
  };

  if (isAdmin === null) return <AdminLayout><div className="text-center py-20">…</div></AdminLayout>;
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      const headers = lines[0].split(",").map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return {
          name_ar: obj.name_ar,
          name_en: obj.name_en,
          regular_price: Number(obj.regular_price || 0),
          stock: Number(obj.stock || 0),
          in_stock: Number(obj.stock || 0) > 0,
          sku: obj.sku || null,
          description_ar: obj.description_ar || null,
          description_en: obj.description_en || null,
        };
      });
      const { error } = await supabase.from("products").insert(data);
      if (error) toast.error(error.message);
      else { toast.success(`Imported ${data.length} products`); loadAll(); }
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">{t("dashboard")}</h1>
        <button onClick={() => supabase.auth.signOut()} className="glass rounded-lg px-3 py-2 text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4" /> {t("logout")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: t("visitors"), value: stats.visits, color: "from-blue-500 to-cyan-400" },
          { icon: ShoppingBag, label: t("total_orders"), value: stats.orders, color: "from-primary to-primary-glow" },
          { icon: DollarSign, label: t("revenue"), value: `${stats.revenue.toLocaleString()} ${t("iqd")}`, color: "from-emerald-500 to-teal-400" },
          { icon: Package, label: t("products"), value: stats.products, color: "from-pink-500 to-rose-400" },
        ].map((s, i) => (
          <div key={i} className="glass-strong rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-4">
        {(["overview", "products", "orders", "categories"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === k ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t(k === "overview" ? "dashboard" : k)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold mb-4">{lang === "ar" ? "آخر الطلبات" : "Recent Orders"}</h3>
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="glass rounded-xl p-3 flex items-center justify-between text-sm">
                <div><div className="font-medium">{o.customer_name}</div><div className="text-xs text-muted-foreground">{o.customer_phone} · {o.source}</div></div>
                <div className="text-end"><div className="font-bold">{Number(o.total).toLocaleString()} {t("iqd")}</div><div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div></div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-muted-foreground text-sm">—</p>}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setEditing({ name_ar: "", name_en: "", regular_price: 0, stock: 0, in_stock: true })}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
              <Plus className="w-4 h-4" /> {t("add_product")}
            </button>
            <label className="glass rounded-xl px-4 py-2 cursor-pointer text-sm font-medium hover:bg-white/5 transition flex items-center gap-2">
              <Package className="w-4 h-4" /> Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
          </div>
          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-glass-border text-muted-foreground">
                <th className="text-start p-3">{lang === "ar" ? "الاسم" : "Name"}</th>
                <th className="text-start p-3">SKU</th>
                <th className="text-start p-3">{lang === "ar" ? "السعر" : "Price"}</th>
                <th className="text-start p-3">{lang === "ar" ? "المخزون" : "Stock"}</th>
                <th></th>
              </tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-glass-border/50 hover:bg-white/5">
                    <td className="p-3">{lang === "ar" ? p.name_ar : p.name_en}</td>
                    <td className="p-3 text-muted-foreground">{p.sku}</td>
                    <td className="p-3">{(p.sale_price ?? p.regular_price).toLocaleString()}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 text-end">
                      <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg glass inline-flex items-center justify-center hover:bg-white/10 me-1"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteProduct(p.id!)} className="w-8 h-8 rounded-lg inline-flex items-center justify-center hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-glass-border/10 p-4 rounded-2xl">
            <h3 className="font-bold">{lang === "ar" ? "إدارة الطلبات" : "Manage Orders"}</h3>
            <button onClick={handlePrint} className="btn-primary !px-6 !py-2 text-sm flex items-center gap-2 font-bold shadow-lg">
              <Printer className="w-4 h-4" /> {lang === "ar" ? "طباعة كل الطلبات" : "Print All Orders"}
            </button>
          </div>
          <div className="glass-strong rounded-2xl overflow-hidden print:bg-white print:text-black">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-glass-border text-muted-foreground print:text-black font-black uppercase text-[10px] tracking-widest">
                <th className="text-start p-4">{lang === "ar" ? "العميل" : "Customer"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الهاتف" : "Phone"}</th>
                <th className="text-start p-4">{lang === "ar" ? "التاريخ والوقت" : "Date & Time"}</th>
                <th className="text-start p-4">{t("total")}</th>
                <th className="text-start p-4">{lang === "ar" ? "الحالة" : "Status"}</th>
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors print:border-black">
                    <td className="p-4">
                      <div className="font-black text-primary-glow print:text-black">{o.customer_name}</div>
                      <div className="text-[10px] opacity-60 font-medium">{o.customer_address}</div>
                    </td>
                    <td className="p-4 font-mono font-bold">{o.customer_phone}</td>
                    <td className="p-4 text-[11px] font-semibold opacity-80">
                      {new Date(o.created_at).toLocaleString(lang === "ar" ? "ar-IQ" : "en-US", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </td>
                    <td className="p-4 font-black text-primary-glow print:text-black">
                      {Number(o.total).toLocaleString()} <span className="text-[10px] opacity-60">{t("iqd")}</span>
                    </td>
                    <td className="p-4">
                      <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider outline-none border transition-all glass-strong ${
                          o.status === "pending" ? "border-amber-500/50 text-amber-500" :
                          o.status === "confirmed" ? "border-blue-500/50 text-blue-500" :
                          o.status === "shipped" ? "border-purple-500/50 text-purple-500" :
                          o.status === "delivered" ? "border-emerald-500/50 text-emerald-500" :
                          "border-rose-500/50 text-rose-500"
                        }`}>
                        {[
                          { val: "pending", label: "قيد الانتظار" },
                          { val: "confirmed", label: "تم التأكيد" },
                          { val: "shipped", label: "تم الشحن" },
                          { val: "delivered", label: "تم التوصيل" },
                          { val: "cancelled", label: "ملغي" }
                        ].map((s) => (
                          <option key={s.val} value={s.val} className="bg-[#060312] text-white">
                            {lang === "ar" ? s.label : s.val}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-muted-foreground italic">{lang === "ar" ? "لا توجد طلبات حالياً" : "No orders found"}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="space-y-4">
          <button onClick={async () => {
            const name = prompt(lang === "ar" ? "اسم القسم" : "Category Name");
            if (name) {
              const { error } = await supabase.from("categories").insert({ name_ar: name, name_en: name });
              if (error) toast.error(error.message);
              else loadAll();
            }
          }} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4" /> {lang === "ar" ? "إضافة قسم" : "Add Category"}
          </button>
          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-glass-border text-muted-foreground">
                <th className="text-start p-3">{lang === "ar" ? "الاسم" : "Name"}</th>
                <th></th>
              </tr></thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c.id} className="border-b border-glass-border/50 hover:bg-white/5">
                    <td className="p-3">{lang === "ar" ? c.name_ar : c.name_en}</td>
                    <td className="p-3 text-end">
                      <button onClick={async () => {
                        if (confirm("Sure?")) {
                          await supabase.from("categories").delete().eq("id", c.id);
                          loadAll();
                        }
                      }} className="w-8 h-8 rounded-lg inline-flex items-center justify-center hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{editing.id ? t("edit") : t("add_product")}</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg glass flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Field label={lang === "ar" ? "الاسم (ع)" : "Name (AR)"} value={editing.name_ar} onChange={(v) => setEditing({ ...editing, name_ar: v })} />
              <Field label={lang === "ar" ? "الاسم (EN)" : "Name (EN)"} value={editing.name_en} onChange={(v) => setEditing({ ...editing, name_en: v })} />
              <Field label="SKU" value={editing.sku ?? ""} onChange={(v) => setEditing({ ...editing, sku: v })} />
              <Field label={lang === "ar" ? "صورة (URL)" : "Image URL"} value={editing.image ?? ""} onChange={(v) => setEditing({ ...editing, image: v })} />
              <Field label={lang === "ar" ? "السعر العادي" : "Regular Price"} type="number" value={String(editing.regular_price)} onChange={(v) => setEditing({ ...editing, regular_price: Number(v) })} />
              <Field label={lang === "ar" ? "سعر التخفيض" : "Sale Price"} type="number" value={String(editing.sale_price ?? "")} onChange={(v) => setEditing({ ...editing, sale_price: v ? Number(v) : null })} />
              <Field label={lang === "ar" ? "المخزون" : "Stock"} type="number" value={String(editing.stock)} onChange={(v) => setEditing({ ...editing, stock: Number(v), in_stock: Number(v) > 0 })} />
              <Field label={lang === "ar" ? "التقييم" : "Rating"} type="number" value={String(editing.rating ?? 5)} onChange={(v) => setEditing({ ...editing, rating: Number(v) })} />
              <Select label={lang === "ar" ? "القسم" : "Category"} value={editing.category_id ?? ""} onChange={(v) => setEditing({ ...editing, category_id: v || null })}
                options={[{ value: "", label: "—" }, ...cats.map((c) => ({ value: c.id, label: lang === "ar" ? c.name_ar : c.name_en }))]} />
              <Select label={lang === "ar" ? "العلامة" : "Brand"} value={editing.brand_id ?? ""} onChange={(v) => setEditing({ ...editing, brand_id: v || null })}
                options={[{ value: "", label: "—" }, ...brands.filter((b) => !b.parent_id).map((b) => ({ value: b.id, label: b.name }))]} />
              <Select label={lang === "ar" ? "الموديل" : "Model"} value={editing.model_id ?? ""} onChange={(v) => setEditing({ ...editing, model_id: v || null })}
                options={[{ value: "", label: "—" }, ...brands.filter((b) => b.parent_id === editing.brand_id).map((b) => ({ value: b.id, label: b.name }))]} />
              <Field label={lang === "ar" ? "وسوم (مفصولة بفاصلة)" : "Tags (comma)"} value={(editing.tags ?? []).join(",")} onChange={(v) => setEditing({ ...editing, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">{lang === "ar" ? "الوصف (ع)" : "Description (AR)"}</label>
                <textarea value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })}
                  className="w-full glass rounded-lg p-2 mt-1 bg-transparent outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">{lang === "ar" ? "الوصف (EN)" : "Description (EN)"}</label>
                <textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })}
                  className="w-full glass rounded-lg p-2 mt-1 bg-transparent outline-none focus:ring-2 focus:ring-primary" rows={2} />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setEditing(null)} className="glass rounded-lg px-4 py-2 text-sm">{t("cancel")}</button>
              <button onClick={() => saveProduct(editing)} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm">{t("save")}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full glass rounded-lg px-3 py-2 mt-1 bg-transparent outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full glass rounded-lg px-3 py-2 mt-1 bg-transparent outline-none focus:ring-2 focus:ring-primary">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-background">{o.label}</option>)}
      </select>
    </div>
  );
}

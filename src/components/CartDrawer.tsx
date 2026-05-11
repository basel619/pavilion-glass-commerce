import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const { items, setQty, remove, total, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", source: "website", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error(lang === "ar" ? "الاسم والهاتف مطلوبان" : "Name and phone required");
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: form.name.trim().slice(0, 200),
      customer_phone: form.phone.trim().slice(0, 30),
      customer_address: form.address.trim().slice(0, 500) || null,
      source: form.source,
      notes: form.notes.trim().slice(0, 500) || null,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total: total(),
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("order_success"));
    clear();
    setForm({ name: "", phone: "", address: "", source: "website", notes: "" });
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="relative ms-auto h-full w-full sm:w-[440px] glass-strong border-s border-glass-border flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <h2 className="text-lg font-bold">{t("cart")}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && <p className="text-muted-foreground text-center py-8">{t("empty_cart")}</p>}
          {items.map((it) => (
            <div key={it.id} className="glass rounded-xl p-3 flex gap-3 items-center">
              {it.image && <img src={it.image} className="w-14 h-14 rounded-lg object-cover" alt="" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.price.toLocaleString()} {t("iqd")}</div>
                <div className="flex items-center gap-1 mt-1">
                  <button onClick={() => setQty(it.id, it.qty - 1)} className="w-6 h-6 rounded glass flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm w-6 text-center">{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)} className="w-6 h-6 rounded glass flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
              <button onClick={() => remove(it.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/20 text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-glass-border space-y-3">
            <div className="space-y-2">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("name")}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t("phone")}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary" />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("address")}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary" />
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary">
                <option value="website" className="bg-background">Website</option>
                <option value="whatsapp" className="bg-background">WhatsApp</option>
                <option value="facebook" className="bg-background">Facebook</option>
                <option value="instagram" className="bg-background">Instagram</option>
                <option value="tiktok" className="bg-background">TikTok</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("total")}</span>
              <span className="font-bold text-lg gradient-text">{total().toLocaleString()} {t("iqd")}</span>
            </div>
            <button disabled={submitting} onClick={submit}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold disabled:opacity-50">
              {t("checkout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

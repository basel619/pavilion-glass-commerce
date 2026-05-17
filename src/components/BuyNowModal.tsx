import { useState } from "react";
import { X, CheckCircle, ArrowRight as ArrowRightIcon, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBuyNow } from "@/lib/buy-now-modal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function BuyNowModal() {
  const { t, lang, dir } = useI18n();
  const { product, isOpen, close } = useBuyNow();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error(lang === "ar" ? "يرجى إدخال الاسم ورقم الهاتف" : "Please enter name and phone");
      return;
    }

    setBusy(true);
    try {
      console.log("Attempting order insert for product:", product.id);
      const price = product.sale_price ?? product.regular_price;
      const payload = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        notes: form.notes,
        total: price,
        status: "pending",
        items: [{
          id: product.id,
          name: lang === "ar" ? product.name_ar : product.name_en,
          price: price,
          qty: 1,
          image: product.image
        }]
      };
      
      console.log("Payload:", payload);
      const { data, error } = await supabase.from("orders").insert([payload]).select();

      if (error) {
        console.error("Order Insert Error:", error);
        throw error;
      }
      
      console.log("Order Insert Success:", data);
      setSuccess(true);
      setTimeout(() => {
        close();
        setSuccess(false);
        setForm({ name: "", phone: "", address: "", notes: "" });
      }, 3000);
    } catch (err: any) {
      console.error("Caught error during order:", err);
      toast.error(lang === "ar" ? `فشل الطلب: ${err.message}` : `Order failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRightIcon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in" onMouseDown={close}>
      <div className="glass-strong rounded-[2.5rem] p-8 sm:p-10 max-w-lg w-full shadow-2xl relative overflow-hidden animate-slide-up border border-white/10" onMouseDown={(e) => e.stopPropagation()}>
        {/* Background Decorative */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        
        {success ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto glow-primary-sm">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black gradient-text tracking-tight">{t("order_success")}</h3>
              <p className="text-muted-foreground font-medium">{lang === "ar" ? "سيتصل بك فريقنا لتأكيد طلبك قريباً." : "Our team will call you shortly to confirm."}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black tracking-tighter gradient-text uppercase">{t("buy_now")}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{lang === "ar" ? "أكمل بياناتك لإتمام الطلب فوراً" : "Fill details to complete your order"}</p>
              </div>
              <button onClick={close} className="icon-btn !w-11 !h-11 hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-5 p-4 glass rounded-3xl mb-8 border-primary/10">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                <img src={product.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm truncate max-w-[200px]">{lang === "ar" ? product.name_ar : product.name_en}</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-black gradient-text">{(product.sale_price ?? product.regular_price).toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{t("iqd")}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="buy-name" className="text-[10px] font-black uppercase tracking-widest text-white/40 ps-1">{t("name")}</label>
                  <input id="buy-name" name="customer_name" type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
                         className="field-input !h-13 !rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all" 
                         placeholder={lang === "ar" ? "اسمك الكامل" : "Full Name"} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="buy-phone" className="text-[10px] font-black uppercase tracking-widest text-white/40 ps-1">{t("phone")}</label>
                  <input id="buy-phone" name="customer_phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                         className="field-input !h-13 !rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all" 
                         placeholder="07XX XXX XXXX" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="buy-address" className="text-[10px] font-black uppercase tracking-widest text-white/40 ps-1">{t("address")}</label>
                <input id="buy-address" name="customer_address" type="text" autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} 
                       className="field-input !h-13 !rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all" 
                       placeholder={lang === "ar" ? "المدينة، المنطقة..." : "City, District..."} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="buy-notes" className="text-[10px] font-black uppercase tracking-widest text-white/40 ps-1">{t("notes")}</label>
                <textarea id="buy-notes" name="customer_notes" autoComplete="off" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                          className="field-input !h-24 !py-4 !rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all custom-scrollbar" 
                          placeholder={lang === "ar" ? "أي ملاحظات إضافية..." : "Any extra notes..."} />
              </div>

              <button disabled={busy} className="btn-primary w-full !h-14 !rounded-2xl mt-4 font-black tracking-widest uppercase text-sm glow-primary transition-all active:scale-[0.98]">
                {busy ? "..." : (
                  <span className="flex items-center justify-center gap-3">
                    {t("checkout")} <ArrowIcon className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

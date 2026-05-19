import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";
import { Phone, MapPin, MessageCircle, Facebook, Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "تواصل معنا — Pavilion" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { t, lang } = useI18n();
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{t("contact")}</h1>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"><MapPin className="w-5 h-5 text-primary-foreground" /></div>
            <div><div className="font-semibold">{lang === "ar" ? "العنوان" : "Address"}</div><div className="text-sm text-muted-foreground">{t("location")}</div></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"><Phone className="w-5 h-5 text-primary-foreground" /></div>
            <div><div className="font-semibold">{t("phone")}</div><a href="tel:+9647712715130" className="text-sm text-primary-glow hover:underline">009647712715130</a></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <a href="https://wa.me/9647712715130" target="_blank" rel="noreferrer" className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-emerald-500/20 hover:text-emerald-400 transition"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <a href="https://www.facebook.com/share/18V817G7BM/" target="_blank" rel="noreferrer" className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-blue-500/20 hover:text-blue-400 transition"><Facebook className="w-4 h-4" /> Facebook</a>
            <a href="https://www.instagram.com/pavilion_data?igsh=MWRjeHFpcmlnbzBrbA==" target="_blank" rel="noreferrer" className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-pink-500/20 hover:text-pink-400 transition"><Instagram className="w-4 h-4" /> Instagram</a>
          </div>
        </div>
        <div className="glass-strong rounded-2xl overflow-hidden min-h-[300px]">
          <iframe title="map" className="w-full h-full min-h-[300px]"
            src="https://www.google.com/maps?q=University+of+Technology+Baghdad&output=embed" />
        </div>
      </div>
    </Layout>
  );
}

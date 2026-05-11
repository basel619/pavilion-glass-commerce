import { Star, ShoppingCart, MessageCircle, Facebook, Instagram } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export interface Product {
  id: string;
  sku: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  regular_price: number;
  sale_price: number | null;
  in_stock: boolean;
  stock: number;
  rating: number;
  image: string | null;
  tags: string[] | null;
}

const PHONE = "9647712715130";

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const add = useCart((s) => s.add);
  const name = lang === "ar" ? product.name_ar : product.name_en;
  const price = product.sale_price ?? product.regular_price;
  const hasSale = product.sale_price && product.sale_price < product.regular_price;

  const waText = encodeURIComponent(`${lang === "ar" ? "أرغب بشراء" : "I want to buy"}: ${name} (${product.sku ?? ""})`);
  const productUrl = typeof window !== "undefined" ? `${window.location.origin}/product/${product.id}` : "";

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:glass-strong transition-all duration-300 hover:-translate-y-1 hover:glow-primary flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {product.image ? (
          <img src={product.image} alt={name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
        )}
        {hasSale && (
          <div className="absolute top-3 start-3 bg-destructive/90 backdrop-blur-md text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(((product.regular_price - price) / product.regular_price) * 100)}%-
          </div>
        )}
        <div className="absolute top-3 end-3 glass rounded-full px-2 py-1 flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 fill-primary-glow text-primary-glow" />
          {product.rating}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold line-clamp-2 leading-tight">{name}</h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold gradient-text">{price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">{t("iqd")}</span>
          {hasSale && (
            <span className="text-xs text-muted-foreground line-through ms-auto">
              {product.regular_price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-auto">
          <a href={`https://wa.me/${PHONE}?text=${waText}`} target="_blank" rel="noopener noreferrer"
            title="WhatsApp"
            className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition">
            <MessageCircle className="w-4 h-4" />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer"
            title="Facebook"
            className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition">
            <Facebook className="w-4 h-4" />
          </a>
          <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer"
            title="Instagram"
            className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-400 transition">
            <Instagram className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              add({ id: product.id, name, price, image: product.image ?? undefined });
              toast.success(lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
            }}
            disabled={!product.in_stock}
            className="ms-auto h-9 px-3 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition disabled:opacity-50">
            <ShoppingCart className="w-4 h-4" />
            {t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}

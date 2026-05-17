import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart, MessageCircle, Eye } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useAddToCartModal } from "@/lib/add-to-cart-modal";
import { useBuyNow } from "@/lib/buy-now-modal";
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
  const cartModal = useAddToCartModal();
  const name = lang === "ar" ? product.name_ar : product.name_en;
  const price = product.sale_price ?? product.regular_price;
  const hasSale = product.sale_price && product.sale_price < product.regular_price;
  const discount = hasSale ? Math.round(((product.regular_price - price) / product.regular_price) * 100) : 0;

  const waText = encodeURIComponent(`${lang === "ar" ? "أرغب بشراء" : "I want to buy"}: ${name} (${product.sku ?? ""})`);

  return (
    <div className="product-card group">
      {/* Image */}
      <Link to="/product/$id" params={{ id: product.id }} className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-transparent block cursor-pointer">
        {product.image ? (
          <img src={product.image} alt={name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-muted-foreground">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary/50" />
            </div>
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> {lang === "ar" ? "عرض التفاصيل" : "View Details"}
          </span>
        </div>

        {/* Badges */}
        {hasSale && (
          <div className="absolute top-2.5 start-2.5 badge badge-danger !text-[11px] !py-1 !px-2 shadow-lg">
            -{discount}%
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="badge badge-danger !text-xs !py-1.5 !px-3">{t("out_of_stock")}</span>
          </div>
        )}
        <div className="absolute top-2.5 end-2.5 glass rounded-full px-2 py-1 flex items-center gap-1 text-xs font-bold">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{product.rating || "5.0"}</span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <Link to="/product/$id" params={{ id: product.id }} className="cursor-pointer">
          <h3 className="font-bold text-sm leading-snug line-clamp-2 hover:text-primary-glow transition-colors duration-200">{name}</h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-extrabold gradient-text">{price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground font-medium">{t("iqd")}</span>
          {hasSale && (
            <span className="text-xs text-muted-foreground line-through ms-auto opacity-60">
              {product.regular_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <a
            href={`https://wa.me/${PHONE}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn !w-11 !h-11 hover:bg-[#25D366]/20 hover:!text-[#25D366] hover:!border-[#25D366]/30 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <button
            onClick={() => {
              add({ id: product.id, name, price, image: product.image ?? undefined });
              cartModal.open(name);
            }}
            disabled={!product.in_stock}
            className="icon-btn !w-11 !h-11 hover:bg-primary/20 hover:!text-primary-glow hover:!border-primary/30 transition-all shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          <button
            onClick={() => useBuyNow.getState().open(product)}
            disabled={!product.in_stock}
            className="btn-primary flex-1 !h-11 !text-[11px] !rounded-xl font-black uppercase tracking-widest glow-primary-sm hover:glow-primary active:scale-95 disabled:opacity-40 shadow-xl"
          >
            {t("buy_now")}
          </button>
        </div>
      </div>
    </div>
  );
}

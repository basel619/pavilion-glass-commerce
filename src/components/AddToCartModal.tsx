import { useAddToCartModal } from "@/lib/add-to-cart-modal";
import { useI18n } from "@/lib/i18n";
import { ShoppingBag, ArrowRight as ArrowRightIcon, ArrowLeft, X, ShoppingCart } from "lucide-react";

export function AddToCartModal({ onOpenCart }: { onOpenCart: () => void }) {
  const { isOpen, productName, close } = useAddToCartModal();
  const { t, lang, dir } = useI18n();

  if (!isOpen) return null;

  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRightIcon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onMouseDown={close}>
      <div className="glass-strong rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button onClick={close} className="icon-btn !w-8 !h-8"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto glow-primary-sm">
            <ShoppingCart className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div>
            <h3 className="font-extrabold text-xl mb-1">
              {lang === "ar" ? "تمت الإضافة بنجاح!" : "Added Successfully!"}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {productName}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => {
                close();
                onOpenCart();
              }}
              className="w-full btn-primary gap-2 py-3"
            >
              <ShoppingBag className="w-4 h-4" />
              {lang === "ar" ? "الذهاب إلى السلة" : "Go to Cart"}
            </button>
            
            <button
              onClick={close}
              className="w-full btn-ghost gap-2 py-3"
            >
              {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

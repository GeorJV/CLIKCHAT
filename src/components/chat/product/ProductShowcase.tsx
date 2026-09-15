import React, { useState } from 'react';
import { Sparkles, FileText, CreditCard, ChevronLeft, ChevronRight, Maximize2, CheckCircle2, Truck, ShoppingBag } from 'lucide-react';
import { ProductItem } from '../../../types/productChat';
import { ThemeStyles } from './productThemes';

interface Props {
  product: ProductItem;
  themeStyles: ThemeStyles;
  onOpenBenefits: () => void;
  onOpenSpecs: () => void;
  onOpenFullscreen: () => void;
  onBuyNow: () => void;
}

export const ProductShowcase: React.FC<Props> = ({
  product, themeStyles, onOpenBenefits, onOpenSpecs, onOpenFullscreen, onBuyNow,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 38;

  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className={`flex flex-col h-full ${themeStyles.showcaseBg} overflow-hidden relative min-h-0`}>
      <div className="flex-1 flex flex-col px-3 pt-3 pb-3 overflow-hidden min-h-0">
        {/* Photo Container */}
        <div className={`flex-1 w-full relative rounded-2xl overflow-hidden border ${themeStyles.photoBorder} ${themeStyles.photoBg} shadow-2xl group min-h-0 isolate`}>
          {images.length > 0 && (images[currentImageIndex] || product.image) ? (
            <img
              src={images[currentImageIndex] || product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 rounded-2xl"
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center ${themeStyles.photoBg} text-zinc-500 p-6 text-center`}>
              <ShoppingBag className="w-14 h-14 text-emerald-500/30 mb-2" />
              <span className={`text-sm font-bold ${themeStyles.textPrimary}`}>{product.title}</span>
              <span className={`text-xs ${themeStyles.textSecondary} mt-1`}>{product.category || 'Catálogo Oficial'}</span>
            </div>
          )}

          {/* Photo Top Overlay */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent h-12 pointer-events-none rounded-t-2xl" />

          <div className={`absolute top-3 left-3 ${themeStyles.tagDiscount} text-[11px] font-black px-2.5 py-1 shadow-lg z-10`}>
            {discount}% OFF
          </div>

          <button
            type="button"
            onClick={onOpenFullscreen}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition active:scale-95 shadow-md cursor-pointer z-10"
            title="Ampliar vista del producto"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Photo Bottom Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent pt-6 pb-2.5 px-3 sm:pb-3 sm:px-3.5 rounded-b-2xl">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className={`text-sm sm:text-base font-extrabold ${themeStyles.textPrimary} leading-tight truncate drop-shadow-sm`}>
                  {product.title}
                </h1>
                <div className={`flex items-center gap-2 mt-1 text-[11px] ${themeStyles.textSecondary}`}>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Stock Disponible
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-teal-400" /> Envío 24/48h
                  </span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-1 shrink-0 bg-black/50 px-2 py-1 rounded-full border border-white/10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === currentImageIndex ? 'bg-emerald-400 w-3' : 'bg-zinc-600 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 shrink-0">
          <button type="button" onClick={onOpenBenefits} className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold transition shadow-sm cursor-pointer active:scale-98 group ${themeStyles.benefitsBtn}`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:text-[#FFD043] transition-colors duration-200" />
            <span className="transition-colors duration-200">Beneficios</span>
          </button>
          <button type="button" onClick={onOpenSpecs} className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold transition shadow-sm cursor-pointer active:scale-98 group ${themeStyles.specsBtn}`}>
            <FileText className="w-3.5 h-3.5 text-teal-400 group-hover:text-[#FFD043] transition-colors duration-200" />
            <span className="transition-colors duration-200">Detalle del Producto</span>
          </button>
        </div>

        {/* Main CTA Button: Yellow Card Icon & Yellow 'Comprar Ahora' with White Price */}
        <div className="mt-2.5 shrink-0">
          <button
            type="button"
            onClick={onBuyNow}
            className={`w-full py-3 px-4 backdrop-blur-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer font-extrabold text-sm sm:text-base ${themeStyles.buyNowBtn}`}
          >
            <CreditCard className={`w-4 h-4 sm:w-5 sm:h-5 ${themeStyles.buyNowIconColor || 'text-[#D4AF37]'} shrink-0`} />
            <span className={themeStyles.buyNowTextColor || 'text-[#D4AF37]'}>Comprar Ahora</span>
            <span className="text-white font-bold">— ${product.price.toFixed(2)} ${product.currency}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

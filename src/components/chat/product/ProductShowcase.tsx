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
    <section className={`flex flex-col h-full ${themeStyles.showcaseBg} overflow-hidden relative min-h-0 z-10 shadow-[0_-12px_30px_-5px_rgba(0,0,0,0.7)] md:shadow-[-24px_0_50px_-5px_rgba(0,0,0,0.85)] border-t md:border-t-0 md:border-l border-white/[0.1]`}>
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
              <button type="button" onClick={handlePrev} className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleNext} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer">
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
                    <button key={i} type="button" onClick={() => setCurrentImageIndex(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === currentImageIndex ? 'bg-emerald-400 w-3' : 'bg-zinc-600 w-1.5'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 shrink-0">
          <button type="button" onClick={onOpenBenefits} className={`flex items-center justify-center gap-2 text-xs font-bold transition shadow-sm cursor-pointer active:scale-98 group ${themeStyles.benefitsBtn}`}>
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-300 transition-colors duration-300 shrink-0 relative z-10" />
            <span className="text-zinc-300 group-hover:text-white transition-colors duration-300 relative z-10 drop-shadow-sm">Beneficios</span>
          </button>
          <button type="button" onClick={onOpenSpecs} className={`flex items-center justify-center gap-2 text-xs font-bold transition shadow-sm cursor-pointer active:scale-98 group ${themeStyles.specsBtn}`}>
            <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-teal-300 transition-colors duration-300 shrink-0 relative z-10" />
            <span className="text-zinc-300 group-hover:text-white transition-colors duration-300 relative z-10 drop-shadow-sm">Detalle del Producto</span>
          </button>
        </div>

        {/* Main CTA Button: Yellow Card Icon & Yellow 'Comprar Ahora' with White Price */}
        {/* Main Animated CTA Button: Price in normal state -> Rolls up to 'Comprar Ahora' on hover */}
        <div className="mt-2.5 shrink-0">
          <button
            type="button"
            onClick={onBuyNow}
            className={`group relative w-full h-11 sm:h-12 px-4 overflow-hidden flex items-center justify-center transition active:scale-98 cursor-pointer font-extrabold ${themeStyles.buyNowBtn}`}
          >
            {/* Estado Normal: Solo el Precio que sube al hacer hover */}
            <div className="flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-12 group-hover:opacity-0">
              <span className="text-white text-base sm:text-lg font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                ${product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
              </span>
            </div>

            {/* Estado Hover: Sube de abajo hacia arriba con icono de tarjeta y texto en dorado premium */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-out transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] shrink-0" />
              <span className="font-['Cinzel',serif] text-sm sm:text-base font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#FFF2B2] via-[#FFD700] to-[#E5A823] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Comprar Ahora
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

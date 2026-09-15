import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingBag, ShieldCheck, MessageSquare } from 'lucide-react';
import { ProductItem } from '../../../types/productChat';

interface Props {
  product: ProductItem | null;
  storeName: string;
  onClose: () => void;
  onAskAboutProduct: (p: ProductItem) => void;
  onDirectCheckout: (p: ProductItem) => void;
}

export const ProductFullscreenModal: React.FC<Props> = ({
  product,
  storeName,
  onClose,
  onAskAboutProduct,
  onDirectCheckout,
}) => {
  const [slide, setSlide] = useState(0);
  if (!product) return null;

  const images = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const isLast = slide === images.length;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 38;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#181717] border border-[#282626] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#282626] bg-[#141313] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {product.category || 'Producto'}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {isLast ? 'Beneficios' : `Foto ${slide + 1} de ${images.length}`}
            </span>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-[#252424] transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-1.5 py-2 bg-[#141313] border-b border-[#242222] shrink-0">
          {images.map((_, idx) => (
            <button key={idx} type="button" onClick={() => setSlide(idx)} className={`h-1.5 rounded-full transition-all cursor-pointer ${slide === idx ? 'w-6 bg-emerald-500' : 'w-1.5 bg-[#333] hover:bg-[#555]'}`} />
          ))}
          <button type="button" onClick={() => setSlide(images.length)} className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold transition flex items-center gap-1 cursor-pointer ${isLast ? 'bg-emerald-600 text-white' : 'bg-[#252323] text-zinc-400 hover:text-white'}`}>
            <Sparkles className="w-2.5 h-2.5 text-amber-300" /><span>Beneficios</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {!isLast ? (
            <div className="space-y-2.5 animate-fade-in">
              <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-[#111010] border border-[#262424]">
                <img src={images[slide] || product.image} alt={product.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow">{discount}% OFF</span>
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-black/70 backdrop-blur-sm border-t border-white/10 text-white flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 text-emerald-300 font-semibold"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /><span>Stock Disponible</span></div>
                  <span className="text-zinc-300">{storeName}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">{product.title}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-black text-emerald-400">${product.price.toFixed(2)} {product.currency}</span>
                  {product.originalPrice && <span className="text-[11px] text-zinc-500 line-through">${product.originalPrice.toFixed(2)}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#141313] border border-[#242222] space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400"><Sparkles className="w-3.5 h-3.5" /><span>Beneficios Comprobados</span></div>
              <div className="space-y-2 text-[11px] text-zinc-300">
                {(product.benefits && product.benefits.length > 0 ? product.benefits : ['Atención y asesoría 24/7 con IA.', 'Garantía de satisfacción de 30 días.', 'Envío express con seguimiento en vivo.']).map((b, i) => (
                  <div key={i} className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /><span>{b}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#141313] border-t border-[#282626] shrink-0 flex items-center gap-2">
          <button type="button" onClick={() => onAskAboutProduct(product)} className="flex-1 py-2 px-3 rounded-xl border border-[#2e2b2b] bg-[#1a1919] hover:bg-[#242222] text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /><span>Preguntar</span>
          </button>
          <button type="button" onClick={() => onDirectCheckout(product)} className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 via-70% to-emerald-600 hover:from-yellow-300 hover:via-orange-400 hover:to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition cursor-pointer">
            <ShoppingBag className="w-3.5 h-3.5" /><span>Comprar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};

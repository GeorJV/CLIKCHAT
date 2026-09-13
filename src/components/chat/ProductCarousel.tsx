import React, { useState } from 'react';
import { Product } from '../../types';
import { Sparkles, Info, Maximize2, ShoppingBag, X, CheckCircle2 } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  isCollapsed: boolean;
  onOpenFullscreen: (product: Product) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  isCollapsed,
  onOpenFullscreen
}) => {
  // Track which product has in-card glassmorphism active ('benefits' | 'details' | null)
  const [activeOverlay, setActiveOverlay] = useState<{ productId: string; mode: 'benefits' | 'details' } | null>(null);

  if (!products || products.length === 0) return null;

  return (
    <div
      className={`carousel-transition w-full bg-slate-900/90 border-b border-slate-800/80 overflow-hidden lg:hidden ${
        isCollapsed
          ? 'max-h-0 opacity-0 my-0 py-0 border-none pointer-events-none'
          : 'max-h-72 opacity-100 py-2.5 my-0'
      }`}
    >
      <div className="px-3.5 mb-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
            Escaparate Móvil (Toca la foto para pantalla completa)
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{products.length} ítems</span>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div className="flex space-x-3 px-3.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
        {products.map((product) => {
          const images = (product.images && product.images.length > 0
            ? product.images
            : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600']
          ).slice(0, 3); // Max 3 images

          const mainImage = images[0];
          const isOverlayOpen = activeOverlay?.productId === product.id;

          return (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[260px] rounded-2xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-xl flex flex-col relative"
            >
              {/* Product Image Area with In-Place Glassmorphic Overlay */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                <img
                  src={mainImage}
                  alt={product.name}
                  onClick={() => onOpenFullscreen(product)}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Fullscreen icon indicator */}
                <span
                  onClick={() => onOpenFullscreen(product)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white/90 backdrop-blur-xs cursor-pointer z-10 hover:bg-black/80"
                >
                  <Maximize2 className="w-3 h-3" />
                </span>

                {/* Price tag */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600/95 text-white text-[11px] font-black backdrop-blur-xs z-10 shadow">
                  ${product.price} {product.currency}
                </span>

                {/* IN-CHAT GLASSMORPHISM OVERLAY: Directly over the photo without leaving chat */}
                {isOverlayOpen && (
                  <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/75 text-white p-2.5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 border border-white/20">
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-300 flex items-center space-x-1">
                        {activeOverlay.mode === 'benefits' ? (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Beneficios Clave</span>
                          </>
                        ) : (
                          <>
                            <Info className="w-3 h-3 text-indigo-400" />
                            <span>Detalles Técnicos</span>
                          </>
                        )}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOverlay(null);
                        }}
                        className="p-1 rounded-full bg-white/15 hover:bg-white/30 text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-1 space-y-1 text-[10px] pr-0.5">
                      {activeOverlay.mode === 'benefits' ? (
                        <ul className="space-y-1">
                          {(product.benefits || ['Garantía oficial', 'Calidad certificada']).map((b, idx) => (
                            <li key={idx} className="flex items-start space-x-1 text-slate-100">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-1 text-slate-200">
                          {product.details && Object.keys(product.details).length > 0 ? (
                            Object.entries(product.details).slice(0, 3).map(([k, v], idx) => (
                              <div key={idx} className="flex justify-between border-b border-white/5 py-0.5">
                                <span className="text-slate-400">{k}:</span>
                                <span className="font-semibold text-white">{String(v)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="line-clamp-3 leading-tight">{product.short_description}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenFullscreen(product)}
                      className="w-full py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white text-center"
                    >
                      Ver Galería Completa
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info & Action Buttons */}
              <div className="p-2 flex flex-col justify-between flex-1 bg-slate-900/90">
                <h3
                  onClick={() => onOpenFullscreen(product)}
                  className="text-xs font-bold text-white truncate cursor-pointer hover:text-indigo-300 transition"
                  title={product.name}
                >
                  {product.name}
                </h3>

                {/* Glassmorphism In-Chat Trigger Buttons */}
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  <button
                    onClick={() => setActiveOverlay({ productId: product.id, mode: 'benefits' })}
                    className="flex items-center justify-center space-x-1 py-1 px-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold backdrop-blur-xs transition border border-white/10 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Beneficios</span>
                  </button>

                  <button
                    onClick={() => setActiveOverlay({ productId: product.id, mode: 'details' })}
                    className="flex items-center justify-center space-x-1 py-1 px-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold backdrop-blur-xs transition border border-white/10 active:scale-95"
                  >
                    <Info className="w-3 h-3 text-indigo-400" />
                    <span>Detalles</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

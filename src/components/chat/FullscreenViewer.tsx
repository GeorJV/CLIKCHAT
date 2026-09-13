import React, { useState } from 'react';
import { Product } from '../../types';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ShoppingCart, Sparkles, Cpu, ArrowRight } from 'lucide-react';

interface FullscreenViewerProps {
  product: Product | null;
  onClose: () => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ product, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!product) return null;

  const rawImages = (product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
  ).slice(0, 3);

  // Total slides = images + 1 final card for Benefits, Details & Big Buy Button
  const totalSlides = rawImages.length + 1;
  const isFinalSlide = currentIdx === rawImages.length;

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-10">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            {isFinalSlide ? 'Propuesta de Valor' : `Foto ${currentIdx + 1} de ${rawImages.length}`}
          </span>
          <h2 className="text-sm font-black truncate max-w-[240px] text-white">{product.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 relative">
        {!isFinalSlide ? (
          /* PHOTO SLIDE */
          <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-slate-800">
            <img
              src={rawImages[currentIdx]}
              alt={`${product.name} - slide ${currentIdx + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Price tag on photo */}
            <span className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-xs font-black shadow-lg">
              ${product.price} {product.currency}
            </span>
          </div>
        ) : (
          /* FINAL CONVERSION CARD: Benefits + Details + Big Buy Button */
          <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-slate-700/80 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                Todo lo que incluye
              </span>
              <h3 className="text-lg font-black text-white">{product.name}</h3>
              <p className="text-2xl font-black text-emerald-400">${product.price} <span className="text-xs text-slate-400 font-medium">{product.currency}</span></p>
            </div>

            {/* Beneficios */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Beneficios Destacados</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {(product.benefits && product.benefits.length > 0 ? product.benefits : ['Garantía oficial', 'Calidad insuperable']).map((b, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detalles Técnicos */}
            {product.details && Object.keys(product.details).length > 0 && (
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-300 uppercase tracking-wide">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Especificaciones Oficiales</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {Object.entries(product.details).map(([k, v], idx) => (
                    <div key={idx} className="flex justify-between py-1 text-[11px]">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-white font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Final Buy Button */}
            <a
              href={product.cta_url || 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-950 flex items-center justify-center space-x-2 active:scale-98 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Realizar Compra • ${product.price} {product.currency}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Carousel Navigation Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button
            onClick={prevSlide}
            className="pointer-events-auto p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="pointer-events-auto p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex space-x-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                i === currentIdx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

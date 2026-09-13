import React from 'react';
import { Product } from '../../types';
import { X, CheckCircle2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

interface GlassDetailModalProps {
  product: Product | null;
  mode: 'benefits' | 'details';
  onClose: () => void;
  onOpenFullscreen: (product: Product) => void;
}

export const GlassDetailModal: React.FC<GlassDetailModalProps> = ({
  product,
  mode,
  onClose,
  onOpenFullscreen
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Glassmorphic Frosted Card */}
      <div className="relative w-full max-w-sm rounded-3xl p-6 overflow-hidden glass-card-frosted text-white border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Subtle glowing orb in the background */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product mini banner */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/20 cursor-pointer"
            onClick={() => onOpenFullscreen(product)}
          />
          <div>
            <h3 className="text-sm font-bold leading-snug line-clamp-1">{product.name}</h3>
            <p className="text-xs text-indigo-300 font-semibold">${product.price} {product.currency}</p>
          </div>
        </div>

        {/* Header Title */}
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-white/10">
          {mode === 'benefits' ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold tracking-wide uppercase text-amber-200">
                Beneficios Exclusivos
              </h4>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold tracking-wide uppercase text-indigo-200">
                Detalles Técnicos y Materiales
              </h4>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 text-sm">
          {mode === 'benefits' ? (
            <ul className="space-y-2">
              {(product.benefits && product.benefits.length > 0
                ? product.benefits
                : ['Alta calidad certificada', 'Satisfacción 100% garantizada', 'Diseño ergonómico premium']
              ).map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2 text-xs">
              {Object.entries(product.details || {}).length > 0 ? (
                Object.entries(product.details).map(([key, val], idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300 font-medium">{key}:</span>
                    <span className="text-white font-semibold text-right max-w-[170px]">{String(val)}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-300 text-xs leading-relaxed">{product.full_description}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-white/10 flex space-x-2">
          <button
            onClick={() => onOpenFullscreen(product)}
            className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition text-center"
          >
            Ver Fotos HD
          </button>
          <a
            href={product.cta_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition text-center shadow-lg shadow-indigo-600/30"
          >
            {product.cta_label || 'Comprar'}
          </a>
        </div>
      </div>
    </div>
  );
};

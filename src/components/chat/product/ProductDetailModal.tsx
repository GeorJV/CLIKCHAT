import React from 'react';
import { X, Sparkles, FileText, Check, CreditCard } from 'lucide-react';
import { ProductItem } from '../../../types/productChat';

interface Props {
  product: ProductItem | null;
  mode: 'benefits' | 'specs';
  onClose: () => void;
  onProceedBuy: (p: ProductItem) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  mode,
  onClose,
  onProceedBuy,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-[#181717] border border-[#282626] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282626] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {mode === 'benefits' ? <Sparkles className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {mode === 'benefits' ? 'Beneficios Principales' : 'Detalle del Producto'}
              </h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-[240px] sm:max-w-md">{product.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222020] hover:bg-[#2c2929] text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs">
          {mode === 'benefits' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(product.benefits && product.benefits.length > 0 ? product.benefits : [
                'Garantía de satisfacción y soporte prioritario 24/7.',
                'Fabricado con materiales de alta gama y durabilidad comprobada.',
                'Entrega express con seguimiento en tiempo real vía WhatsApp.'
              ]).map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141313] border border-[#242222] text-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#141313] border border-[#242222] space-y-2 flex flex-col justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Descripción</span>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  {product.description || 'Producto oficial verificado en el catálogo digital de Clikchat.'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141313] border border-[#242222] space-y-2 flex flex-col justify-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Especificaciones</span>
                {product.specifications ? (
                  Object.entries(product.specifications).map(([k, v], i) => (
                    <div key={i} className="flex justify-between border-b border-[#242222] pb-1.5 last:border-0 last:pb-0">
                      <span className="text-zinc-400 capitalize">{k}:</span>
                      <span className="text-white font-semibold text-right">{String(v)}</span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#242222] pb-1.5">
                      <span className="text-zinc-400">Categoría:</span>
                      <span className="text-white font-semibold">{product.category || 'General'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#242222] pb-1.5">
                      <span className="text-zinc-400">Disponibilidad:</span>
                      <span className="text-emerald-400 font-semibold">{product.stock > 0 ? `${product.stock} disponibles` : 'Bajo pedido'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Garantía:</span>
                      <span className="text-white font-semibold">30 días de satisfacción</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center gap-2 border-t border-[#282626]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#222020] hover:bg-[#2c2929] text-zinc-300 font-bold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onProceedBuy(product)}
            className="group relative flex-1 h-10 px-3 cuadro-amarillo-tornasol overflow-hidden flex items-center justify-center font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-10 group-hover:opacity-0 relative z-10">
              <span className="text-white font-black text-sm tracking-wide drop-shadow-sm">
                ${product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 ease-out transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
              <CreditCard className="w-3.5 h-3.5 text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.6)] shrink-0" />
              <span className="font-['Cinzel',serif] text-xs font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#FFF2B2] via-[#FFD700] to-[#E5A823] bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Comprar Ahora
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

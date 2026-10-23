import React, { useState } from 'react';
import { Product } from '../../types';
import { CheckCircle2, ShoppingCart, Sparkles, Info, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { broadcastProductMetric } from '../../utils/metricsSync';

interface DesktopProductShowcaseProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onOpenFullscreen: (product: Product) => void;
}

export const DesktopProductShowcase: React.FC<DesktopProductShowcaseProps> = ({
  products, selectedProduct, onSelectProduct, onOpenFullscreen
}) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'details'>('benefits');
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const product = selectedProduct || products[0];
  if (!product || (!product.name && !product.title) || (!product.images?.length && !product.image)) return null;

  const images = (product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])).slice(0, 3);
  if (images.length === 0) return null;

  const nextImage = () => setCurrentImgIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="hidden lg:flex flex-col h-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sticky top-4 overflow-y-auto">
      {/* Header Selector */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Escaparate Exclusivo</span>
          <h2 className="text-base font-black text-white truncate max-w-[280px]">{product.name || product.title}</h2>
        </div>
        {products.length > 1 && (
          <select
            value={product.id}
            onChange={(e) => {
              const f = products.find(p => p.id === e.target.value);
              if (f) { onSelectProduct(f); setCurrentImgIdx(0); }
            }}
            className="text-xs bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            {products.map((p) => (<option key={p.id} value={p.id}>{p.name || p.title} (${p.price})</option>))}
          </select>
        )}
      </div>

      {/* 1. Foto del Producto */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-inner">
        <img
          src={images[currentImgIdx]} alt={product.name || product.title}
          onClick={() => onOpenFullscreen(product)}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextImage} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-1.5">
              {images.map((_, i) => (
                <span key={i} onClick={() => setCurrentImgIdx(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === currentImgIdx ? 'w-6 bg-indigo-400' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-xs font-black shadow-lg">
          ${product.price} {product.currency}
        </span>
      </div>

      {/* 2. Dos Botones: Beneficios y Detalles */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => {
            setActiveTab('benefits');
            if (product.id) {
              broadcastProductMetric(product.id, 'benefit_view');
              fetch(`/api/products/${product.id}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'benefit_view' }) }).catch(() => {});
            }
          }}
          className={`py-2 px-3 text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 group cursor-pointer ${activeTab === 'benefits' ? 'cuadro-tornasol active !border-cyan-400/60 shadow-lg text-white' : 'cuadro-tornasol hover:opacity-100 text-zinc-300'}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-300 transition-colors relative z-10" />
          <span className="relative z-10">Beneficios</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('details');
            if (product.id) {
              broadcastProductMetric(product.id, 'detail_view');
              fetch(`/api/products/${product.id}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'detail_view' }) }).catch(() => {});
            }
          }}
          className={`py-2 px-3 text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 group cursor-pointer ${activeTab === 'details' ? 'cuadro-tornasol active !border-cyan-400/60 shadow-lg text-white' : 'cuadro-tornasol hover:opacity-100 text-zinc-300'}`}
        >
          <Info className="w-3.5 h-3.5 text-zinc-400 group-hover:text-teal-300 transition-colors relative z-10" />
          <span className="relative z-10">Detalles del Producto</span>
        </button>
      </div>

      {/* Content Area for Tabs */}
      <div className="flex-1 my-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-y-auto text-xs min-h-[140px] max-h-[190px]">
        {activeTab === 'benefits' ? (
          <ul className="space-y-2">
            {(product.benefits || []).map((b, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{b}</span>
              </li>
            ))}
            {(!product.benefits || product.benefits.length === 0) && (
              <li className="text-slate-500 italic py-2">Sin beneficios especificados para este producto.</li>
            )}
          </ul>
        ) : (
          <div className="space-y-2 text-slate-300">
            {product.details && Object.keys(product.details).length > 0 ? (
              Object.entries(product.details).map(([key, val], idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 font-medium">{key}:</span>
                  <span className="text-white font-semibold text-right">{String(val)}</span>
                </div>
              ))
            ) : (
              <p className="leading-relaxed">{product.full_description || product.short_description || 'Sin descripción adicional.'}</p>
            )}
          </div>
        )}
      </div>

      {/* 3. CTA */}
      <div className="pt-2">
        <a
          href={product.cta_url || 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar'}
          target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 cuadro-amarillo-tornasol text-[#16120C] group-hover:text-white font-extrabold text-sm shadow-xl active:scale-98 transition group cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-[#16120C] group-hover:text-[#FFD700] transition-colors relative z-10" />
          <span className="relative z-10">Realizar Compra • ${product.price} {product.currency}</span>
        </a>
        <div className="flex items-center justify-center space-x-2 mt-2 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pago 100% Seguro & Garantía de Compra</span>
        </div>
      </div>
    </div>
  );
};

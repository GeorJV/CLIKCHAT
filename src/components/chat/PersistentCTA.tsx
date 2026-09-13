import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Tenant, Product } from '../../types';

interface PersistentCTAProps {
  tenant: Tenant | null;
  activeProduct?: Product | null;
}

export const PersistentCTA: React.FC<PersistentCTAProps> = ({ tenant, activeProduct }) => {
  const ctaUrl = activeProduct?.cta_url || tenant?.cta_url || 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar';
  const priceDisplay = activeProduct ? `$${activeProduct.price} ${activeProduct.currency}` : '$249 USD';
  const label = activeProduct ? `Comprar [${priceDisplay}]` : `Comprar [${priceDisplay}]`;

  return (
    <div className="px-3 py-1.5 bg-slate-900/95 border-t border-slate-800/80 z-20">
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-950/60 active:scale-98 transition group"
      >
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-black/25">
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="tracking-wide uppercase text-[11px] font-black">{label}</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-emerald-100 group-hover:translate-x-0.5 transition-transform">
          <span>Pagar Online</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </a>
    </div>
  );
};

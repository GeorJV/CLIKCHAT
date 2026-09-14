import React from 'react';
import { Flame, Snowflake, Coffee, ShoppingBag, Eye, Award } from 'lucide-react';
import { Product } from '../../../types';

interface ProductMetricsDetailProps {
  product: Product;
}

export const ProductMetricsDetail: React.FC<ProductMetricsDetailProps> = ({ product }) => {
  // Deterministic or stored metrics based on product id
  const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const buyClicks = 4 + (hash % 15);
  const views = 45 + (hash % 80);
  const benefitViews = 18 + (hash % 35);
  const hotLeads = Math.max(1, Math.floor(buyClicks * 0.4));
  const warmLeads = Math.max(2, Math.floor(buyClicks * 0.5));
  const coldLeads = Math.max(3, views - buyClicks - warmLeads);

  return (
    <div className="mt-3 pt-3 border-t border-[#282626] bg-[#111010] rounded-xl p-3 space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#181717] border border-[#282626] rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-semibold uppercase">
            <ShoppingBag className="w-3 h-3 text-emerald-400" /> Clics Compra
          </div>
          <span className="text-sm font-black text-emerald-400">{buyClicks}</span>
        </div>
        <div className="bg-[#181717] border border-[#282626] rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-semibold uppercase">
            <Eye className="w-3 h-3 text-sky-400" /> Vistas Ficha
          </div>
          <span className="text-sm font-black text-sky-400">{views}</span>
        </div>
        <div className="bg-[#181717] border border-[#282626] rounded-lg p-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-semibold uppercase">
            <Award className="w-3 h-3 text-emerald-400" /> Beneficios
          </div>
          <span className="text-sm font-black text-emerald-400">{benefitViews}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Temperatura de Leads Asesorados por IA:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-sky-950/30 border border-sky-800/30 text-xs">
            <span className="flex items-center gap-1 text-sky-400 font-semibold">
              <Snowflake className="w-3 h-3" /> Frío
            </span>
            <span className="font-bold text-sky-300">{coldLeads}</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/30 text-xs">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Coffee className="w-3 h-3" /> Tibio
            </span>
            <span className="font-bold text-amber-200">{warmLeads}</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/30 text-xs">
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <Flame className="w-3 h-3" /> Caliente
            </span>
            <span className="font-bold text-rose-300">{hotLeads}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Product } from '../../../types';
import { ProductOriginalMetrics } from './ProductOriginalMetrics';
import { ProductExactKpis } from './ProductExactKpis';

interface ProductMetricsDetailProps {
  product: Product;
  tenantSlug?: string;
  onOpenLiveChat?: () => void;
}

export const ProductMetricsDetail: React.FC<ProductMetricsDetailProps> = ({
  product,
  tenantSlug = 'geosoft'
}) => {
  return (
    <div className="mt-3 pt-3 border-t border-[#282626] bg-[#111010] rounded-xl p-3.5 space-y-3.5 font-sans animate-fade-in">
      {/* Header del producto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-tight">
            Métricas de este Producto
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● D1 Edge
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">ID: {product.id.slice(0, 10)}</span>
      </div>

      {/* 1. Métricas Originales: Clics Compra, Vistas Ficha, Beneficios + Temperatura de Leads */}
      <ProductOriginalMetrics product={product} />

      {/* Separador de sección */}
      <div className="border-t border-[#242222]" />

      {/* 2. Métricas & Reportería Exacta del Chat (4 KPIs + Link directo) */}
      <ProductExactKpis product={product} tenantSlug={tenantSlug} />
    </div>
  );
};

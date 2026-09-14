import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronRight, ChevronDown, X } from 'lucide-react';
import { Product } from '../../../types';
import { ProductMetricsDetail } from './ProductMetricsDetail';

interface ProductCardProps {
  product: Product;
  tenantSlug: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  tenantSlug,
  onEdit,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const qlinkUrl = `https://clikchat.pages.dev/?t=${tenantSlug}&p=${product.id}`;
  const displayUrl = `https://qchatt.pages.dev/165/p/${product.slug || product.id.slice(0, 8)}...`;
  const storeUrl = `https://clikchat.pages.dev/?t=${tenantSlug}`;

  const defaultImg = product.name.toLowerCase().includes('zapato')
    ? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  const imageUrl = product.images?.[0] || defaultImg;
  const sku = product.details?.sku || `SKU-${product.id.slice(0, 10)}`;
  const category = product.details?.category || 'General';

  const handleCopy = () => {
    navigator.clipboard.writeText(qlinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition">
      <div>
        {/* Product Image with Overlay Badge */}
        <div className="relative rounded-xl overflow-hidden h-44 sm:h-48 w-full bg-[#0b0c0e]">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-[#0a2720]/90 backdrop-blur-sm border border-emerald-500/50 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Activo para Bot</span>
          </div>
        </div>

        {/* Title & Price */}
        <div className="flex items-start justify-between gap-3 mt-4">
          <h3 className="font-bold text-white text-base truncate flex-1">{product.name}</h3>
          <span className="text-emerald-400 font-extrabold text-sm whitespace-nowrap">
            ${Number(product.price).toFixed(2)} {product.currency || 'USD'}
          </span>
        </div>

        {/* Meta info */}
        <p className="text-xs text-slate-400 mt-0.5">
          Cat: <span className="text-slate-300">{category}</span> • SKU: <span className="text-slate-300">{sku}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {product.short_description || product.full_description || 'Sin descripción detallada.'}
        </p>

        {/* QLink Box */}
        <div className="onyx-surface rounded-xl p-3 mt-3.5 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            QLINK DE VENTA DIRECTA
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#0b0c0e] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono truncate">
              {displayUrl}
            </div>
            <a
              href={qlinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#0e1e27] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </a>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar QLink'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Accordion Header */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-3 text-xs">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-1.5 font-bold tracking-wider text-slate-300 hover:text-white uppercase transition text-left"
          >
            {showMetrics ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <span>MÉTRICAS & REPORTERÍA EXACTA</span>
          </button>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-1.5 text-emerald-400 hover:underline font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>En Vivo</span>
            <span className="text-slate-400 hover:text-emerald-300 ml-1">Ver métricas</span>
          </button>
        </div>

        {/* Expanded Metrics Details */}
        {showMetrics && <ProductMetricsDetail product={product} />}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-4">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
        >
          <span>Ver tienda web</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 bg-[#121f28] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-slate-400 hover:text-red-400 p-1 transition"
            title="Eliminar producto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

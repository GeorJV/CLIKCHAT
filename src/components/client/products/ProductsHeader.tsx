import React from 'react';
import { ShoppingBag, Plus, ExternalLink, FileSpreadsheet } from 'lucide-react';

interface ProductsHeaderProps {
  onOpenCreate: () => void;
  onOpenExcelImport?: () => void;
  tenantSlug?: string;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  onOpenCreate,
  onOpenExcelImport,
  tenantSlug = 'acme-store'
}) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://clikchat.pages.dev';
  const storeUrl = `${origin}/?t=${tenantSlug}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Lado izquierdo: Título + Botón Nuevo producto + Botón Importar Excel */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              Productos & QLinks de Venta Directa
            </h2>
            <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
              Gestiona tu catálogo, copia QLinks y revisa métricas en tiempo real.
            </p>
          </div>
        </div>

        {/* Botón "+ Nuevo producto" */}
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0 ml-1"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Nuevo producto</span>
        </button>

        {/* Botón "Importar Excel" */}
        {onOpenExcelImport && (
          <button
            type="button"
            onClick={onOpenExcelImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1e] hover:bg-[#2a2727] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            title="Importar catálogo masivo desde Excel (.xlsx) o CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Importar Excel</span>
          </button>
        )}
      </div>

      {/* Lado derecho: Enlace a la tienda web para aprovechar el espacio superior derecho */}
      <div className="flex items-center gap-2">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition px-3 py-1.5 rounded-lg border border-[#282626] bg-[#181717] hover:border-[#383535]"
        >
          <span>Ver tienda web</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

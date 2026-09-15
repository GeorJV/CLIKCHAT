import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onOpenCreate }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Productos & QLinks de Venta Directa
          </h2>
          <p className="text-[11px] text-slate-400">
            Gestiona tu catálogo, copia QLinks y revisa métricas en tiempo real.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenCreate}
        className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Nuevo producto</span>
      </button>
    </div>
  );
};

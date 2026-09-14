import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onOpenCreate }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Productos & QLinks de Venta Directa</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestiona tu catálogo, copia QLinks y revisa métricas en tiempo real.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenCreate}
        className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
      >
        <span>+ + Nuevo producto</span>
      </button>
    </div>
  );
};

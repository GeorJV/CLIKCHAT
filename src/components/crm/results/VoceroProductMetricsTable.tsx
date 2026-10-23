import React from 'react';
import { Product } from '../../../types';

interface VoceroProductMetricsTableProps {
  products: Product[];
  currency?: string;
  selectedProdId: string;
  onSelectProdId: (id: string) => void;
}

export const VoceroProductMetricsTable: React.FC<VoceroProductMetricsTableProps> = ({
  products,
  currency = 'CRC',
  selectedProdId,
  onSelectProdId
}) => {
  if (products.length === 0) {
    return <p className="text-xs text-[#8391aa] text-center py-8">No hay productos para mostrar en este filtro.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#e2e8f0] text-[#8391aa] font-semibold">
            <th className="pb-3 pl-1">Producto</th>
            <th className="pb-3 text-center">Clics</th>
            <th className="pb-3 text-center">Vio Foto</th>
            <th className="pb-3 text-center">Chat IA</th>
            <th className="pb-3 text-center">Agregó</th>
            <th className="pb-3 text-center">No Agregó</th>
            <th className="pb-3 text-center">Clic Comprar</th>
            <th className="pb-3 text-center">Compró y Quitó</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {products.map((p) => {
            const m = p.metrics || ({} as any);
            const isSelected = selectedProdId === p.id;
            return (
              <tr
                key={p.id}
                onClick={() => onSelectProdId(p.id)}
                className={`hover:bg-[#f8fafc] transition cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
              >
                <td className="py-3 pl-1">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center overflow-hidden shrink-0">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-[#8391aa]">🍴</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#0a1730] leading-tight">{p.name}</p>
                      <p className="text-[10px] text-[#62728d] leading-tight">{currency} {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-center font-semibold text-[#0a1730]">{m.views || 0}</td>
                <td className="py-3 text-center font-semibold text-purple-700">{m.photoViews || 0}</td>
                <td className="py-3 text-center font-semibold text-blue-600">{m.chatInteractions || 0}</td>
                <td className="py-3 text-center font-bold text-emerald-600">{m.addedToCart || 0}</td>
                <td className="py-3 text-center text-amber-600">{m.notAdded || 0}</td>
                <td className="py-3 text-center font-bold text-[#0d5bff]">{m.buyClicks || 0}</td>
                <td className="py-3 text-center font-bold text-rose-600">{m.removedFromCart || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

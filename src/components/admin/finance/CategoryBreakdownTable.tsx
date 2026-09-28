import React from 'react';
import { PieChart, Store } from 'lucide-react';
import { IndustryCategoryMetric } from '../../../types/adminFinance';

interface Props {
  categories?: IndustryCategoryMetric[];
}

export const CategoryBreakdownTable: React.FC<Props> = ({ categories = [] }) => {
  return (
    <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-indigo-400" />
          <h3 className="font-bold text-xs sm:text-sm text-white">
            Monitor de Negocios y Categorías Registradas
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Base de Datos Cloudflare D1</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Categoría de Industria</th>
              <th className="py-2.5 px-3 text-center">Negocios Activos</th>
              <th className="py-2.5 px-3 text-right">Ingreso Generado</th>
              <th className="py-2.5 px-3 text-center">Participación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400">
                  Sin datos de industrias registrados.
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                    <Store size={14} className="text-emerald-400 shrink-0" />
                    <span className="capitalize">{cat.category}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-300">
                    {cat.merchant_count}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                    ${cat.total_category_revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, cat.percentage)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {cat.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

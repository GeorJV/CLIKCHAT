import React from 'react';
import { Calendar, DollarSign, ArrowUpRight, Activity, TrendingUp } from 'lucide-react';
import { CashFlowMetrics } from '../../../types/adminFinance';

interface Props {
  cashFlow?: CashFlowMetrics;
}

export const CashFlowProjections: React.FC<Props> = ({ cashFlow }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Hoy */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold uppercase text-slate-400">Pagos "Hoy"</span>
          <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
            <Calendar size={16} />
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white font-mono">
          ${(cashFlow?.today || 0).toLocaleString()}
        </p>
        <p className="text-[10px] text-emerald-400 font-semibold pt-0.5 flex items-center gap-1">
          <ArrowUpRight size={13} />
          <span>Cobros agendados para hoy</span>
        </p>
      </div>

      {/* Mañana */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold uppercase text-slate-400">Pagos "Mañana"</span>
          <span className="p-1.5 rounded-lg bg-blue-950 text-blue-400">
            <Calendar size={16} />
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white font-mono">
          ${(cashFlow?.tomorrow || 0).toLocaleString()}
        </p>
        <p className="text-[10px] text-blue-400 font-semibold pt-0.5 flex items-center gap-1">
          <Activity size={13} />
          <span>Proyección a 24 horas</span>
        </p>
      </div>

      {/* Esta Semana */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold uppercase text-slate-400">Proyectado "Esta Semana"</span>
          <span className="p-1.5 rounded-lg bg-purple-950 text-purple-400">
            <DollarSign size={16} />
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
          ${(cashFlow?.thisWeek || 0).toLocaleString()}
        </p>
        <p className="text-[10px] text-purple-400 font-semibold pt-0.5 flex items-center gap-1">
          <TrendingUp size={13} />
          <span>Suma total 7 días continuos</span>
        </p>
      </div>
    </div>
  );
};

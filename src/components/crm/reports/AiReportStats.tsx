import React from 'react';
import { ShieldCheck, Zap, AlertTriangle, Cpu } from 'lucide-react';
import { AiReportsSummary } from '../../../types/aiReports';

interface AiReportStatsProps {
  summary: AiReportsSummary;
  activeModelName?: string;
}

export const AiReportStats: React.FC<AiReportStatsProps> = ({ summary, activeModelName = 'Modelo 1: GLM 5' }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="p-3.5 rounded-2xl bg-white border border-[#e8edf6] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-[#62728d]">
          <span className="text-[11px] font-semibold">Salud del Sistema</span>
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-xl font-bold text-[#0a1730]">{summary.healthRate.toFixed(1)}%</p>
        <p className="text-[10px] text-emerald-600 font-medium">Protección de 3 modelos activa</p>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#e8edf6] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-[#62728d]">
          <span className="text-[11px] font-semibold">Consultas Rescatadas</span>
          <Zap className="h-4 w-4 text-[#0d5bff]" />
        </div>
        <p className="text-xl font-bold text-[#0d5bff]">{summary.rescued}</p>
        <p className="text-[10px] text-[#62728d]">Atendidas por modelo de respaldo</p>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#e8edf6] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-[#62728d]">
          <span className="text-[11px] font-semibold">Incidentes Registrados</span>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <p className="text-xl font-bold text-[#0a1730]">{summary.total}</p>
        <p className="text-[10px] text-amber-600 font-medium">{summary.pending} pendientes de revisar</p>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#e8edf6] shadow-xs space-y-1">
        <div className="flex items-center justify-between text-[#62728d]">
          <span className="text-[11px] font-semibold">Modelo Principal</span>
          <Cpu className="h-4 w-4 text-indigo-500" />
        </div>
        <p className="text-xs font-bold text-[#0a1730] truncate" title={activeModelName}>{activeModelName}</p>
        <p className="text-[10px] text-[#62728d]">Cascada: 1° ⟷ 2° ⟷ 3°</p>
      </div>
    </div>
  );
};

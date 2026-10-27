import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { AiIncidentReport } from '../../../types/aiReports';

interface AiReportCardProps {
  report: AiIncidentReport;
  onResolve: (id: string) => Promise<void>;
  onOpenLead?: (sessionId?: string) => void;
}

export const AiReportCard: React.FC<AiReportCardProps> = ({ report, onResolve, onOpenLead }) => {
  const isResolved = report.status === 'resolved';

  return (
    <div className={`p-4 rounded-2xl border transition ${
      isResolved ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-80' : 'bg-white border-[#fecdd3] shadow-xs hover:border-[#fda4af]'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldAlert className="h-3 w-3" /> {report.failed_model}
          </span>
          {report.fallback_model && (
            <>
              <ArrowRight className="h-3 w-3 text-[#94a3b8]" />
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Rescatado por: {report.fallback_model}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#62728d]">
          <Clock className="h-3 w-3" />
          <span>{new Date(report.created_at).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}</span>
        </div>
      </div>

      <div className="py-2.5 space-y-1.5">
        <div className="text-xs text-[#0a1730]">
          <span className="font-bold text-[#42506b]">Consulta del Cliente: </span>
          <span className="italic bg-[#f1f5f9] px-2 py-0.5 rounded text-[#0f172a]">"{report.user_query}"</span>
        </div>
        <div className="text-[11px] text-[#62728d]">
          <span className="font-semibold text-rose-500">Motivo del fallo: </span>
          <span>{report.error_message || 'Fallo de conexión o límite de cuota momentáneo'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
          isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isResolved ? '✅ Solucionado' : '⚡ Atendido por Respaldo (Requiere Revisión)'}
        </span>

        <div className="flex items-center gap-2">
          {onOpenLead && report.session_id && (
            <button
              onClick={() => onOpenLead(report.session_id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#0d5bff] hover:bg-blue-50 transition cursor-pointer"
            >
              <MessageSquare className="h-3 w-3" /> Atender Consulta
            </button>
          )}
          {!isResolved && (
            <button
              onClick={() => onResolve(report.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0d5bff] hover:bg-[#0047e1] text-white transition shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="h-3 w-3" /> Marcar Solucionado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

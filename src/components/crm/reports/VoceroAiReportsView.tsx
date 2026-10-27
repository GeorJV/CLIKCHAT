import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Filter, CheckCircle2 } from 'lucide-react';
import { AiIncidentReport, AiReportsSummary } from '../../../types/aiReports';
import { AiReportStats } from './AiReportStats';
import { AiReportCard } from './AiReportCard';

interface VoceroAiReportsViewProps {
  tenantSlug: string;
  tenantId?: string;
  onOpenInboxLead?: (sessionId?: string) => void;
}

export const VoceroAiReportsView: React.FC<VoceroAiReportsViewProps> = ({ tenantSlug, tenantId, onOpenInboxLead }) => {
  const [reports, setReports] = useState<AiIncidentReport[]>([]);
  const [summary, setSummary] = useState<AiReportsSummary>({
    total: 0, rescued: 0, pending: 0, resolved: 0, healthRate: 100, failuresByModel: {}
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai-reports?tenant=${encodeURIComponent(tenantSlug)}&_t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch (e) {
      console.warn('Error loading AI reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [tenantSlug]);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch('/api/ai-reports/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tenantSlug })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
        setSummary(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          resolved: prev.resolved + 1
        }));
      }
    } catch (e) {
      console.warn('Error resolving report:', e);
    }
  };

  const filteredReports = reports.filter(r => {
    if (filter === 'pending') return r.status !== 'resolved';
    if (filter === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-6 font-sans space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e8edf6] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#0a1730] flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" /> Centro de Reportes & Monitoreo de IA
          </h2>
          <p className="text-xs text-[#62728d]">
            Supervisión continua en tiempo real de los 3 modelos (GLM 5, GPT y Meta). Salto automático en caso de fallo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d8e2f0] bg-white hover:bg-[#f1f5f9] text-[#42506b] text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      <AiReportStats summary={summary} />

      <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] pb-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#42506b] font-semibold">
          <Filter className="h-3.5 w-3.5 text-[#0d5bff]" />
          <span>Filtrar reportes:</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#e2e8f0]">
          {(['all', 'pending', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === tab ? 'bg-[#0d5bff] text-white shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
              }`}
            >
              {tab === 'all' ? `Todos (${reports.length})` : tab === 'pending' ? `Pendientes (${summary.pending})` : `Solucionados (${summary.resolved})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e8edf6] space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#0a1730]">¡Excelente! Cero incidentes sin atender</h3>
            <p className="text-xs text-[#62728d] max-w-md mx-auto">
              Todos los modelos de IA están respondiendo con normalidad o los incidentes previos han sido resueltos.
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <AiReportCard key={report.id} report={report} onResolve={handleResolve} onOpenLead={onOpenInboxLead} />
          ))
        )}
      </div>
    </div>
  );
};

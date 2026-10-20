import React, { useState } from 'react';
import { VoceroLead } from '../../../types/crm';
import { BarChart3, TrendingUp, Users, DollarSign, Sparkles, ExternalLink, QrCode, Copy, Check } from 'lucide-react';

interface VoceroResultsViewProps {
  leads: VoceroLead[];
  tenantSlug: string;
  currency?: string;
}

export const VoceroResultsView: React.FC<VoceroResultsViewProps> = ({
  leads,
  tenantSlug,
  currency = 'CRC'
}) => {
  const [copied, setCopied] = useState(false);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'closed_won').length;
  const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const publicUrl = `https://clikchat.pages.dev/chat/${tenantSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Resultados Comerciales</h2>
          <span className="vocero-kicker ml-2">Métricas en Tiempo Real</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#8391aa] mb-2">
              <span className="text-xs font-semibold">Leads Totales</span>
              <Users className="h-4 w-4 text-[#0d5bff]" />
            </div>
            <p className="text-2xl font-bold text-[#0a1730]">{totalLeads}</p>
            <p className="text-[11px] text-[#0f8b44] font-medium mt-1">Registrados en CRM</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#8391aa] mb-2">
              <span className="text-xs font-semibold">Valor en Pipeline</span>
              <DollarSign className="h-4 w-4 text-[#0d5bff]" />
            </div>
            <p className="text-2xl font-bold text-[#0a1730]">
              {currency} {totalPipelineValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#62728d] font-medium mt-1">En embudo de venta</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#8391aa] mb-2">
              <span className="text-xs font-semibold">Ventas Cerradas</span>
              <TrendingUp className="h-4 w-4 text-[#10b981]" />
            </div>
            <p className="text-2xl font-bold text-[#0a1730]">{wonLeads}</p>
            <p className="text-[11px] text-[#0f8b44] font-medium mt-1">Clientes ganados</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#8391aa] mb-2">
              <span className="text-xs font-semibold">Tasa de Conversión</span>
              <Sparkles className="h-4 w-4 text-[#00c6f5]" />
            </div>
            <p className="text-2xl font-bold text-[#0a1730]">{conversionRate}%</p>
            <p className="text-[11px] text-[#62728d] font-medium mt-1">Cierres sobre leads</p>
          </div>
        </div>

        {/* Tarjeta de Difusión Comercial */}
        <div className="rounded-2xl border border-[#d8e2f0] bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#0a1730] mb-1">Enlace Público de tu Agente Virtual</h3>
              <p className="text-xs text-[#62728d]">
                Comparte este link en tus historias de Instagram, biografía, Facebook o código QR para recibir clientes directamente.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs font-bold text-[#0a1730] hover:bg-[#edf2f9] transition cursor-pointer"
              >
                <span>Abrir Chat</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0047e1] transition cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] font-mono text-xs text-[#0a1730] select-all truncate">
            {publicUrl}
          </div>
        </div>
      </main>
    </div>
  );
};

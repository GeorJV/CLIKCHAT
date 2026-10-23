import React, { useState } from 'react';
import { VoceroLead } from '../../../types/crm';
import { TrendingUp, Users, DollarSign, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';

interface VoceroCommercialOverviewProps {
  leads: VoceroLead[];
  tenantSlug: string;
  currency?: string;
}

export const VoceroCommercialOverview: React.FC<VoceroCommercialOverviewProps> = ({
  leads,
  tenantSlug,
  currency = 'CRC'
}) => {
  const [copied, setCopied] = useState(false);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'won' || (l as any).stage === 'closed_won').length;
  const totalPipelineValue = leads.reduce((acc, curr) => acc + (Number(curr.deal_value || (curr as any).value) || 0), 0);
  const wonValue = leads.filter(l => l.stage === 'won' || (l as any).stage === 'closed_won').reduce((acc, curr) => acc + (Number(curr.deal_value || (curr as any).value) || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const waLeads = leads.filter(l => l.channel === 'whatsapp').length;
  const webLeads = leads.filter(l => l.channel === 'web' || l.channel === 'clikchat').length;

  const crmHost = (typeof window !== 'undefined' && (window.location.hostname.includes('clikchatcrm') || window.location.hostname.includes('localhost')))
    ? window.location.origin
    : 'https://clikchatcrm.pages.dev';
  const publicUrl = `${crmHost}/chat/${tenantSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
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

      {/* Desglose por Canales & Rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#0a1730] mb-3">Distribución por Canales</h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-[#0a1730] mb-1">
                <span>WhatsApp Oficial</span>
                <span>{waLeads} leads ({totalLeads > 0 ? Math.round((waLeads / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#10b981]" style={{ width: `${totalLeads > 0 ? (waLeads / totalLeads) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-[#0a1730] mb-1">
                <span>Chat Web & Redes</span>
                <span>{webLeads} leads ({totalLeads > 0 ? Math.round((webLeads / totalLeads) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#0d5bff]" style={{ width: `${totalLeads > 0 ? (webLeads / totalLeads) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0a1730] mb-1">Ingresos Cerrados por IA</h3>
            <p className="text-xs text-[#62728d]">Ventas concretadas por el bot en piloto automático</p>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black font-mono text-[#0f8b44]">
              {currency} {wonValue.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-[#8391aa]">
            Canalizado directamente a comanda y WhatsApp de despacho
          </div>
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
    </div>
  );
};

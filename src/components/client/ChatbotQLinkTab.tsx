import React from 'react';
import { Tenant } from '../../types';
import { TenantExactMetrics } from './metrics/TenantExactMetrics';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface ChatbotQLinkTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onOpenLiveChat?: () => void;
}

export const ChatbotQLinkTab: React.FC<ChatbotQLinkTabProps> = ({
  tenant,
  tenantSlug,
  onOpenLiveChat
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Módulo de Métricas y Reportería Exacta */}
      <TenantExactMetrics
        tenantId={tenant?.id}
        tenantSlug={tenantSlug}
        onOpenLiveChat={onOpenLiveChat}
      />

      {/* 2. RAG Diagnostics Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        <div className="onyx-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">1. RAG Caché Semántico</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Coincidencias $\ge 0.88$ se responden en &lt; 15 ms con <strong>costo $0</strong> y sin tocar el LLM.
          </p>
          <div className="text-[10px] text-emerald-400 font-bold bg-[#141313] px-2.5 py-1 rounded-lg border border-[#282626] inline-block">
            ⚡ Early Stopping Activado
          </div>
        </div>

        <div className="onyx-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-zinc-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">2 & 3. Fichas D1 + Manuales</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Precios exactos de Cloudflare D1 + Fragmentos de manuales para asesorar con la verdad.
          </p>
          <div className="text-[10px] text-zinc-300 font-bold bg-[#141313] px-2.5 py-1 rounded-lg border border-[#282626] inline-block">
            ⚡ SQL Determinista + Chunks
          </div>
        </div>

        <div className="onyx-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">4. Memoria Continua</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Recuerda el nombre, preferencias y el hilo de la charla sin olvidar productos en discusión.
          </p>
          <div className="text-[10px] text-amber-400 font-bold bg-[#141313] px-2.5 py-1 rounded-lg border border-[#282626] inline-block">
            ⚡ Persistencia en D1
          </div>
        </div>
      </div>
    </div>
  );
};

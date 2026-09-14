import React, { useState } from 'react';
import { Tenant } from '../../types';
import { Bot, Copy, Check, ExternalLink, QrCode, Sparkles, ShieldCheck, Zap } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const publicUrl = `https://clikchat.pages.dev?t=${tenantSlug || 'acme-store'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Link and QR Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {tenant?.bot_name || 'Sofía'} — Enlace Directo QLink
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Comparte este enlace con tus clientes por WhatsApp, Instagram o ponlo en tu sitio web.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold transition shadow-sm border border-slate-750"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar QLink'}</span>
            </button>
            {onOpenLiveChat && (
              <button
                onClick={onOpenLiveChat}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Probar Chat en Pantalla Completa</span>
              </button>
            )}
          </div>
        </div>

        {/* URL Pill */}
        <div className="mt-4 flex items-center justify-between bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
          <span>{publicUrl}</span>
          <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 ml-2 whitespace-nowrap">
            ? Activo 24/7
          </span>
        </div>
      </div>

      {/* RAG Diagnostics Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">1. RAG Caché Semántico</span>
          </div>
          <p className="text-xs text-slate-300">
            Coincidencias $\ge 0.88$ se responden en &lt; 15 ms con <strong>costo $0</strong> y sin tocar el LLM.
          </p>
          <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded inline-block">
            ? Early Stopping Activado
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">2 & 3. Fichas D1 + Manuales</span>
          </div>
          <p className="text-xs text-slate-300">
            Precios exactos de Cloudflare D1 + Fragmentos de manuales para asesorar con la verdad.
          </p>
          <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded inline-block">
            ? SQL Determinista + Chunks
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">4. Memoria Continua</span>
          </div>
          <p className="text-xs text-slate-300">
            Recuerda el nombre, preferencias y el hilo de la charla sin olvidar productos en discusión.
          </p>
          <div className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded inline-block">
            ? Persistencia en D1
          </div>
        </div>
      </div>
    </div>
  );
};

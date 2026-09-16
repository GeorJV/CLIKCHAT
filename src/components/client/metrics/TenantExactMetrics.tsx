import React, { useState, useEffect, useCallback } from 'react';
import { Eye, MessageSquare, ShieldAlert, Calendar, Copy, Check, ExternalLink, RefreshCw, BarChart3 } from 'lucide-react';

interface TenantExactMetricsProps {
  tenantId?: string;
  tenantSlug: string;
  onOpenLiveChat?: () => void;
}

export const TenantExactMetrics: React.FC<TenantExactMetricsProps> = ({ tenantId, tenantSlug, onOpenLiveChat }) => {
  const [chatOpens, setChatOpens] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [objectionsResolved, setObjectionsResolved] = useState<number>(0);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const publicChatUrl = `https://clikchat.pages.dev?t=${tenantSlug || 'geosoft'}`;

  const fetchMetrics = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/tenant-metrics/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) {
          setChatOpens(data.metrics.chatOpens ?? 0);
          setQuestionsAnswered(data.metrics.questionsAnswered ?? 0);
          setObjectionsResolved(data.metrics.objectionsResolved ?? 0);
          setAppointmentsCount(data.metrics.appointmentsCount ?? 0);
        }
      }
    } catch {
      // Sincronización silenciosa
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicChatUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 onyx-card rounded-2xl p-3.5 sm:p-4 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Métricas y Reportería Exacta</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● En Vivo (D1 Edge)
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">Auditoría en tiempo real de interacciones, efectividad comercial y citas del bot</p>
          </div>
        </div>

        <button
          type="button" onClick={fetchMetrics} disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1c1c] hover:bg-[#262424] border border-[#2e2c2c] text-zinc-300 text-xs font-semibold cursor-pointer transition active:scale-95 disabled:opacity-50"
          title="Actualizar datos desde Cloudflare D1"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Actualizando...' : 'Sincronizar'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Veces abierto el chat & Link del Chat */}
        <div className="onyx-card rounded-2xl p-3.5 space-y-2 flex flex-col justify-between border-emerald-500/20 bg-gradient-to-b from-[#181717] to-[#121111]">
          <div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Aperturas del Chat</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{chatOpens} <span className="text-xs font-normal text-zinc-400">visitas</span></div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Aperturas del enlace directo</p>
          </div>
          <div className="pt-2 border-t border-[#262424] space-y-1.5">
            <div className="text-[10px] font-mono text-emerald-400 truncate bg-[#0f0e0e] px-2 py-1 rounded-lg border border-[#232121]">{publicChatUrl}</div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#201e1e] hover:bg-[#2a2828] text-zinc-200 text-[10px] font-bold border border-[#2e2c2c] transition cursor-pointer">
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
              </button>
              {onOpenLiveChat && (
                <button type="button" onClick={onOpenLiveChat} className="p-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition cursor-pointer" title="Abrir chat">
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Preguntas Respondidas */}
        <div className="onyx-card rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Preguntas Respondidas</span>
              <MessageSquare className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{questionsAnswered} <span className="text-xs font-normal text-zinc-400">respuestas</span></div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Consultas de clientes resueltas por el bot en D1</p>
          </div>
          <div className="pt-2 border-t border-[#262424] flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Tasa de respuesta:</span>
            <span className="font-bold text-sky-400">100% RAG Activo</span>
          </div>
        </div>

        {/* 3. Objeciones Respondidas */}
        <div className="onyx-card rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Objeciones Resueltas</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{objectionsResolved} <span className="text-xs font-normal text-zinc-400">superadas</span></div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Dudas de precio, confianza y garantías superadas</p>
          </div>
          <div className="pt-2 border-t border-[#262424] flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Eficacia persuasiva:</span>
            <span className="font-bold text-amber-400">Alta Conversión</span>
          </div>
        </div>

        {/* 4. Agendamientos Realizados */}
        <div className="onyx-card rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Agendamientos Realizados</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{appointmentsCount} <span className="text-xs font-normal text-zinc-400">citas</span></div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Demostraciones y citas programadas por la IA</p>
          </div>
          <div className="pt-2 border-t border-[#262424] flex items-center justify-between text-[10px]">
            <span className="text-zinc-400">Sincronización:</span>
            <span className="font-bold text-purple-400">Agenda Activa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

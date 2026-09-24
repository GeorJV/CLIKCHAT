import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Zap, Users, Sliders, Save, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const ChatCadenceSettingCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const currentDelay = tenant?.response_delay_sec !== undefined ? Number(tenant.response_delay_sec) : 9;
  const [delaySec, setDelaySec] = useState<number>(currentDelay);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.response_delay_sec !== undefined) setDelaySec(Number(tenant.response_delay_sec));
  }, [tenant]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({ response_delay_sec: Number(delaySec) });
    setIsSaving(false);
  };

  const getTier = (s: number) => {
    if (s <= 1) return { label: '⚡ Instantáneo', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (s <= 4) return { label: '🚀 Rápido', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (s <= 10) return { label: '🤝 Modo Humano Óptimo', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: '🧘 Espera Extendida', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
  };
  const tier = getTier(delaySec);

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#262424] bg-[#141313] text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Cadencia y Velocidad de Respuesta del Chatbot</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configura el comportamiento del bot: respuesta inmediata o pausa humana para agrupar mensajes como en WhatsApp.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 self-start sm:self-auto ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button" onClick={() => setDelaySec(1)}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            delaySec === 1 ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/40' : 'bg-[#181717] border-[#292727] hover:border-zinc-600'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 font-black text-xs text-white">
              <Zap className="w-4 h-4 text-amber-400" /> Modo Inmediato
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">1 segundo</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">Respuesta inmediata tras cada mensaje individual. Ideal para velocidad transaccional.</p>
        </button>

        <button
          type="button" onClick={() => setDelaySec(9)}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            delaySec === 9 ? 'bg-emerald-500/10 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40' : 'bg-[#181717] border-[#292727] hover:border-zinc-600'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-2 font-black text-xs text-white">
              <Users className="w-4 h-4 text-emerald-400" /> Modo Humano (Recomendado)
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">9 segundos</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">Permite redactar varios mensajes seguidos como en WhatsApp sin interrupciones. Responde la idea consolidada.</p>
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-[#111010] border border-[#262424] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200">Ajuste Manual Personalizado (1 a 20 seg)</span>
          </div>
          <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {delaySec} seg
          </span>
        </div>
        <input
          type="range" min="1" max="20" step="1" value={delaySec}
          onChange={(e) => setDelaySec(Number(e.target.value))}
          className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>1s (Instantáneo)</span><span>5s</span><span>9s (Humano)</span><span>15s</span><span>20s (Máximo)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Configuración activa en tiempo real para todos los canales del chatbot.</span>
        </div>
        <button
          type="button" onClick={handleSave} disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-900/30 disabled:opacity-50 cursor-pointer"
        >
          {saveSuccess ? <><CheckCircle2 className="w-4 h-4 text-white" /><span>¡Guardado!</span></> : <><Save className="w-4 h-4" /><span>{isSaving ? 'Guardando...' : 'Guardar Cadencia'}</span></>}
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Gauge, Zap, Users, Clock, Sliders, Save, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const BotResponseSpeedSettingCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const rawSpeed = tenant?.bot_response_speed_sec !== undefined
    ? Number(tenant.bot_response_speed_sec)
    : (typeof window !== 'undefined' && localStorage.getItem('clikchat_bot_response_speed') !== null
        ? Number(localStorage.getItem('clikchat_bot_response_speed'))
        : 0);

  const initialSpeed = Math.min(Math.max(isNaN(rawSpeed) ? 0 : rawSpeed, 0), 10);
  const [speedSec, setSpeedSec] = useState<number>(initialSpeed);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.bot_response_speed_sec !== undefined) {
      const parsed = Number(tenant.bot_response_speed_sec);
      setSpeedSec(Math.min(Math.max(isNaN(parsed) ? 0 : parsed, 0), 10));
    }
  }, [tenant]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const normalized = Math.min(Math.max(Number(speedSec), 0), 10);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clikchat_bot_response_speed', String(normalized));
    }
    await onUpdateSettings({ bot_response_speed_sec: normalized } as any);
    setIsSaving(false);
  };

  const getTier = (s: number) => {
    if (s === 0) return { label: '⚡ 0 seg (Instantáneo)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (s === 1) return { label: '🚀 1 seg (Ultra Rápido)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (s <= 3) return { label: '🤝 2-3 seg (Lectura Natural)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: `🧘 ${s} seg (Humano Pausado)`, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
  };

  const tier = getTier(speedSec);

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#262424] bg-[#141313] text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <span>Velocidad de Respuesta Inicial del Bot (Primer Mensaje)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Define a qué velocidad responde el bot por primera vez cuando el cliente escribe (inmediato o con pausa simulada).
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 self-start sm:self-auto ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      {/* Accesos Rápidos de Velocidad (0s a 4s) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { sec: 0, label: '0 seg', title: 'Instantáneo', desc: 'Responde de inmediato', icon: Zap, color: 'text-amber-400' },
          { sec: 1, label: '1 seg', title: 'Rápido', desc: 'Mínima espera ágil', icon: Gauge, color: 'text-blue-400' },
          { sec: 2, label: '2 seg', title: 'Natural', desc: 'Lectura humana real', icon: Users, color: 'text-emerald-400' },
          { sec: 4, label: '4 seg', title: 'Pausado', desc: 'Redacción reflexiva', icon: Clock, color: 'text-purple-400' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = speedSec === item.sec;
          return (
            <button
              key={item.sec}
              type="button"
              onClick={() => setSpeedSec(item.sec)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/40'
                  : 'bg-[#181717] border-[#292727] hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-200">
                  {item.label}
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-tight">{item.title}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Slider Manual de Velocidad Inicial (0 a 6 Segundos) */}
      <div className="p-3.5 rounded-xl bg-[#111010] border border-[#262424] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200">Ajuste de Tiempo de Espera Inicial (0 a 6 seg)</span>
          </div>
          <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {speedSec === 0 ? '0s (Inmediato)' : `${speedSec} ${speedSec === 1 ? 'segundo' : 'segundos'}`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="6"
          step="1"
          value={speedSec}
          onChange={(e) => setSpeedSec(Number(e.target.value))}
          className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>0s (Inmediato)</span>
          <span>1s</span>
          <span>2s</span>
          <span>3s</span>
          <span>4s</span>
          <span>5s</span>
          <span>6s (Pausa)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Configuración independiente del intervalo entre mensajes subsecuentes.</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-900/30 disabled:opacity-50 cursor-pointer"
        >
          {saveSuccess ? (
            <><CheckCircle2 className="w-4 h-4 text-white" /><span>¡Guardado!</span></>
          ) : (
            <><Save className="w-4 h-4" /><span>{isSaving ? 'Guardando...' : 'Guardar Velocidad'}</span></>
          )}
        </button>
      </div>
    </div>
  );
};

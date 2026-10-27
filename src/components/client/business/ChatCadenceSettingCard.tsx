import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Zap, Users, Sliders, Save, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { DeliveryMode } from '../../../utils/messageSplitter';
import { MessageDeliveryModeSelector } from '../../crm/common/MessageDeliveryModeSelector';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const ChatCadenceSettingCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const rawDelay = tenant?.response_delay_sec !== undefined ? Number(tenant.response_delay_sec) : 3;
  const initialDelay = Math.min(Math.max(isNaN(rawDelay) ? 3 : rawDelay, 1), 10);

  const [delaySec, setDelaySec] = useState<number>(initialDelay);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(
    (tenant?.message_delivery_mode as DeliveryMode) || 'moderate'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.response_delay_sec !== undefined) {
      const parsed = Number(tenant.response_delay_sec);
      setDelaySec(Math.min(Math.max(isNaN(parsed) ? 3 : parsed, 1), 10));
    }
    if (tenant?.message_delivery_mode) {
      setDeliveryMode(tenant.message_delivery_mode as DeliveryMode);
    }
  }, [tenant]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const normalized = Math.min(Math.max(Number(delaySec), 1), 10);
    if (typeof window !== 'undefined') localStorage.setItem('clikchat_delivery_mode', deliveryMode);
    await onUpdateSettings({ response_delay_sec: normalized, message_delivery_mode: deliveryMode } as any);
    setIsSaving(false);
  };

  const getTier = (s: number) => {
    if (s <= 1) return { label: '⚡ 1 seg (Instantáneo)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (s <= 3) return { label: '🚀 2-3 seg (Dinámico)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (s <= 7) return { label: '🤝 4-7 seg (Humano Natural)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: '🧘 8-10 seg (Máximo Pausado)', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
  };
  const tier = getTier(delaySec);

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#262424] bg-[#141313] text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Intervalo de Envío de Mensajes del Bot (1 a 10 seg)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Define el intervalo de tiempo (de 1 segundo a un máximo de 10 segundos) con el que el bot enviará cada mensaje o burbuja.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 self-start sm:self-auto ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      {/* Selector de los 4 Modos de Burbujas */}
      <div className="p-3.5 rounded-xl bg-[#111010] border border-[#262424]">
        <MessageDeliveryModeSelector value={deliveryMode} onChange={setDeliveryMode} variant="dark" />
      </div>

      {/* Accesos Rápidos de Intervalo (1s a 10s) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { sec: 1, label: '1 seg', title: 'Instantáneo', icon: Zap, color: 'text-amber-400' },
          { sec: 3, label: '3 seg', title: 'Dinámico', icon: Clock, color: 'text-blue-400' },
          { sec: 5, label: '5 seg', title: 'Humano', icon: Users, color: 'text-emerald-400' },
          { sec: 10, label: '10 seg', title: 'Pausa Máxima', icon: Clock, color: 'text-purple-400' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = delaySec === item.sec;
          return (
            <button
              key={item.sec}
              type="button"
              onClick={() => setDelaySec(item.sec)}
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
            </button>
          );
        })}
      </div>

      {/* Slider Manual de Intervalo (1 a 10 Segundos) */}
      <div className="p-3.5 rounded-xl bg-[#111010] border border-[#262424] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200">Ajuste Fino de Intervalo entre Mensajes (1 a 10 seg)</span>
          </div>
          <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {delaySec} {delaySec === 1 ? 'segundo' : 'segundos'}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={delaySec}
          onChange={(e) => setDelaySec(Number(e.target.value))}
          className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>1s (Instantáneo)</span>
          <span>3s</span>
          <span>5s</span>
          <span>7s</span>
          <span>10s (Máximo)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>El bot respetará este intervalo exacto (1s a 10s) para enviar cada mensaje o burbuja.</span>
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
            <><Save className="w-4 h-4" /><span>{isSaving ? 'Guardando...' : 'Guardar Intervalo'}</span></>
          )}
        </button>
      </div>
    </div>
  );
};

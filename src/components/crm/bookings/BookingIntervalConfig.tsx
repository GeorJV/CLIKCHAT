import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Check, Save } from 'lucide-react';

interface Props {
  tenantId?: string;
  isDarkTheme?: boolean;
}

export const BookingIntervalConfig: React.FC<Props> = ({ tenantId, isDarkTheme = true }) => {
  const activeSlug = tenantId || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'geosoft';
  const durationKey = `clikchat_booking_duration_${activeSlug}`;
  const breakKey = `clikchat_booking_break_${activeSlug}`;

  const [duration, setDuration] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(durationKey);
      if (saved) return parseInt(saved, 10);
    }
    return 30;
  });

  const [breakBuffer, setBreakBuffer] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(breakKey);
      if (saved) return parseInt(saved, 10);
    }
    return 10;
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/tenant/booking-settings?tenant=${encodeURIComponent(activeSlug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.success) {
          if (typeof data.appointmentDuration === 'number') {
            setDuration(data.appointmentDuration);
            try { localStorage.setItem(durationKey, String(data.appointmentDuration)); } catch (e) {}
          }
          if (typeof data.breakBufferTime === 'number') {
            setBreakBuffer(data.breakBufferTime);
            try { localStorage.setItem(breakKey, String(data.breakBufferTime)); } catch (e) {}
          }
        }
      })
      .catch(() => {});
  }, [activeSlug, durationKey, breakKey]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(durationKey, String(duration));
        localStorage.setItem(breakKey, String(breakBuffer));
      }
      await fetch('/api/tenant/booking-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: activeSlug,
          appointmentDuration: duration,
          breakBufferTime: breakBuffer
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2400);
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  const totalCycle = duration + breakBuffer;
  const bgCard = isDarkTheme ? 'bg-[#181717] border-[#282626] text-white' : 'bg-white border-[#e8edf6] text-[#0a1730] shadow-xs';
  const bgInput = isDarkTheme ? 'bg-[#121111] border-[#302e2e] text-zinc-100' : 'bg-[#f8fafc] border-[#e2e8f0] text-slate-800';
  const labelColor = isDarkTheme ? 'text-zinc-300' : 'text-slate-700';
  const subtextColor = isDarkTheme ? 'text-zinc-400' : 'text-slate-500';
  const dividerColor = isDarkTheme ? 'border-white/[0.06]' : 'border-slate-100';
  const bannerClasses = isDarkTheme ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900';
  const badgeClasses = isDarkTheme ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-700 text-white shadow-xs';

  return (
    <div className={`p-4 rounded-2xl border ${bgCard} font-sans space-y-3`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${dividerColor} pb-3`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">Intervalos y Descansos entre Citas</h4>
            <p className={`text-[11px] ${subtextColor}`}>Configura el tiempo de atención y el tiempo de espera/descanso para el bot</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Guardado' : isSaving ? 'Guardando...' : 'Guardar Intervalo'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={`text-[11px] font-bold ${labelColor} flex items-center gap-1.5 mb-1.5`}>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Duración de la Cita / Atención</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:border-emerald-500 cursor-pointer ${bgInput}`}
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos (Habitual)</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos (1 hora)</option>
              <option value={90}>90 minutos (1.5 horas)</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`text-[11px] font-bold ${labelColor} flex items-center gap-1.5 mb-1.5`}>
            <Coffee className="w-3.5 h-3.5 text-amber-500" />
            <span>Tiempo de Descanso / Espera</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={breakBuffer}
              onChange={(e) => setBreakBuffer(parseInt(e.target.value, 10))}
              className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-500 cursor-pointer ${bgInput}`}
            >
              <option value={0}>0 minutos (Sin descanso)</option>
              <option value={5}>5 minutos</option>
              <option value={10}>10 minutos (Recomendado)</option>
              <option value={15}>15 minutos</option>
              <option value={20}>20 minutos</option>
              <option value={30}>30 minutos</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between flex-wrap gap-2 ${bannerClasses}`}>
        <span className="font-medium">
          💡 Ciclo de agenda: Citas de <strong className={isDarkTheme ? 'text-white' : 'text-emerald-950 font-bold'}>{duration} min</strong> + Descanso de <strong className={isDarkTheme ? 'text-white' : 'text-emerald-950 font-bold'}>{breakBuffer} min</strong>
        </span>
        <span className={`px-2.5 py-0.5 rounded-md font-bold tabular-nums text-[11px] ${badgeClasses}`}>
          Cita cada {totalCycle} min
        </span>
      </div>
    </div>
  );
};

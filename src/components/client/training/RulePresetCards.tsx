import React, { useState } from 'react';
import { RulePreset, RULE_PRESETS, applyRuleTemplate, isRulePresetActive, toggleRulePreset } from './rulesPresets';
import { ShieldAlert, Plus, Check, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RulePresetCardsProps {
  rulesText: string;
  tenantName: string;
  onApplyPreset: (nextRules: string, presetTitle: string, isNowActive: boolean) => Promise<void>;
  isGlobalSaving?: boolean;
}

export const RulePresetCards: React.FC<RulePresetCardsProps> = ({
  rulesText,
  tenantName,
  onApplyPreset,
  isGlobalSaving
}) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'add' | 'remove' } | null>(null);

  const activeCount = RULE_PRESETS.filter(p => isRulePresetActive(rulesText, p)).length;

  const handleToggle = async (preset: RulePreset) => {
    if (togglingId) return;
    setTogglingId(preset.id);
    const { nextText, isNowActive } = toggleRulePreset(rulesText, preset, tenantName);
    
    await onApplyPreset(nextText, preset.title, isNowActive);
    setTogglingId(null);
    setToast({
      message: isNowActive
        ? `¡Regla "${preset.title}" activada y guardada en el bot!`
        : `Regla "${preset.title}" desactivada.`,
      type: isNowActive ? 'add' : 'remove'
    });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Plantillas Rápidas de Restricciones & Anti-Alucinación</h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          {activeCount} de {RULE_PRESETS.length} activas
        </span>
      </div>

      <p className="text-xs text-zinc-400">
        Haz clic en <strong className="text-rose-300">+ Añadir al Bot</strong> para blindar instantáneamente al asistente. Se guarda y activa de forma automática en Cloudflare D1.
      </p>

      {toast && (
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
          toast.type === 'add'
            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
        }`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${toast.type === 'add' ? 'text-emerald-400' : 'text-zinc-400'}`} />
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {RULE_PRESETS.map((p) => {
          const isActive = isRulePresetActive(rulesText, p);
          const isCurrentLoading = togglingId === p.id;

          return (
            <div
              key={p.id}
              className={`rounded-xl p-3 flex flex-col justify-between transition border ${
                isActive
                  ? 'bg-[#151916] border-emerald-500/40 shadow-sm shadow-emerald-950/30'
                  : 'bg-[#141313] hover:bg-[#181717] border-[#262424] hover:border-rose-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold tracking-wider">
                    {p.category}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Activa
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{p.title}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                  {applyRuleTemplate(p.template, tenantName)}
                </p>
              </div>

              <div className="mt-3">
                {isCurrentLoading ? (
                  <button
                    disabled
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-800 text-zinc-400 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-wait"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                    <span>Guardando en el bot...</span>
                  </button>
                ) : isActive ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    disabled={isGlobalSaving}
                    title="Regla activa. Haz clic para desactivarla"
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-950/40 hover:bg-rose-950/50 border border-emerald-500/40 hover:border-rose-500/40 text-emerald-300 hover:text-rose-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer group"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400 group-hover:hidden" />
                    <span className="group-hover:hidden">✓ Activa en el Bot</span>
                    <X className="w-3.5 h-3.5 text-rose-400 hidden group-hover:inline" />
                    <span className="hidden group-hover:inline">Desactivar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    disabled={isGlobalSaving}
                    className="w-full py-1.5 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 hover:text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-400" />
                    <span>+ Añadir al Bot</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

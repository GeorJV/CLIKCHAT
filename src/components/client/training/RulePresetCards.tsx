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
    <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-3.5 font-sans shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-2xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0a1730]">Plantillas Rápidas de Restricciones & Anti-Alucinación</h3>
            <p className="text-[11px] text-[#62728d]">Reglas prearmadas para blindar precios, citas y políticas</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 shadow-2xs">
          {activeCount} de {RULE_PRESETS.length} activas
        </span>
      </div>

      <p className="text-xs text-[#62728d]">
        Haz clic en <strong className="text-[#0d5bff]">+ Añadir al Bot</strong> para blindar instantáneamente al asistente. Se guarda y activa de forma automática en Cloudflare D1.
      </p>

      {toast && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs ${
          toast.type === 'add'
            ? 'bg-emerald-50 text-emerald-800'
            : 'bg-[#f8fafc] text-[#475569]'
        }`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${toast.type === 'add' ? 'text-emerald-600' : 'text-[#8391aa]'}`} />
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {RULE_PRESETS.map((p) => {
          const isActive = isRulePresetActive(rulesText, p);
          const isCurrentLoading = togglingId === p.id;

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-4 flex flex-col justify-between transition shadow-xs hover:shadow-sm ${
                isActive ? 'bg-[#f0fdf4]' : 'bg-[#f8fafc] hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#0d5bff] font-bold tracking-wider">
                    {p.category}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5 shadow-2xs">
                      <Check className="w-2.5 h-2.5" /> Activa
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#0a1730] mb-1">{p.title}</h4>
                <p className="text-[11px] text-[#475569] line-clamp-3 leading-relaxed">
                  {applyRuleTemplate(p.template, tenantName)}
                </p>
              </div>

              <div className="mt-3.5">
                {isCurrentLoading ? (
                  <button
                    disabled
                    className="w-full py-1.5 px-3 rounded-xl bg-[#f1f5f9] text-[#8391aa] text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-wait"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin text-[#0d5bff]" />
                    <span>Guardando en el bot...</span>
                  </button>
                ) : isActive ? (
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    disabled={isGlobalSaving}
                    title="Regla activa. Haz clic para desactivarla"
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-100 hover:bg-rose-50 text-emerald-800 hover:text-rose-700 text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer group shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:hidden" />
                    <span className="group-hover:hidden">✓ Activa en el Bot</span>
                    <X className="w-3.5 h-3.5 text-rose-600 hidden group-hover:inline" />
                    <span className="hidden group-hover:inline">Desactivar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    disabled={isGlobalSaving}
                    className="w-full py-1.5 px-3 rounded-xl bg-[#ebf1ff] hover:bg-[#d8e5ff] text-[#0d5bff] text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0d5bff]" />
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

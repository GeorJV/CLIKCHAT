import React, { useState } from 'react';
import { RulePreset, RULE_PRESETS, isRulePresetActive, toggleRulePreset } from './rulesPresets';
import { CreateRulePresetModal } from './CreateRulePresetModal';
import { RulePresetCardItem } from './RulePresetCardItem';
import { ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface RulePresetCardsProps {
  rulesText: string;
  tenantName: string;
  tenantId?: string;
  onApplyPreset: (nextRules: string, presetTitle: string, isNowActive: boolean) => Promise<void>;
  isGlobalSaving?: boolean;
}

export const RulePresetCards: React.FC<RulePresetCardsProps> = ({
  rulesText,
  tenantName,
  tenantId,
  onApplyPreset,
  isGlobalSaving
}) => {
  const { isVoceroMode } = useVoceroMode();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'add' | 'remove' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const storageKey = `clikchat_custom_rules_${tenantId || 'global'}`;
  const [customPresets, setCustomPresets] = useState<RulePreset[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const allPresets = [...RULE_PRESETS, ...customPresets];
  const activeCount = allPresets.filter(p => isRulePresetActive(rulesText, p)).length;

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

  const handleSaveCustom = async (newPreset: RulePreset, activateNow: boolean) => {
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (activateNow) {
      await handleToggle(newPreset);
    } else {
      setToast({ message: `¡Plantilla "${newPreset.title}" guardada!`, type: 'add' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`rounded-2xl p-5 sm:p-6 space-y-3.5 font-sans ${isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${isVoceroMode ? 'bg-rose-50 text-rose-600' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Plantillas Rápidas de Restricciones & Anti-Alucinación</h3>
            <p className={`text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>Reglas prearmadas y personalizadas para blindar precios, citas y políticas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition shadow-xs hover:shadow cursor-pointer ${
              isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Restricción</span>
          </button>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs ${
            isVoceroMode ? 'bg-rose-50 text-rose-700' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {activeCount} de {allPresets.length} activas
          </span>
        </div>
      </div>

      <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
        Haz clic en <strong className={isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}>+ Añadir al Bot</strong> para blindar instantáneamente al asistente. Puedes agregar nuevas plantillas personalizadas con el botón superior.
      </p>

      {toast && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs ${
          toast.type === 'add'
            ? (isVoceroMode ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30')
            : (isVoceroMode ? 'bg-[#f8fafc] text-[#475569]' : 'bg-[#141313] text-zinc-300 border border-[#282626]')
        }`}>
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${toast.type === 'add' ? 'text-emerald-500' : (isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500')}`} />
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {allPresets.map((p) => (
          <RulePresetCardItem
            key={p.id}
            preset={p}
            isActive={isRulePresetActive(rulesText, p)}
            isLoading={togglingId === p.id}
            isGlobalSaving={isGlobalSaving}
            tenantName={tenantName}
            onToggle={handleToggle}
            onDelete={handleDeleteCustom}
          />
        ))}
      </div>

      <CreateRulePresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustom}
        tenantName={tenantName}
      />
    </div>
  );
};

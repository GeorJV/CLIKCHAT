import React from 'react';
import { RulePreset, applyRuleTemplate } from './rulesPresets';
import { Plus, Check, X, RefreshCw, Trash2 } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface RulePresetCardItemProps {
  preset: RulePreset;
  isActive: boolean;
  isLoading: boolean;
  isGlobalSaving?: boolean;
  tenantName: string;
  onToggle: (preset: RulePreset) => void;
  onDelete?: (id: string) => void;
}

export const RulePresetCardItem: React.FC<RulePresetCardItemProps> = ({
  preset,
  isActive,
  isLoading,
  isGlobalSaving,
  tenantName,
  onToggle,
  onDelete,
}) => {
  const { isVoceroMode } = useVoceroMode();
  const isCustom = preset.id.startsWith('custom_');

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col justify-between transition ${
        isVoceroMode
          ? (isActive ? 'bg-[#f0fdf4] shadow-xs hover:shadow-sm' : 'bg-[#f8fafc] hover:bg-white shadow-xs hover:shadow-sm')
          : (isActive ? 'bg-emerald-950/20 border border-emerald-500/30 shadow-md' : 'bg-[#141313] hover:bg-[#191818] border border-[#262424] shadow-md')
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`}>
            {preset.category}
          </span>
          <div className="flex items-center gap-1">
            {isActive && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs ${
                isVoceroMode ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                <Check className="w-2.5 h-2.5" /> Activa
              </span>
            )}
            {isCustom && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(preset.id);
                }}
                title="Eliminar esta plantilla personalizada"
                className={`p-1 rounded-md transition cursor-pointer ${
                  isVoceroMode ? 'text-[#8391aa] hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <h4 className={`text-xs font-bold mb-1 ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>{preset.title}</h4>
        <p className={`text-[11px] line-clamp-3 leading-relaxed ${isVoceroMode ? 'text-[#475569]' : 'text-zinc-400'}`}>
          {applyRuleTemplate(preset.template, tenantName)}
        </p>
      </div>

      <div className="mt-3.5">
        {isLoading ? (
          <button
            disabled
            className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-wait ${
              isVoceroMode ? 'bg-[#f1f5f9] text-[#8391aa]' : 'bg-[#181717] text-zinc-500'
            }`}
          >
            <RefreshCw className={`w-3 h-3 animate-spin ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
            <span>Guardando en el bot...</span>
          </button>
        ) : isActive ? (
          <button
            type="button"
            onClick={() => onToggle(preset)}
            disabled={isGlobalSaving}
            title="Regla activa. Haz clic para desactivarla"
            className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer group shadow-2xs ${
              isVoceroMode
                ? 'bg-emerald-100 hover:bg-rose-50 text-emerald-800 hover:text-rose-700'
                : 'bg-emerald-500/20 hover:bg-rose-500/20 text-emerald-300 hover:text-rose-300 border border-emerald-500/30 hover:border-rose-500/40'
            }`}
          >
            <Check className={`w-3.5 h-3.5 group-hover:hidden ${isVoceroMode ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span className="group-hover:hidden">✓ Activa en el Bot</span>
            <X className="w-3.5 h-3.5 text-rose-500 hidden group-hover:inline" />
            <span className="hidden group-hover:inline">Desactivar</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(preset)}
            disabled={isGlobalSaving}
            className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98 ${
              isVoceroMode
                ? 'bg-[#ebf1ff] hover:bg-[#d8e5ff] text-[#0d5bff]'
                : 'bg-[#1f1e1e] hover:bg-[#282626] text-emerald-400 hover:text-emerald-300 border border-[#333131]'
            }`}
          >
            <Plus className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
            <span>+ Añadir al Bot</span>
          </button>
        )}
      </div>
    </div>
  );
};

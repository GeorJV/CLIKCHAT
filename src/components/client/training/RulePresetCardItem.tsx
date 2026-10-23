import React from 'react';
import { RulePreset, applyRuleTemplate } from './rulesPresets';
import { Plus, Check, X, RefreshCw, Trash2 } from 'lucide-react';

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
  const isCustom = preset.id.startsWith('custom_');

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col justify-between transition shadow-xs hover:shadow-sm ${
        isActive ? 'bg-[#f0fdf4]' : 'bg-[#f8fafc] hover:bg-white'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] font-mono uppercase text-[#0d5bff] font-bold tracking-wider">
            {preset.category}
          </span>
          <div className="flex items-center gap-1">
            {isActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5 shadow-2xs">
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
                className="p-1 text-[#8391aa] hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <h4 className="text-xs font-bold text-[#0a1730] mb-1">{preset.title}</h4>
        <p className="text-[11px] text-[#475569] line-clamp-3 leading-relaxed">
          {applyRuleTemplate(preset.template, tenantName)}
        </p>
      </div>

      <div className="mt-3.5">
        {isLoading ? (
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
            onClick={() => onToggle(preset)}
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
            onClick={() => onToggle(preset)}
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
};

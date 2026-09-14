import React from 'react';
import {
  ShoppingBag, Activity, UtensilsCrossed, Scale,
  Building2, Rocket, Scissors, Sparkles, Layers
} from 'lucide-react';

interface SettingsBusinessTypeStepProps {
  selectedBizType: string;
  onSelectBizType: (type: string) => void;
}

interface BizTypeOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

export const SettingsBusinessTypeStep: React.FC<SettingsBusinessTypeStepProps> = ({
  selectedBizType,
  onSelectBizType
}) => {
  const bizTypes: BizTypeOption[] = [
    { id: 'tienda', label: 'Tienda', icon: ShoppingBag, colorClass: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' },
    { id: 'clinica', label: 'Clínica', icon: Activity, colorClass: 'bg-blue-950 text-blue-400 border-blue-500/30' },
    { id: 'restaurante', label: 'Restaurante', icon: UtensilsCrossed, colorClass: 'bg-amber-950 text-amber-400 border-amber-500/30' },
    { id: 'abogado', label: 'Abogado', icon: Scale, colorClass: 'bg-purple-950 text-purple-400 border-purple-500/30' },
    { id: 'inmobiliaria', label: 'Inmobiliaria', icon: Building2, colorClass: 'bg-rose-950 text-rose-400 border-rose-500/30' },
    { id: 'agencia', label: 'Agencia', icon: Rocket, colorClass: 'bg-indigo-950 text-indigo-400 border-indigo-500/30' },
    { id: 'salon', label: 'Salón', icon: Scissors, colorClass: 'bg-pink-950 text-pink-400 border-pink-500/30' },
    { id: 'otro', label: 'Otro', icon: Sparkles, colorClass: 'bg-cyan-950 text-cyan-400 border-cyan-500/30' }
  ];

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>1. Tipo de Negocio (Configuración Automática)</span>
        </h3>
        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">
          Paso 1 de 3
        </span>
      </div>

      <p className="text-xs text-zinc-400">
        Selecciona la industria principal de tu empresa para que la IA adapte los prompts, respuestas y embudos automáticamente.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
        {bizTypes.map((biz) => {
          const Icon = biz.icon;
          const isSelected = selectedBizType === biz.id;
          return (
            <button
              key={biz.id}
              type="button"
              onClick={() => onSelectBizType(biz.id)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 font-bold ring-2 ring-emerald-500 text-white shadow-md shadow-emerald-500/10'
                  : 'onyx-surface hover:border-white/20 text-zinc-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${biz.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs">{biz.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

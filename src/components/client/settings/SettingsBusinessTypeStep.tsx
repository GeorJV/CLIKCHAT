import React from 'react';
import { Layers } from 'lucide-react';
import { BusinessTypeSelector } from './BusinessTypeSelector';

interface SettingsBusinessTypeStepProps {
  selectedBizType: string;
  onSelectBizType: (type: string) => void;
}

export const SettingsBusinessTypeStep: React.FC<SettingsBusinessTypeStepProps> = ({
  selectedBizType,
  onSelectBizType
}) => {
  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg border border-[#262424]">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>1. Modalidad Comercial de tu Negocio (1 Clic)</span>
        </h3>
        <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">
          Paso 1 de 3
        </span>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">
        Elige cómo opera tu comercio. La IA calibrará automáticamente sus prompts, comanda, enlaces de producto y embudos de cierre según esta modalidad.
      </p>

      {/* Selector de 3 Macro-Modalidades */}
      <BusinessTypeSelector
        value={selectedBizType}
        onChange={onSelectBizType}
      />
    </div>
  );
};

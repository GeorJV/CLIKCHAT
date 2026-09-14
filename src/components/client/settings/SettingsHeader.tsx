import React from 'react';
import { Settings, Sparkles } from 'lucide-react';

interface SettingsHeaderProps {
  onOpenWizard?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onOpenWizard }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Configuración del Negocio & Onboarding QChat</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configura tu identidad comercial, tipo de negocio, Número Q oficial y Kit de Bienvenida en 5 minutos.
        </p>
      </div>

      {onOpenWizard && (
        <button
          type="button"
          onClick={onOpenWizard}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>⚡ Abrir Wizard Rápido (5 min)</span>
        </button>
      )}
    </div>
  );
};

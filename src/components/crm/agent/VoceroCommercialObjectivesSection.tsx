import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import {
  COMMERCIAL_OBJECTIVES,
  parseCommercialObjectives,
  buildObjectivesPromptSnippet,
} from '../../../utils/commercialObjectives';
import {
  Target,
  CheckCircle2,
  Save,
  MessageSquare,
  ShoppingBag,
  UserCheck,
  Calendar,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

interface VoceroCommercialObjectivesSectionProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

const OBJECTIVE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  support: MessageSquare,
  sales: ShoppingBag,
  leads: UserCheck,
  bookings: Calendar,
  quotes: FileSpreadsheet,
  retention: Zap,
};

export const VoceroCommercialObjectivesSection: React.FC<VoceroCommercialObjectivesSectionProps> = ({
  tenant,
  onUpdateSettings,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSelectedIds(parseCommercialObjectives(tenant?.commercial_objectives));
  }, [tenant?.commercial_objectives]);

  const toggleObjective = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    const ok = await onUpdateSettings({
      commercial_objectives: JSON.stringify(selectedIds),
    });

    setIsSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleAppendToPrompt = async () => {
    const snippet = buildObjectivesPromptSnippet(selectedIds);
    if (!snippet) return;

    const currentPrompt = tenant?.system_prompt || '';
    const cleanPrompt = currentPrompt.replace(/### DIRECTIVAS COMERCIALES ACTIVAS:[\s\S]*?(?=\n\n|$)/g, '').trim();
    const newPrompt = cleanPrompt ? `${cleanPrompt}\n\n${snippet}` : snippet;

    setIsSaving(true);
    const ok = await onUpdateSettings({
      commercial_objectives: JSON.stringify(selectedIds),
      system_prompt: newPrompt,
    });
    setIsSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="border-b border-[#e8edf6] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0d5bff]" />
            <h3 className="text-base font-bold text-[#0a1730]">Objetivos Comerciales del Agente</h3>
          </div>
          <p className="text-xs text-[#62728d] mt-0.5">
            Configuración sin código · Selecciona qué funciones debe desempeñar tu asistente de IA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#ebf1ff] text-[#0038d8] text-xs font-black">
            {selectedIds.length} de {COMMERCIAL_OBJECTIVES.length} Activos
          </span>
        </div>
      </div>

      {/* Grid de Objetivos por Casillas - Sin bordes, limpios y resaltaditos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {COMMERCIAL_OBJECTIVES.map((obj) => {
          const isChecked = selectedIds.includes(obj.id);
          const Icon = OBJECTIVE_ICONS[obj.iconName] || Target;

          return (
            <div
              key={obj.id}
              onClick={() => toggleObjective(obj.id)}
              className={`p-4 rounded-xl transition-all cursor-pointer select-none flex items-start gap-3.5 shadow-sm hover:shadow-md ${
                isChecked
                  ? 'bg-[#ebf1ff]/70 ring-2 ring-[#0d5bff]'
                  : 'bg-white hover:bg-[#fafcff]'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d5bff] focus:ring-[#0d5bff] cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isChecked ? 'text-[#0d5bff]' : 'text-[#8391aa]'}`} />
                    <h4 className="text-[13.5px] font-bold text-[#0a1730] truncate">{obj.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isChecked ? 'bg-[#0d5bff] text-white' : 'bg-[#eef2f9] text-[#62728d]'
                  }`}>
                    {obj.tag}
                  </span>
                </div>
                <p className="text-xs text-[#50617e] leading-relaxed">{obj.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de Acciones y Guardado */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e8edf6]">
        <button
          type="button"
          onClick={handleAppendToPrompt}
          disabled={isSaving}
          className="text-xs font-bold text-[#0d5bff] hover:text-[#0a4de6] flex items-center gap-1.5 cursor-pointer py-1"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Sincronizar directivas con el System Prompt</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#0d5bff]/20 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Objetivos Comerciales'}</span>
        </button>
      </div>
    </div>
  );
};

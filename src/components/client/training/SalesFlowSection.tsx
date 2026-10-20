import React, { useState, useEffect, useMemo } from 'react';
import { Tenant } from '../../../types';
import {
  SALES_FLOW_PRESETS,
  SalesFlowPreset,
  SalesFlowStep,
  compileFourStepsToRules,
  parseRulesToFourSteps
} from './salesFlowPresets';
import { SalesFlowFourStepsEditor } from './salesflow/SalesFlowFourStepsEditor';
import { TrendingUp, Save, CheckCircle2, Sparkles, RefreshCw, Code2 } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const SalesFlowSection: React.FC<Props> = ({ tenant, onUpdateSettings }) => {
  const defaultPreset = useMemo<SalesFlowPreset>(() => {
    if (tenant?.business_type === 'tienda') return SALES_FLOW_PRESETS[1];
    if (tenant?.business_type === 'servicios') return SALES_FLOW_PRESETS[2];
    if (tenant?.business_type === 'soporte') return SALES_FLOW_PRESETS[3];
    return SALES_FLOW_PRESETS[0];
  }, [tenant?.business_type]);

  const [steps, setSteps] = useState<[SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep]>(() => {
    const raw = tenant?.sales_flow_rules || defaultPreset.rules;
    return parseRulesToFourSteps(raw, defaultPreset.steps);
  });

  const [rules, setRules] = useState<string>(tenant?.sales_flow_rules || defaultPreset.rules);
  const [showRaw, setShowRaw] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.sales_flow_rules) {
      setRules(tenant.sales_flow_rules);
      setSteps(parseRulesToFourSteps(tenant.sales_flow_rules, defaultPreset.steps));
    }
  }, [tenant?.sales_flow_rules, defaultPreset]);

  const handleApplyPreset = (preset: SalesFlowPreset) => {
    setSteps(preset.steps);
    setRules(preset.rules);
  };

  const handleStepChange = (index: number, updated: Partial<SalesFlowStep>) => {
    const updatedSteps = [...steps] as [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
    updatedSteps[index] = { ...updatedSteps[index], ...updated };
    setSteps(updatedSteps);
    setRules(compileFourStepsToRules(updatedSteps));
  };

  const handleSave = async () => {
    if (!onUpdateSettings) return;
    setIsSaving(true);
    const finalRules = rules.trim() || compileFourStepsToRules(steps);
    const ok = await onUpdateSettings({ sales_flow_rules: finalRules });
    setIsSaving(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl animate-fade-in font-sans">
      {/* Encabezado en Tono Claro */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0d5bff] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0a1730] flex items-center gap-2">
              <span>Flujo de Conversión en 4 Pasos Obligatorios</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#0d5bff] uppercase tracking-wider">Activo</span>
            </h3>
            <p className="text-xs text-[#62728d] mt-0.5">
              La IA seguirá este orden estricto desde el saludo inicial hasta el cierre oficial por WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Plantillas */}
      <div>
        <label className="block text-xs font-bold text-[#0a1730] mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Elegir Estrategia Prediseñada según tu Industria:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SALES_FLOW_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-3.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#0d5bff]/40 text-left transition cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a1730] group-hover:text-[#0d5bff] transition">
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <p className="text-[11px] text-[#62728d] mt-1.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
              <span className="text-[10.5px] font-bold text-[#0d5bff] mt-2.5 block">
                Cargar 4 Pasos →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor en 4 Pasos en Tono Claro */}
      <div className="rounded-2xl p-4 sm:p-5 border border-[#e2e8f0] bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0a1730]">
            Personaliza el Comportamiento de Cada Paso:
          </span>
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="text-[11px] font-bold text-[#62728d] hover:text-[#0d5bff] flex items-center gap-1 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showRaw ? 'Volver a Tarjetas' : 'Ver Prompt Compilado'}</span>
          </button>
        </div>

        {showRaw ? (
          <textarea
            rows={8}
            value={rules}
            onChange={(e) => {
              setRules(e.target.value);
              setSteps(parseRulesToFourSteps(e.target.value, steps));
            }}
            className="w-full bg-[#f8fafc] border border-[#d8e2f0] rounded-xl p-3 text-xs text-[#0a1730] focus:outline-none focus:border-[#0d5bff] font-mono leading-relaxed"
          />
        ) : (
          <SalesFlowFourStepsEditor steps={steps} onChangeStep={handleStepChange} />
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#f1f5f9]">
          <p className="text-[11px] text-[#62728d]">
            💡 <strong className="text-[#0a1730]">Garantía Secuencial:</strong> El bot no intentará cobrar ni pedir datos antes del Paso 4.
          </p>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado en D1!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Guardando...' : 'Guardar Flujo de 4 Pasos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

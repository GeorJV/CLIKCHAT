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
import { TrendingUp, Save, CheckCircle2, RefreshCw, Code2 } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const SalesFlowSection: React.FC<Props> = ({ tenant, onUpdateSettings }) => {
  const { isVoceroMode } = useVoceroMode();
  const defaultPreset = useMemo<SalesFlowPreset>(() => {
    const t = tenant?.business_type;
    return t === 'tienda' ? SALES_FLOW_PRESETS[1] : t === 'servicios' ? SALES_FLOW_PRESETS[2] : t === 'soporte' ? SALES_FLOW_PRESETS[3] : SALES_FLOW_PRESETS[0];
  }, [tenant?.business_type]);

  const [steps, setSteps] = useState<[SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep]>(() => parseRulesToFourSteps(tenant?.sales_flow_rules || defaultPreset.rules, defaultPreset.steps));
  const [rules, setRules] = useState<string>(tenant?.sales_flow_rules || defaultPreset.rules);
  const [showRaw, setShowRaw] = useState(false), [isSaving, setIsSaving] = useState(false), [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.sales_flow_rules) {
      setRules(tenant.sales_flow_rules);
      setSteps(parseRulesToFourSteps(tenant.sales_flow_rules, defaultPreset.steps));
    }
  }, [tenant?.sales_flow_rules, defaultPreset]);

  const handleApplyPreset = (p: SalesFlowPreset) => { setSteps(p.steps); setRules(p.rules); };

  const handleStepChange = (index: number, updated: Partial<SalesFlowStep>) => {
    const next = [...steps] as [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
    next[index] = { ...next[index], ...updated };
    setSteps(next);
    setRules(compileFourStepsToRules(next));
  };

  const handleSave = async () => {
    if (!onUpdateSettings) return;
    setIsSaving(true);
    const ok = await onUpdateSettings({ sales_flow_rules: rules.trim() || compileFourStepsToRules(steps) });
    setIsSaving(false);
    if (ok) { setSuccess(true); setTimeout(() => setSuccess(false), 3500); }
  };

  return (
    <div className={`space-y-4 max-w-4xl animate-fade-in font-sans ${isVoceroMode ? 'text-[#0a1730]' : 'text-slate-100'}`}>
      {/* Encabezado */}
      <div className={`p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isVoceroMode ? 'bg-blue-50 text-[#0d5bff]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
              <span>Flow IQ — Constructor de Flujos de Venta</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isVoceroMode ? 'bg-blue-100 text-[#0d5bff]' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>Activo</span>
            </h3>
            <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'} mt-0.5`}>Plantillas por industria con metodología persuasiva: Asesor Consultivo, Venta Directa o Citas.</p>
          </div>
        </div>
      </div>

      {/* Selector de Plantillas */}
      <div>
        <label className={`block text-xs font-bold mb-2 flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
          <TrendingUp className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
          <span>Elegir Estrategia Prediseñada según tu Industria:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SALES_FLOW_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`p-3.5 rounded-xl text-left transition cursor-pointer group flex flex-col justify-between ${
                isVoceroMode
                  ? 'bg-white hover:bg-[#f8fafc] shadow-sm hover:shadow-md'
                  : 'bg-[#181717] hover:bg-[#1d1c1c] border border-[#282626] shadow-md'
              }`}
            >
              <div>
                <div className={`flex items-center gap-1.5 text-xs font-bold transition ${
                  isVoceroMode ? 'text-[#0a1730] group-hover:text-[#0d5bff]' : 'text-white group-hover:text-emerald-400'
                }`}>
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <p className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
                  {p.description}
                </p>
              </div>
              <span className={`text-[10.5px] font-bold mt-2.5 block ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`}>
                Cargar 4 Pasos →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor en 4 Pasos */}
      <div className={`rounded-2xl p-4 sm:p-5 space-y-4 ${isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
            Personaliza el Comportamiento de Cada Paso:
          </span>
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className={`text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
              isVoceroMode ? 'text-[#62728d] hover:text-[#0d5bff]' : 'text-zinc-400 hover:text-white'
            }`}
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
            className={`w-full rounded-xl p-3 text-xs font-mono leading-relaxed focus:outline-none ${
              isVoceroMode
                ? 'bg-[#f8fafc] border border-[#d8e2f0] text-[#0a1730] focus:border-[#0d5bff]'
                : 'bg-[#121111] border border-[#2c2a2a] text-white focus:border-emerald-500'
            }`}
          />
        ) : (
          <SalesFlowFourStepsEditor steps={steps} onChangeStep={handleStepChange} />
        )}

        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t ${
          isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'
        }`}>
          <p className={`text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            💡 <strong className={isVoceroMode ? 'text-[#0a1730]' : 'text-white'}>Garantía Secuencial:</strong> El bot no intentará cobrar ni pedir datos antes del Paso 4.
          </p>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado en D1!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs ${
                isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
              }`}
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
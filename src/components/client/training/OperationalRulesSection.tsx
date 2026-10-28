import React, { useState, useEffect, useRef } from 'react';
import { Tenant } from '../../../types';
import { RulePresetCards } from './RulePresetCards';
import { RulesDropzone } from './RulesDropzone';
import { Save, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface OperationalRulesSectionProps {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const OperationalRulesSection: React.FC<OperationalRulesSectionProps> = ({ tenant, onUpdateSettings }) => {
  const { isVoceroMode } = useVoceroMode();
  const [rulesText, setRulesText] = useState(tenant?.operational_rules || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (tenant?.operational_rules !== undefined && !isDirtyRef.current) {
      setRulesText(tenant.operational_rules || '');
    }
  }, [tenant?.operational_rules]);

  const handleApplyPreset = async (nextRules: string, _title: string, _isNowActive: boolean) => {
    setRulesText(nextRules);
    isDirtyRef.current = false;
    if (onUpdateSettings) {
      setIsSaving(true);
      await onUpdateSettings({ operational_rules: nextRules.trim() });
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!onUpdateSettings) return;
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await onUpdateSettings({ operational_rules: rulesText.trim() });
    setIsSaving(false);
    if (ok) {
      isDirtyRef.current = false;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <div className={`space-y-4 max-w-4xl font-sans ${isVoceroMode ? 'text-[#0a1730]' : 'text-slate-100'}`}>
      {/* 1. Selector de Plantillas de Restricciones Interactivas */}
      <RulePresetCards
        rulesText={rulesText}
        tenantName={tenant?.name || 'Mi Negocio'}
        tenantId={tenant?.id || tenant?.slug}
        onApplyPreset={handleApplyPreset}
        isGlobalSaving={isSaving}
      />

      {/* 2. Editor de Reglas Personalizadas */}
      <div className={`rounded-2xl p-5 sm:p-6 space-y-4 ${isVoceroMode ? 'bg-white shadow-sm' : 'bg-[#181717] border border-[#282626] shadow-lg'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${isVoceroMode ? 'bg-rose-50 text-rose-600' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Reglas Estrictas de Operación</h3>
              <p className={`text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>Inyección de alta prioridad para blindar el comportamiento del bot</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc] text-[#62728d]' : 'bg-[#121111] text-zinc-400 border border-[#262424]'}`}>
            {rulesText.length} caracteres
          </span>
        </div>

        {/* Zona Drag & Drop */}
        <RulesDropzone onTextLoaded={(text) => {
          isDirtyRef.current = true;
          setRulesText(text);
        }} />

        {/* Textarea Manual */}
        <div>
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-300'}`}>
            Directivas y Restricciones Específicas para tu Asistente
          </label>
          <textarea
            rows={6}
            value={rulesText}
            onChange={(e) => {
              isDirtyRef.current = true;
              setRulesText(e.target.value);
            }}
            placeholder="Ejemplo:&#10;- Jamás inventes descuentos que no estén en el catálogo.&#10;- Si te preguntan por la marca competidora XYZ, indica que solo asesoras sobre nuestros productos oficiales.&#10;- No aceptes pagos con cheques ni plazos sin autorización previa."
            className={`w-full rounded-xl p-3.5 text-xs leading-relaxed font-sans shadow-2xs transition focus:outline-none ${
              isVoceroMode
                ? 'bg-[#f8fafc] text-[#0a1730] placeholder-[#8391aa] focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white'
                : 'bg-[#121111] border border-[#2c2a2a] text-white placeholder-zinc-500 focus:border-emerald-500 focus:bg-[#151414]'
            }`}
          />
        </div>

        {/* Banner de Protección Activa */}
        <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 shadow-2xs ${isVoceroMode ? 'bg-amber-50 text-amber-900' : 'bg-amber-950/25 border border-amber-800/40 text-amber-200'}`}>
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isVoceroMode ? 'text-amber-600' : 'text-amber-400'}`} />
          <div className="text-[11px] leading-relaxed">
            <strong className={`font-bold ${isVoceroMode ? 'text-amber-900' : 'text-amber-300'}`}>Prioridad Inviolable en Producción:</strong> Cualquier regla escrita o seleccionada arriba se inyecta en el System Prompt del bot con máxima prioridad, anulando alucinaciones sobre precios o políticas no oficiales.
          </div>
        </div>

        {/* Botón de Guardado Manual */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reglas guardadas y activas en el bot
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer active:scale-98 ${
              isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando datos...' : 'Guardar Reglas de Operación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

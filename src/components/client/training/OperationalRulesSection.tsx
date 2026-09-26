import React, { useState, useEffect, useRef } from 'react';
import { Tenant } from '../../../types';
import { RulePresetCards } from './RulePresetCards';
import { RulesDropzone } from './RulesDropzone';
import { Save, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface OperationalRulesSectionProps {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const OperationalRulesSection: React.FC<OperationalRulesSectionProps> = ({ tenant, onUpdateSettings }) => {
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
    <div className="space-y-4 max-w-4xl text-slate-100 font-sans">
      {/* 1. Selector de Plantillas de Restricciones Interactivas */}
      <RulePresetCards
        rulesText={rulesText}
        tenantName={tenant?.name || 'Mi Negocio'}
        onApplyPreset={handleApplyPreset}
        isGlobalSaving={isSaving}
      />

      {/* 2. Editor de Reglas Personalizadas */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Reglas Estrictas de Operación (Inyección de Alta Prioridad)</h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
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
          <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
            Directivas y Restricciones Específicas para tu Asistente
          </label>
          <textarea
            rows={6}
            value={rulesText}
            onChange={(e) => {
              isDirtyRef.current = true;
              setRulesText(e.target.value);
            }}
            placeholder="Ejemplo:&#10;- Jamás inventes descuentos que no estén en el catálogo.&#10;- Si te preguntan por la marca competidora XYZ, indica que solo asesoras sobre nuestros productos oficiales.&#10;- No aceptes pagos con cheques ni plazos sin autorización..."
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
          />
        </div>

        {/* Banner de Protección Activa */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-bold">Prioridad Inviolable en Producción:</strong> Cualquier regla escrita o seleccionada arriba se inyecta en el System Prompt del bot con máxima prioridad, anulando alucinaciones sobre precios o políticas no oficiales.
          </div>
        </div>

        {/* Botón de Guardado Manual */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#262424]">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reglas guardadas y activas en el bot
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar Reglas de Operación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

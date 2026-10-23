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
    <div className="space-y-4 max-w-4xl text-[#0a1730] font-sans">
      {/* 1. Selector de Plantillas de Restricciones Interactivas - Sin bordes */}
      <RulePresetCards
        rulesText={rulesText}
        tenantName={tenant?.name || 'Mi Negocio'}
        onApplyPreset={handleApplyPreset}
        isGlobalSaving={isSaving}
      />

      {/* 2. Editor de Reglas Personalizadas - Sin bordes, limpio y resaltadito */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-2xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">Reglas Estrictas de Operación</h3>
              <p className="text-[11px] text-[#62728d]">Inyección de alta prioridad para blindar el comportamiento del bot</p>
            </div>
          </div>
          <span className="text-[10px] text-[#62728d] font-mono bg-[#f8fafc] px-2 py-0.5 rounded-lg shadow-2xs">
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
          <label className="block text-[11px] font-bold text-[#0a1730] uppercase tracking-wider mb-1.5">
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
            className="w-full bg-[#f8fafc] rounded-xl p-3.5 text-xs text-[#0a1730] placeholder-[#8391aa] focus:outline-none focus:ring-2 focus:ring-[#0d5bff]/20 focus:bg-white leading-relaxed font-sans shadow-2xs transition"
          />
        </div>

        {/* Banner de Protección Activa */}
        <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-bold text-amber-900">Prioridad Inviolable en Producción:</strong> Cualquier regla escrita o seleccionada arriba se inyecta en el System Prompt del bot con máxima prioridad, anulando alucinaciones sobre precios o políticas no oficiales.
          </div>
        </div>

        {/* Botón de Guardado Manual */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reglas guardadas y activas en el bot
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] active:scale-98 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar Reglas de Operación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

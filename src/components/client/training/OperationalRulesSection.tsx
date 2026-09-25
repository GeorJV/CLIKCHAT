import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { RULE_PRESETS, applyRuleTemplate } from './rulesPresets';
import { RulesDropzone } from './RulesDropzone';
import { ShieldAlert, Save, CheckCircle2, AlertTriangle, Plus, RefreshCw, Lock } from 'lucide-react';

interface OperationalRulesSectionProps {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const OperationalRulesSection: React.FC<OperationalRulesSectionProps> = ({ tenant, onUpdateSettings }) => {
  const [rulesText, setRulesText] = useState(tenant?.operational_rules || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.operational_rules !== undefined) {
      setRulesText(tenant.operational_rules || '');
    }
  }, [tenant?.operational_rules]);

  const handleApplyPreset = (template: string, append: boolean = false) => {
    const formatted = applyRuleTemplate(template, tenant?.name || 'Mi Negocio');
    if (append && rulesText.trim().length > 0) {
      setRulesText((prev) => `${prev.trim()}\n\n${formatted}`);
    } else {
      setRulesText(formatted);
    }
  };

  const handleSave = async () => {
    if (!onUpdateSettings) return;
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await onUpdateSettings({ operational_rules: rulesText.trim() });
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl text-slate-100 font-sans">
      {/* 1. Selector de Plantillas de Restricciones */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Plantillas Rápidas de Restricciones & Anti-Alucinación</h3>
        </div>
        <p className="text-xs text-zinc-400">
          Selecciona reglas pre-diseñadas para blindar a tu bot contra respuestas no autorizadas o inventadas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {RULE_PRESETS.map((p) => (
            <div
              key={p.id}
              className="bg-[#141313] hover:bg-[#181717] border border-[#262424] hover:border-rose-500/40 rounded-xl p-3 flex flex-col justify-between transition group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold tracking-wider block mb-1">
                  {p.category}
                </span>
                <h4 className="text-xs font-bold text-white mb-1">{p.title}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                  {applyRuleTemplate(p.template, tenant?.name || 'Mi Negocio')}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(p.template, true)}
                  className="flex-1 py-1 px-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Añade esta directiva al texto actual sin borrar lo existente"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(p.template, false)}
                  className="py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                  title="Reemplaza todo el contenido con esta directiva"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <RulesDropzone onTextLoaded={(text) => setRulesText(text)} />

        {/* Textarea Manual */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
            Directivas y Restricciones Específicas para tu Asistente
          </label>
          <textarea
            rows={6}
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            placeholder="Ejemplo:&#10;- Jamás inventes descuentos que no estén en el catálogo.&#10;- Si te preguntan por la marca competidora XYZ, indica que solo asesoras sobre nuestros productos oficiales.&#10;- No aceptes pagos con cheques ni plazos sin autorización..."
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
          />
        </div>

        {/* Banner de Protección Activa */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-bold">Prioridad Inviolable en Producción:</strong> Cualquier regla escrita aquí se inyectará en el System Prompt del bot con nivel de cumplimiento obligatorio, anulando alucinaciones sobre precios o políticas no oficiales.
          </div>
        </div>

        {/* Botón de Guardado */}
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

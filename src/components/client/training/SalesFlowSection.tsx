import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { SALES_FLOW_PRESETS } from './salesFlowPresets';
import { TrendingUp, Save, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const SalesFlowSection: React.FC<Props> = ({ tenant, onUpdateSettings }) => {
  const defaultRules = tenant?.business_type === 'tienda'
    ? SALES_FLOW_PRESETS[1].rules
    : tenant?.business_type === 'servicios'
      ? SALES_FLOW_PRESETS[2].rules
      : SALES_FLOW_PRESETS[0].rules;

  const [rules, setRules] = useState(tenant?.sales_flow_rules || defaultRules);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tenant?.sales_flow_rules !== undefined) {
      setRules(tenant.sales_flow_rules || defaultRules);
    }
  }, [tenant?.sales_flow_rules, defaultRules]);

  const handleApplyPreset = (presetRules: string) => {
    setRules(presetRules);
  };

  const handleSave = async () => {
    if (!onUpdateSettings) return;
    setIsSaving(true);
    const ok = await onUpdateSettings({ sales_flow_rules: rules.trim() });
    setIsSaving(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl animate-fade-in font-sans">
      {/* Tarjeta de Encabezado */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#161515] to-[#161515] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Flujo Conversacional de Venta & Cross-Selling</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">Activo</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instruye al bot para ofrecer acompañamientos, hacer venta cruzada y emitir la comanda oficial.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Plantillas */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Elegir Estrategia Prediseñada según tu Industria:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SALES_FLOW_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p.rules)}
              className="p-3 rounded-xl bg-[#141313] hover:bg-[#1a1919] border border-[#2a2828] hover:border-emerald-500/40 text-left transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-emerald-400 transition">
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 mt-2 block">
                Cargar esta estrategia →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor de Reglas */}
      <div className="onyx-card rounded-2xl p-4 sm:p-5 border border-[#262424] space-y-3 bg-[#111010]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300">
            Directivas del Flujo de Venta (Inyectadas en la IA):
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            {rules.length} caracteres
          </span>
        </div>

        <textarea
          rows={7}
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Escribe aquí las pautas de venta cruzada, preguntas de cierre y comanda..."
          className="w-full bg-[#161515] border border-[#2a2828] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-y"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#222020]">
          <p className="text-[11px] text-zinc-400">
            💡 <strong className="text-zinc-300">Tip de Venta:</strong> Al pedir un plato, el bot sugerirá siempre bebidas o papas para elevar tu ticket promedio.
          </p>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {success && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Estrategia de venta guardada en D1!
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Guardando en D1...' : 'Guardar Flujo de Venta'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sliders, Cpu, Sparkles } from 'lucide-react';
import { GlobalAiBudgetSettings } from '../../../types/adminDirectory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSettings?: GlobalAiBudgetSettings | null;
  onSaved: () => void;
}

const PRESET_MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (Razonamiento)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash' }
];

export const AiBudgetModal: React.FC<Props> = ({ isOpen, onClose, currentSettings, onSaved }) => {
  const [dayBudget, setDayBudget] = useState(1.0), [weekBudget, setWeekBudget] = useState(5.0), [monthBudget, setMonthBudget] = useState(15.0);
  const [glmLimit, setGlmLimit] = useState(5.0), [gptLimit, setGptLimit] = useState(2.0), [applyToAll, setApplyToAll] = useState(true);
  const [optEnabled, setOptEnabled] = useState(false), [optModelId, setOptModelId] = useState('deepseek/deepseek-chat');
  const [optName, setOptName] = useState('DeepSeek V3'), [optLimit, setOptLimit] = useState(5.0);
  const [isSaving, setIsSaving] = useState(false), [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentSettings) {
      setDayBudget(currentSettings.dayBudget ?? 1.0);
      setWeekBudget(currentSettings.weekBudget ?? 5.0);
      setMonthBudget(currentSettings.monthBudget ?? 15.0);
      setGlmLimit(currentSettings.glmLimitPerAccount ?? 5.0);
      setGptLimit(currentSettings.gptLimitPerAccount ?? 2.0);
      if (currentSettings.optionalModel) {
        setOptEnabled(!!currentSettings.optionalModel.enabled);
        setOptModelId(currentSettings.optionalModel.modelId || 'deepseek/deepseek-chat');
        setOptName(currentSettings.optionalModel.name || 'DeepSeek V3');
        setOptLimit(currentSettings.optionalModel.monthlyLimit ?? 5.0);
      }
    }
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleModelPresetChange = (id: string) => {
    setOptModelId(id);
    const found = PRESET_MODELS.find(m => m.id === id);
    if (found) setOptName(found.name);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/ai-budget-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayBudget,
          weekBudget,
          monthBudget,
          glmLimitPerAccount: glmLimit,
          gptLimitPerAccount: gptLimit,
          applyToAllAccounts: applyToAll,
          optionalModel: { enabled: optEnabled, modelId: optModelId, name: optName, monthlyLimit: optLimit }
        })
      });
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        const d = await res.json();
        setError(d.error || 'Error al guardar presupuestos');
      }
    } catch (err: any) {
      setError(err?.message || 'Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow shrink-0">
              <Sliders size={16} />
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">Límites por Cuenta & Presupuestos IA</p>
              <p className="text-[10px] text-slate-400">Definir montos de modelos para todas las cuentas y presupuestos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"><X size={15} /></button>
        </div>

        <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-4 space-y-3.5 text-xs">
          {error && <div className="p-2 rounded bg-rose-950/80 text-rose-300 text-[11px] border border-rose-800">{error}</div>}

          {/* Límites de Modelos por Cuenta */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
            <p className="font-bold text-purple-200 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Cpu size={13} className="text-purple-400" /> Límites por Cuenta (Aplica a Todos los Modelos)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-teal-300">GLM-5.3 Flash ($/mes)</label>
                <input type="number" step="0.5" min="0" value={glmLimit} onChange={e => setGlmLimit(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-teal-300 font-mono font-bold text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-purple-300">GPT-4o Mini ($/mes)</label>
                <input type="number" step="0.5" min="0" value={gptLimit} onChange={e => setGptLimit(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-purple-300 font-mono font-bold text-xs" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-purple-900/40 text-slate-300 text-[11px]">
              <input type="checkbox" checked={applyToAll} onChange={e => setApplyToAll(e.target.checked)} className="rounded border-slate-700 text-purple-600 focus:ring-0 bg-slate-900" />
              <span className="font-semibold text-amber-300">Aplicar este monto a todas las cuentas registradas</span>
            </label>
          </div>

          {/* Presupuestos Globales de la Plataforma */}
          <div>
            <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" /> Presupuestos Globales de Plataforma ($ USD)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Día</label>
                <input type="number" step="0.5" min="0" value={dayBudget} onChange={e => setDayBudget(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-mono text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Semana</label>
                <input type="number" step="1" min="0" value={weekBudget} onChange={e => setWeekBudget(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-white font-mono text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Mes</label>
                <input type="number" step="1" min="0" value={monthBudget} onChange={e => setMonthBudget(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-950 border-slate-700 text-emerald-400 font-mono font-bold text-xs" />
              </div>
            </div>
          </div>

          {/* Modelo Opcional Adicional */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Cpu size={13} className="text-teal-400" /> Modelo Opcional Adicional (ej: DeepSeek)
              </p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={optEnabled} onChange={e => setOptEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {optEnabled && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/40 space-y-2">
                <select value={optModelId} onChange={e => handleModelPresetChange(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-white font-semibold text-xs">
                  {PRESET_MODELS.map(m => (<option key={m.id} value={m.id}>{m.name} ({m.id})</option>))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Nombre visible" value={optName} onChange={e => setOptName(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-white text-xs" />
                  <input type="number" step="0.5" min="0" placeholder="Límite ($/mes)" value={optLimit} onChange={e => setOptLimit(parseFloat(e.target.value) || 0)} className="w-full px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-purple-300 font-mono font-bold text-xs" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition disabled:opacity-50">
              <CheckCircle2 size={13} />
              <span>{isSaving ? 'Guardando...' : 'Guardar y Aplicar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

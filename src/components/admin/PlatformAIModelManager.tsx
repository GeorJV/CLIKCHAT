import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';

interface AIConfig {
  primaryModel: string;
  reasoningModel: string;
  splitRatio: string;
  fallbackProvider: string;
}

export const PlatformAIModelManager: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>({
    primaryModel: 'deepseek/deepseek-chat',
    reasoningModel: 'openai/gpt-4o-mini',
    splitRatio: '90/10',
    fallbackProvider: 'cross_fallback'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/ai-config')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.config) setConfig(data.config); })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Estrategia de Modelos IA de la Plataforma (Confidencial Super Admin)
          </h2>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
          Gobierna todas las cuentas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Modelo #1 Principal</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">90% Volumen</span>
          </div>
          <p className="text-xs font-bold text-white">DeepSeek V3 (Chat)</p>
          <p className="text-[10px] text-slate-400">Atención ágil comercial, ventas, precios, stock y catálogo general.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-400 uppercase">Modelo #2 Auxiliar</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">10% Razonamiento</span>
          </div>
          <p className="text-xs font-bold text-white">OpenAI GPT-4o Mini</p>
          <p className="text-[10px] text-slate-400">Cálculos complejos, comparativas técnicas y objeciones complejas.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Respaldo Cruzado</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Alta Disponibilidad</span>
          </div>
          <p className="text-xs font-bold text-white">DeepSeek ⟷ GPT-4o Mini</p>
          <p className="text-[10px] text-slate-400">Conmutación mutua inmediata ante latencia o fallos sin interrupción.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Distribución de Carga</label>
          <select
            value={config.splitRatio}
            onChange={(e) => setConfig({ ...config, splitRatio: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
          >
            <option value="90/10">90% DeepSeek / 10% GPT-4o Mini (Oficial Activo)</option>
            <option value="100/0">100% DeepSeek (Máximo Ahorro & Velocidad)</option>
            <option value="0/100">100% GPT-4o Mini (Máximo Razonamiento)</option>
            <option value="80/20">80% DeepSeek / 20% GPT-4o Mini</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estrategia de Failover</label>
          <select
            value={config.fallbackProvider}
            onChange={(e) => setConfig({ ...config, fallbackProvider: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
          >
            <option value="cross_fallback">Respaldo Cruzado DeepSeek ⟷ GPT-4o Mini</option>
            <option value="workers_ai">Cloudflare Workers AI (Llama 3 Contingencia)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Zap className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado con Éxito!' : 'Aplicar a toda la plataforma'}</span>
        </button>
      </form>
    </div>
  );
};

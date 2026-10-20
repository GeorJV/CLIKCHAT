import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Sparkles, Cpu, Clock, Key, Save, CheckCircle2 } from 'lucide-react';

interface VoceroAiModelSettingsProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroAiModelSettings: React.FC<VoceroAiModelSettingsProps> = ({
  tenant,
  onUpdateSettings
}) => {
  const [model, setModel] = useState(tenant?.custom_ai_config?.model || 'z-ai/glm-5.3-flash');
  const [apiKey, setApiKey] = useState(tenant?.custom_ai_config?.apiKey || '');
  const [cadence, setCadence] = useState(tenant?.response_delay_sec !== undefined ? String(tenant.response_delay_sec) : '0');
  const [tone, setTone] = useState(tenant?.tone_of_voice || 'Profesional y Cortés');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      if (tenant.custom_ai_config?.model) setModel(tenant.custom_ai_config.model);
      if (tenant.custom_ai_config?.apiKey) setApiKey(tenant.custom_ai_config.apiKey);
      if (tenant.response_delay_sec !== undefined) setCadence(String(tenant.response_delay_sec));
      if (tenant.tone_of_voice) setTone(tenant.tone_of_voice);
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const ok = await onUpdateSettings({
        response_delay_sec: Number(cadence) || 0,
        tone_of_voice: tone,
        custom_ai_config: {
          enabled: true,
          provider: 'openrouter',
          model,
          apiKey: apiKey.trim(),
          temperature: 0.3
        }
      });
      if (ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-4xl font-sans">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0a1730] flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#0d5bff]" /> Motor de Inteligencia Artificial
          </h3>
          <p className="text-xs text-[#62728d]">Selecciona el modelo que procesará las consultas y objeciones de tus clientes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Modelo LLM Principal</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            >
              <option value="z-ai/glm-5.3-flash">GLM-5.3-Flash (Ultra Rápido &lt;800ms - Recomendado)</option>
              <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B (Máxima Precisión)</option>
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Razonamiento Superior)</option>
              <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (Equilibrado)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0d5bff]" /> Cadencia de Respuesta
            </label>
            <select
              value={cadence}
              onChange={(e) => setCadence(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            >
              <option value="0">Inmediata (Sin espera, &lt;1 segundo)</option>
              <option value="3">Humanizada Corta (3 segundos de lectura/tipeo)</option>
              <option value="6">Humanizada Realista (6 segundos simulando asesor)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-[#0d5bff]" /> API Key Propia de OpenRouter / Proveedor (Opcional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-... (Dejar vacío para usar la infraestructura de ClikChat)"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs font-mono text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
            <p className="text-[10.5px] text-[#8391aa] mt-1">Si no tienes clave propia, el sistema utiliza el pool de alta velocidad de ClikChat sin interrupciones.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#0d5bff]" /> Tono de Comunicación
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Ej: Amable, alegre, enfocado en cerrar ventas y resolver dudas"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
          {savedSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> ¡Configuración IA guardada!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#0d5bff] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0047e1] transition cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Ajustes de IA'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Cpu, Clock, Key, Save, CheckCircle2 } from 'lucide-react';
import { ToneMultiSelectDropdown } from '../common/ToneMultiSelectDropdown';
import { MessageDeliveryModeSelector } from '../common/MessageDeliveryModeSelector';
import { DeliveryMode } from '../../../utils/messageSplitter';

interface VoceroAiModelSettingsProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroAiModelSettings: React.FC<VoceroAiModelSettingsProps> = ({ tenant, onUpdateSettings }) => {
  const [model, setModel] = useState('@cf/meta/llama-3.3-70b-instruct-fp8-fast');
  const [apiKey, setApiKey] = useState('');
  const [cadence, setCadence] = useState('2');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('interleaved');
  const [tone, setTone] = useState('Profesional y Cortés');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    let savedKey = (tenant as any)?.custom_ai_config?.apiKey || '';
    let savedModel = (tenant as any)?.custom_ai_config?.model || '';
    let savedDelivery = (tenant as any)?.message_delivery_mode || (tenant as any)?.custom_ai_config?.deliveryMode || '';

    if (tenant.custom_llm_key && tenant.custom_llm_key.startsWith('{')) {
      try {
        const parsed = JSON.parse(tenant.custom_llm_key);
        savedKey = parsed.key || savedKey;
        savedModel = parsed.model || savedModel;
        if (parsed.deliveryMode) savedDelivery = parsed.deliveryMode;
      } catch {}
    }
    if (!savedDelivery && typeof window !== 'undefined') {
      savedDelivery = (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) || 'interleaved';
    }
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setModel(savedModel);
    if (savedDelivery) setDeliveryMode(savedDelivery as DeliveryMode);
    if (tenant.response_delay_sec !== undefined) setCadence(String(tenant.response_delay_sec));
    if (tenant.tone_of_voice) setTone(tenant.tone_of_voice);
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    if (typeof window !== 'undefined') localStorage.setItem('clikchat_delivery_mode', deliveryMode);

    const trimmedKey = apiKey.trim();
    const isGoogle = model.includes('gemini') || trimmedKey.startsWith('AIza') || trimmedKey.startsWith('AQ.');
    const provider = model.startsWith('@cf') ? 'cloudflare' : isGoogle ? 'google' : model.includes('gpt') ? 'openai' : 'openrouter';

    const custom_llm_key = JSON.stringify({ key: trimmedKey, provider, model, deliveryMode, cadence: Number(cadence) || 0 });
    const custom_ai_config = { enabled: Boolean(trimmedKey), provider, model, apiKey: trimmedKey, deliveryMode, cadence: Number(cadence) || 0, temperature: 0.3 };

    try {
      const ok = await onUpdateSettings({ response_delay_sec: Number(cadence) || 0, tone_of_voice: tone, message_delivery_mode: deliveryMode, custom_llm_key, custom_ai_config } as any);
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
          <p className="text-xs text-[#62728d]">Configura el modelo LLM, cadencia y modo de envío humanizado de tu asesor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Modelo LLM</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            >
              <optgroup label="Infraestructura ClikChat (Sin costo de API)">
                <option value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">Meta Llama 3.3 70B Fast (Cloudflare Workers AI - Por Defecto)</option>
              </optgroup>
              <optgroup label="Google AI Studio">
                <option value="gemini-1.5-flash">Google Gemini Flash (Ultra Rápido)</option>
                <option value="gemini-1.5-pro">Google Gemini Pro (Alta Capacidad)</option>
              </optgroup>
              <optgroup label="OpenRouter">
                <option value="z-ai/glm-5.3-flash:floor">GLM-5.3-Flash (Floor Económico)</option>
                <option value="deepseek/deepseek-chat">DeepSeek V3 (Chat Comercial)</option>
              </optgroup>
              <optgroup label="OpenAI">
                <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
              </optgroup>
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
              <option value="1">1 segundo (Respuesta rápida)</option>
              <option value="2">2 segundos (Pausa natural de lectura recomendada)</option>
              <option value="3">3 segundos (Humanizada realista)</option>
              <option value="0">0 segundos (Inmediata, sin espera)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <MessageDeliveryModeSelector value={deliveryMode} onChange={setDeliveryMode} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-[#0d5bff]" /> API Key Propia (Google AI Studio / OpenRouter / OpenAI)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (Google Studio) o sk-or-v1-... (OpenRouter) o sk-... (OpenAI)"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs font-mono text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
            <p className="text-[10.5px] text-[#8391aa] mt-1">
              Dejar vacío para usar la infraestructura de ClikChat. Si colocas tu clave de Google AI Studio o de OpenRouter, el bot consumirá directamente tu propia API.
            </p>
          </div>

          <div className="md:col-span-2">
            <ToneMultiSelectDropdown value={tone} onChange={setTone} />
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

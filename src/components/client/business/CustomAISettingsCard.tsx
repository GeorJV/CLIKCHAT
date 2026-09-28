import React, { useState } from 'react';
import { Tenant } from '../../../types';
import { Key, CheckCircle2, ShieldCheck, Eye, EyeOff, ChevronDown, ChevronUp, Bot, RotateCcw } from 'lucide-react';
import { PROVIDER_MODELS, getBusinessEngineConfig } from './customAIConfigs';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const CustomAISettingsCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [provider, setProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-chat');
  const [manualModel, setManualModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasCustomKey = Boolean(tenant?.custom_llm_key);
  const cfg = getBusinessEngineConfig(tenant?.business_type);
  const IconComponent = cfg.icon;

  const handleProviderChange = (p: string) => {
    setProvider(p);
    const models = PROVIDER_MODELS[p] || ['custom'];
    setSelectedModel(models[0] || 'custom');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setIsSaving(true);
    const effectiveModel = selectedModel === 'custom' ? manualModel.trim() : selectedModel;
    const payload = JSON.stringify({ provider, key: apiKey.trim(), model: effectiveModel || undefined });
    await onUpdateSettings({ custom_llm_key: payload as any });
    setApiKey('');
    setIsSaving(false);
  };

  const handleResetToSystem = async () => {
    setIsSaving(true);
    await onUpdateSettings({ custom_llm_key: null as any });
    setShowForm(false);
    setApiKey('');
    setIsSaving(false);
  };

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl border border-[#282626] bg-[#121111]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{cfg.title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{cfg.desc}</p>
          </div>
        </div>
        <div className="self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {cfg.badge}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cfg.skills.map((s, idx) => {
          const SIcon = s.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl border border-[#252323] bg-[#171515] hover:border-emerald-500/30 transition">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400"><SIcon className="w-3.5 h-3.5" /></div>
                <h4 className="text-xs font-bold text-white">{s.title}</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{s.text}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-[#252323] bg-gradient-to-r from-emerald-950/20 to-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Bot className="w-4 h-4" /></div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{tenant?.bot_name || 'Asesora Virtual'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">Mesera Gastronómica</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Asignada y activa para {tenant?.name || 'tu negocio'} • Mantenimiento automático 24/7</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Calibrado & Gestionado</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#222]">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#181616] hover:bg-[#222020] border border-[#2e2b2b] hover:border-emerald-500/40 text-xs font-bold text-zinc-300 hover:text-white transition flex items-center justify-between sm:justify-start gap-2.5 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>¿Quieres agregar tu propio modelo de inteligencia artificial? Ingresa tu API aquí</span>
          </div>
          {showForm ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {showForm && (
          <form onSubmit={handleSave} className="mt-3.5 p-4 rounded-xl border border-[#2a2828] bg-[#161414] space-y-3.5 animate-fadeIn">
            {hasCustomKey && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Modelo personalizado conectado</span>
                <button type="button" onClick={handleResetToSystem} disabled={isSaving} className="text-[11px] text-zinc-400 hover:text-rose-400 underline flex items-center gap-1 cursor-pointer">
                  <RotateCcw className="w-3 h-3" /> Volver al Motor del Sistema
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Proveedor / Plataforma</label>
                <select value={provider} onChange={(e) => handleProviderChange(e.target.value)} className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white">
                  <option value="openrouter">OpenRouter (Multi-LLM / DeepSeek / Llama)</option>
                  <option value="openai">OpenAI (Directo GPT-4o)</option>
                  <option value="google">Google AI Studio (Gemini)</option>
                  <option value="groq">Groq (Ultra Rápido Llama 3.3)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Elige el Modelo</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono">
                  {(PROVIDER_MODELS[provider] || ['custom']).map((m) => (
                    <option key={m} value={m}>{m === 'custom' ? '✍️ Escribir otro modelo manualmente...' : m}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedModel === 'custom' && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Nombre Exacto del Modelo</label>
                <input type="text" value={manualModel} onChange={(e) => setManualModel(e.target.value)} placeholder="Ej: mistralai/mistral-large, deepseek-coder" className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono" />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Pega tu Clave API Privada</label>
              <div className="relative">
                <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} required placeholder="Pega aquí tu clave API privada..." className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 pr-8 text-xs text-emerald-400 font-mono" />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300">
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Modelo conectado con éxito</span> : <span />}
              <button type="submit" disabled={isSaving || !apiKey.trim()} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow transition disabled:opacity-40">
                {isSaving ? 'Guardando...' : 'Guardar mi Modelo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Sparkles, Key, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const CustomAISettingsCard: React.FC<Props> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const [aiMode, setAiMode] = useState<'system' | 'custom'>('system');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('google');
  const [customModel, setCustomModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.custom_llm_key) {
      const raw = tenant.custom_llm_key.trim();
      if (raw.startsWith('{')) {
        try {
          const parsed = JSON.parse(raw);
          setApiKey(parsed.key || '');
          setProvider(parsed.provider || 'google');
          setCustomModel(parsed.model || '');
          setAiMode('custom');
          return;
        } catch {}
      }
      setApiKey(raw);
      setAiMode('custom');
      if (raw.startsWith('AIza') || raw.startsWith('AQ.')) setProvider('google');
      else if (raw.startsWith('sk-or-')) setProvider('openrouter');
      else if (raw.startsWith('sk-')) setProvider('openai');
    } else {
      setAiMode('system');
      setApiKey('');
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let finalKey = null;
    if (aiMode === 'custom' && apiKey.trim()) {
      finalKey = JSON.stringify({ provider, key: apiKey.trim(), model: customModel.trim() || undefined });
    }
    await onUpdateSettings({ custom_llm_key: finalKey as any });
    setIsSaving(false);
  };

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl border border-[#282626] bg-[#121111]">
      <div className="flex items-center justify-between border-b border-[#242323] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Motor de Inteligencia Artificial</h3>
            <p className="text-[11px] text-zinc-400">Define si deseas utilizar la IA predefinida del sistema o conectar tu propia clave.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${aiMode === 'system' ? 'border-emerald-500/60 bg-emerald-500/[0.04]' : 'border-[#282626] bg-[#181616] hover:border-zinc-700'}`}>
            <div className="flex items-start gap-2.5">
              <input type="radio" name="aiMode" value="system" checked={aiMode === 'system'} onChange={() => setAiMode('system')} className="mt-1 text-emerald-500 focus:ring-0" />
              <div>
                <span className="block text-xs font-bold text-white">Modelo del Sistema (Predefinido)</span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Optimizado para alta velocidad comercial, catálogo y ventas automáticas 24/7.</span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> <span>Recomendado & Gestionado</span>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${aiMode === 'custom' ? 'border-purple-500/60 bg-purple-500/[0.04]' : 'border-[#282626] bg-[#181616] hover:border-zinc-700'}`}>
            <div className="flex items-start gap-2.5">
              <input type="radio" name="aiMode" value="custom" checked={aiMode === 'custom'} onChange={() => setAiMode('custom')} className="mt-1 text-purple-500 focus:ring-0" />
              <div>
                <span className="block text-xs font-bold text-white">Conectar mi propia IA (Personalizada)</span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">Utiliza tu propia cuenta de API (Google AI Studio, OpenAI, OpenRouter, etc.).</span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-purple-400">
              <Key className="w-3 h-3" /> <span>Clave API Propia</span>
            </div>
          </label>
        </div>

        {aiMode === 'custom' && (
          <div className="p-4 rounded-xl border border-[#2a2828] bg-[#171515] space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Proveedor de IA</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white">
                  <option value="google">Google AI Studio (Gemini 1.5/2.0)</option>
                  <option value="openai">OpenAI (Directo GPT-4o / Mini)</option>
                  <option value="openrouter">OpenRouter (Multi-Proveedor / DeepSeek / Claude)</option>
                  <option value="other">Otro Proveedor Compatible</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Modelo Opcional</label>
                <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="Ej: gemini-1.5-flash, gpt-4o-mini" className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">API Key Privada</label>
              <div className="relative">
                <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} required={aiMode === 'custom'} placeholder="Pega tu clave API aquí..." className="w-full bg-[#111010] border border-[#333] rounded-lg px-2.5 py-1.5 pr-8 text-xs text-emerald-400 font-mono" />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-300">
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Motor IA actualizado</span>
          ) : <span />}
          <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-md transition disabled:opacity-50">
            {isSaving ? 'Guardando...' : 'Guardar Motor IA'}
          </button>
        </div>
      </form>
    </div>
  );
};

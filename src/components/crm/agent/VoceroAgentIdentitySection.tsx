import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Bot, MessageSquare, Sparkles, User, Save, CheckCircle2 } from 'lucide-react';

interface VoceroAgentIdentitySectionProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroAgentIdentitySection: React.FC<VoceroAgentIdentitySectionProps> = ({
  tenant,
  onUpdateSettings,
}) => {
  const [botName, setBotName] = useState(tenant?.bot_name || '');
  const [welcomeMessage, setWelcomeMessage] = useState(tenant?.welcome_message || '');
  const [tone, setTone] = useState(tenant?.tone_of_voice || 'Cercano y Amigable');
  const [systemPrompt, setSystemPrompt] = useState(tenant?.system_prompt || '');
  const [avatarUrl, setAvatarUrl] = useState(tenant?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      if (tenant.bot_name) setBotName(tenant.bot_name);
      if (tenant.welcome_message !== undefined) setWelcomeMessage(tenant.welcome_message);
      if (tenant.tone_of_voice) setTone(tenant.tone_of_voice);
      if (tenant.system_prompt !== undefined) setSystemPrompt(tenant.system_prompt);
      if (tenant.avatar_url !== undefined) setAvatarUrl(tenant.avatar_url);
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    const ok = await onUpdateSettings({
      bot_name: botName.trim(),
      welcome_message: welcomeMessage.trim(),
      tone_of_voice: tone,
      system_prompt: systemPrompt.trim(),
      avatar_url: avatarUrl.trim(),
    });

    setIsSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const TONES = [
    'Cercano y Amigable',
    'Profesional y Cortés',
    'Vendedor Persuasivo',
    'Enérgico y Dinámico',
    'Empático y Resolutivo',
  ];

  return (
    <form onSubmit={handleSave} className="space-y-5 font-sans">
      <div className="border-b border-[#e8edf6] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0a1730]">Identidad & Personalidad del Agente</h3>
          <p className="text-xs text-[#62728d] mt-0.5">
            Configura el nombre, saludo inicial, tono conversacional y las instrucciones maestras de tu IA.
          </p>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ¡Guardado con éxito!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#0a1730] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-[#0d5bff]" /> Nombre del Asistente Virtual
          </label>
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="Ej: Valeria (Mesera Virtual) o Asesor Comercial"
            className="w-full rounded-xl border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-2 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0a1730] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0d5bff]" /> Tono de Voz Conversacional
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-xl border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-2 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#0a1730] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#0d5bff]" /> Mensaje de Bienvenida Inicial
        </label>
        <textarea
          rows={2}
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="Ej: ¡Hola! 👋 Bienvenido a nuestro negocio. ¿En qué puedo asesorarte hoy?"
          className="w-full rounded-xl border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-2 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition resize-none"
        />
        <p className="text-[11px] text-[#8391aa] mt-1">Este mensaje se envía automáticamente en el segundo 0 al abrir el chat.</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#0a1730] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#0d5bff]" /> Instrucciones Maestras del Sistema (System Prompt)
        </label>
        <textarea
          rows={4}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Ej: Eres la asesora virtual del comercio. Tu objetivo es orientar al cliente en su compra, resolver dudas con el menú y canalizar la orden a WhatsApp sin inventar precios."
          className="w-full rounded-xl border border-[#dde5f1] bg-[#f6f8fc] px-3.5 py-2 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition font-mono text-[11.5px]"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#0d5bff]/20 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando Identidad...' : 'Guardar Identidad del Agente'}</span>
        </button>
      </div>
    </form>
  );
};

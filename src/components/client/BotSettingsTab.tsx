import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types';
import { Settings, Save, CheckCircle, Clock, Bot, MessageCircle } from 'lucide-react';

interface BotSettingsTabProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const BotSettingsTab: React.FC<BotSettingsTabProps> = ({ tenant, onUpdateSettings, saveSuccess }) => {
  const [botName, setBotName] = useState(tenant?.bot_name || '');
  const [welcomeMsg, setWelcomeMsg] = useState(tenant?.welcome_message || '');
  const [businessHours, setBusinessHours] = useState(tenant?.business_hours || 'Lunes a Sábado de 8:00 AM a 7:00 PM');
  const [systemPrompt, setSystemPrompt] = useState(tenant?.system_prompt || '');
  const [ctaUrl, setCtaUrl] = useState(tenant?.cta_url || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setBotName(tenant.bot_name || '');
      setWelcomeMsg(tenant.welcome_message || '');
      setBusinessHours(tenant.business_hours || 'Lunes a Sábado de 8:00 AM a 7:00 PM');
      setSystemPrompt(tenant.system_prompt || '');
      setCtaUrl(tenant.cta_url || '');
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({
      bot_name: botName,
      welcome_message: welcomeMsg,
      business_hours: businessHours,
      system_prompt: systemPrompt,
      cta_url: ctaUrl
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Configuración del Asesor & Horario Comercial</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Personaliza la personalidad del bot y tu horario de atención para los clientes.</p>
        </div>
        {saveSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5" /> ¡Guardado en D1!
          </span>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Nombre del Asesor Virtual
          </label>
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Horario de Atención Humana (Para dudas no resueltas)
          </label>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            placeholder="Ej: Lunes a Sábado de 8:00 AM a 7:00 PM"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Si el cliente hace una pregunta que el bot no sabe, se le informará tu horario para que sepa cuándo recibirá tu respuesta.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Mensaje de Bienvenida del Chat</label>
          <textarea
            value={welcomeMsg}
            onChange={(e) => setWelcomeMsg(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[60px]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Directrices Comerciales (System Prompt para RAG Nivel 3)</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Enlace de Compra / WhatsApp
          </label>
          <input
            type="text"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="https://wa.me/..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando cambios...' : 'Guardar Ajustes del Negocio'}</span>
        </button>
      </div>
    </form>
  );
};

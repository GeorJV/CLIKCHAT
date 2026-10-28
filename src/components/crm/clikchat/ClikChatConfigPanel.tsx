import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Bot, Save, CheckCircle2, MessageSquare, Palette } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const ClikChatConfigPanel: React.FC<Props> = ({ tenant, onUpdateSettings }) => {
  const [botName, setBotName] = useState(tenant?.bot_name || 'Valeria');
  const [welcomeMessage, setWelcomeMessage] = useState(tenant?.welcome_message || '¡Hola! Bienvenido. ¿En qué te puedo asesorar hoy?');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color || '#0d5bff');
  const [ctaText, setCtaText] = useState(tenant?.cta_text || 'Hacer Pedido');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      if (tenant.bot_name) setBotName(tenant.bot_name);
      if (tenant.welcome_message) setWelcomeMessage(tenant.welcome_message);
      if (tenant.primary_color) setPrimaryColor(tenant.primary_color);
      if (tenant.cta_text) setCtaText(tenant.cta_text);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const ok = await onUpdateSettings({
        bot_name: botName,
        welcome_message: welcomeMessage,
        primary_color: primaryColor,
        cta_text: ctaText,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl font-sans">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0a1730] flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#0d5bff]" />
            <span>Personalización del Asesor Web ClikChat</span>
          </h3>
          <p className="text-xs text-[#62728d] mt-0.5">
            El agente comparte el mismo catálogo, flujo en 4 pasos y base de conocimiento con todas las plataformas, pero aquí puedes afinar su presencia en la web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Nombre Visible del Agente</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Ej: Valeria (Mesera Virtual), Asesor Comercial"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-[#0d5bff]" /> Color de Marca del Chat Web
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-10 rounded-lg border border-[#d8e2f0] p-0.5 cursor-pointer bg-white"
              />
              <span className="font-mono text-xs text-[#42506b] uppercase">{primaryColor}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#0d5bff]" /> Mensaje de Bienvenida Web
            </label>
            <textarea
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="¡Hola! Con mucho gusto te asesoro..."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Texto del Botón Principal (CTA)</label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Hacer Pedido / Comprar Ahora"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
          {savedSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> ¡Ajustes del bot web guardados!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0047e1] transition cursor-pointer disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Guardando datos...' : 'Guardar Ajustes'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

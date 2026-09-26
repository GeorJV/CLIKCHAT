import React, { useState, useEffect, useRef } from 'react';
import { Tenant } from '../../../types';
import { SettingsBusinessTypeStep } from '../settings/SettingsBusinessTypeStep';
import { ImageUploadField } from '../ImageUploadField';
import { RefreshCw, Save, CheckCircle2 } from 'lucide-react';

interface BusinessIdentitySubTabProps {
  tenant: Tenant | null; tenantSlug: string;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>; saveSuccess: boolean;
}

export const BusinessIdentitySubTab: React.FC<BusinessIdentitySubTabProps> = ({
  tenant, tenantSlug, onUpdateSettings, saveSuccess
}) => {
  const [bizType, setBizType] = useState(tenant?.business_type || 'restaurante');
  const [currency, setCurrency] = useState(tenant?.currency || 'CRC');
  const [name, setName] = useState(tenant?.name || 'Restaurante ClikChat');
  const [slug, setSlug] = useState(tenant?.slug || tenantSlug || 'geosoft');
  const [botName, setBotName] = useState(tenant?.bot_name || 'Asesora Virtual');
  const [welcomeMessage, setWelcomeMessage] = useState(tenant?.welcome_message || '');
  const [tone, setTone] = useState(tenant?.tone_of_voice || 'Profesional y Cortés');
  const [systemPrompt, setSystemPrompt] = useState(tenant?.system_prompt || '');
  const [logoUrl, setLogoUrl] = useState(tenant?.logo_url || '');
  const [avatarUrl, setAvatarUrl] = useState(tenant?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [localSaved, setLocalSaved] = useState(false);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    if (tenant && !isDirtyRef.current) {
      if (tenant.name) setName(tenant.name);
      if (tenant.slug) setSlug(tenant.slug);
      if (tenant.bot_name) setBotName(tenant.bot_name);
      if (tenant.welcome_message !== undefined) setWelcomeMessage(tenant.welcome_message);
      if (tenant.tone_of_voice) setTone(tenant.tone_of_voice);
      if (tenant.logo_url !== undefined) setLogoUrl(tenant.logo_url);
      if (tenant.avatar_url !== undefined) setAvatarUrl(tenant.avatar_url);
      if (tenant.system_prompt !== undefined) setSystemPrompt(tenant.system_prompt);
      if (tenant.business_type) setBizType(tenant.business_type);
      if (tenant.currency) setCurrency(tenant.currency);
    }
  }, [tenant, tenantSlug]);

  const handleAutoSlug = () => {
    const gen = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (gen) { setSlug(gen); isDirtyRef.current = true; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onUpdateSettings({
      name: name.trim(), slug: slug.trim(), bot_name: botName.trim(),
      welcome_message: welcomeMessage.trim(), tone_of_voice: tone, currency,
      system_prompt: systemPrompt.trim(), logo_url: logoUrl, avatar_url: avatarUrl, business_type: bizType
    });
    setIsSaving(false);
    if (ok) {
      isDirtyRef.current = false;
      setLocalSaved(true);
      setTimeout(() => setLocalSaved(false), 4000);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <SettingsBusinessTypeStep selectedBizType={bizType} onSelectBizType={(t) => { setBizType(t); isDirtyRef.current = true; }} />

      <form onSubmit={handleSubmit} className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Negocio</label>
            <input
              type="text" value={name} onChange={(e) => { setName(e.target.value); isDirtyRef.current = true; }}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              placeholder="Ej. GeoSoft" required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-300">Slug para la URL</label>
              <button type="button" onClick={handleAutoSlug} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer">
                Auto-generar <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus-within:border-emerald-500">
              <span className="text-zinc-500 font-mono mr-1.5 select-none">/</span>
              <input
                type="text" value={slug} onChange={(e) => { setSlug(e.target.value); isDirtyRef.current = true; }}
                className="bg-transparent flex-1 text-emerald-400 font-mono focus:outline-none text-xs font-bold"
                placeholder="geosoft" required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Asesor IA</label>
            <input
              type="text" value={botName} onChange={(e) => { setBotName(e.target.value); isDirtyRef.current = true; }}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              placeholder="Ej. Sofía - Asesora VIP"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Moneda Oficial</label>
            <select
              value={currency} onChange={(e) => { setCurrency(e.target.value); isDirtyRef.current = true; }}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="CRC">CRC (₡ Colones)</option>
              <option value="USD">USD ($ Dólares)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Tono de Voz de la IA</label>
            <select
              value={tone} onChange={(e) => { setTone(e.target.value); isDirtyRef.current = true; }}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="Profesional y Cortés">🏢 Profesional</option>
              <option value="Amigable y Enérgico">⚡ Amigable</option>
              <option value="Experto Consultor y Técnico">🔬 Experto</option>
              <option value="Persuasivo y Enfocado a Cierre">🎯 Persuasivo</option>
              <option value="Cálido y Empático">❤️ Cálido</option>
              <option value="Elegante y Exclusivo (Lujo)">✨ Elegante</option>
              <option value="Minimalista y Directo al Grano">⏱️ Minimalista</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">Saludo Inicial del Chatbot (Mensaje de Bienvenida)</label>
          <textarea
            rows={2} value={welcomeMessage} onChange={(e) => { setWelcomeMessage(e.target.value); isDirtyRef.current = true; }}
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="¡Hola! Te doy la bienvenida a nuestro negocio..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">Descripción General (Contexto Base para RAG Nivel 1)</label>
          <textarea
            rows={3} value={systemPrompt} onChange={(e) => { setSystemPrompt(e.target.value); isDirtyRef.current = true; }}
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="Portafolio de Productos y Soluciones (SaaS y Proyectos)..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ImageUploadField label="Logotipo del Negocio" sublabel="Subir archivo o pegar con mouse/Ctrl+V" value={logoUrl} onChange={(val) => { setLogoUrl(val); isDirtyRef.current = true; }} />
          <ImageUploadField label="Avatar del Asesor IA" sublabel="Subir foto 1:1 o pegar del portapapeles" value={avatarUrl} onChange={(val) => { setAvatarUrl(val); isDirtyRef.current = true; }} aspectRatio="square" />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#282626]">
          {(saveSuccess || localSaved) && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Cambios guardados con éxito en la base de datos!
            </span>
          )}
          <button
            type="submit" disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

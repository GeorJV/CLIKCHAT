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
  const effectiveSlug = tenant?.slug || tenantSlug || 'active';
  const draftKey = `clikchat_draft_identity_${effectiveSlug}`;
  const getDraft = () => {
    if (typeof window === 'undefined') return null;
    try { const s = localStorage.getItem(draftKey); return s ? JSON.parse(s) : null; } catch { return null; }
  };
  const draft = getDraft();
  const isDemo = (tenant?.slug === 'geosoft') || (tenantSlug === 'geosoft');
  const [bizType, setBizType] = useState(draft?.bizType || tenant?.business_type || (isDemo ? 'restaurante' : 'tienda'));
  const [currency, setCurrency] = useState(draft?.currency || tenant?.currency || 'CRC');
  const [name, setName] = useState(draft?.name || tenant?.name || (isDemo ? 'Restaurante ClikChat' : ''));
  const [slug, setSlug] = useState(draft?.slug || tenant?.slug || (isDemo ? 'geosoft' : (tenantSlug && tenantSlug !== 'geosoft' ? tenantSlug : '')));
  const [botName, setBotName] = useState(draft?.botName || tenant?.bot_name || (isDemo ? 'Asesora Virtual' : ''));
  const [welcomeMessage, setWelcomeMessage] = useState(draft?.welcomeMessage !== undefined ? draft.welcomeMessage : (tenant?.welcome_message || ''));
  const [tone, setTone] = useState(draft?.tone || tenant?.tone_of_voice || 'Profesional y Cortés');
  const [systemPrompt, setSystemPrompt] = useState(draft?.systemPrompt !== undefined ? draft.systemPrompt : (tenant?.system_prompt || ''));
  const [logoUrl, setLogoUrl] = useState(draft?.logoUrl !== undefined ? draft.logoUrl : (tenant?.logo_url || ''));
  const [avatarUrl, setAvatarUrl] = useState(draft?.avatarUrl !== undefined ? draft.avatarUrl : (tenant?.avatar_url || ''));
  const [isSaving, setIsSaving] = useState(false);
  const [localSaved, setLocalSaved] = useState(false);
  const isDirtyRef = useRef(Boolean(draft));

  useEffect(() => {
    if (isDirtyRef.current && typeof window !== 'undefined') {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ name, slug, botName, welcomeMessage, tone, systemPrompt, logoUrl, avatarUrl, bizType, currency }));
      } catch {}
    }
  }, [name, slug, botName, welcomeMessage, tone, systemPrompt, logoUrl, avatarUrl, bizType, currency, draftKey]);

  useEffect(() => {
    if (tenant && !isDirtyRef.current) {
      if (getDraft()) return;
      const isDemoStore = tenant.slug === 'geosoft' || tenantSlug === 'geosoft';
      if (tenant.name || isDemoStore) setName(tenant.name || (isDemoStore ? 'Restaurante ClikChat' : ''));
      if (tenant.slug || isDemoStore) setSlug(tenant.slug || (isDemoStore ? 'geosoft' : (tenantSlug && tenantSlug !== 'geosoft' ? tenantSlug : '')));
      if (tenant.bot_name || isDemoStore) setBotName(tenant.bot_name || (isDemoStore ? 'Asesora Virtual' : ''));
      if (tenant.welcome_message !== undefined) setWelcomeMessage(tenant.welcome_message || '');
      if (tenant.tone_of_voice) setTone(tenant.tone_of_voice || 'Profesional y Cortés');
      if (tenant.logo_url !== undefined) setLogoUrl(tenant.logo_url || '');
      if (tenant.avatar_url !== undefined) setAvatarUrl(tenant.avatar_url || '');
      if (tenant.system_prompt !== undefined) setSystemPrompt(tenant.system_prompt || '');
      if (tenant.business_type) setBizType(tenant.business_type || (isDemoStore ? 'restaurante' : 'tienda'));
      if (tenant.currency) setCurrency(tenant.currency || 'CRC');
    }
  }, [tenant, tenantSlug]);

  const handleAutoSlug = () => {
    const gen = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (gen) { isDirtyRef.current = true; setSlug(gen); }
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
      try { localStorage.removeItem(draftKey); } catch {}
      setLocalSaved(true);
      setTimeout(() => setLocalSaved(false), 4000);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <SettingsBusinessTypeStep selectedBizType={bizType} onSelectBizType={(t) => { isDirtyRef.current = true; setBizType(t); }} />
      <form onSubmit={handleSubmit} className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Negocio</label>
            <input type="text" value={name} onChange={(e) => { isDirtyRef.current = true; setName(e.target.value); }} className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold" placeholder="Ej: Mi Restaurante o Tienda" required />
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
              <input type="text" value={slug} onChange={(e) => { isDirtyRef.current = true; setSlug(e.target.value); }} className="bg-transparent flex-1 text-emerald-400 font-mono focus:outline-none text-xs font-bold" placeholder="mi-negocio" required />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Asesor IA</label>
            <input type="text" value={botName} onChange={(e) => { isDirtyRef.current = true; setBotName(e.target.value); }} className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold" placeholder="Ej. Sofía - Asesora VIP" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Moneda Oficial</label>
            <select value={currency} onChange={(e) => { isDirtyRef.current = true; setCurrency(e.target.value); }} className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500">
              <option value="CRC">CRC (₡ Colones)</option>
              <option value="USD">USD ($ Dólares)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Tono de Voz de la IA</label>
            <select value={tone} onChange={(e) => { setTone(e.target.value); isDirtyRef.current = true; }} className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold">
              {[
                ['Profesional y Cortés', '🏢 Profesional'],
                ['Amigable y Enérgico', '⚡ Amigable'],
                ['Experto Consultor y Técnico', '🔬 Experto'],
                ['Persuasivo y Enfocado a Cierre', '🎯 Persuasivo'],
                ['Cálido y Empático', '❤️ Cálido'],
                ['Elegante y Exclusivo (Lujo)', '✨ Elegante'],
                ['Minimalista y Directo al Grano', '⏱️ Minimalista']
              ].map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">Saludo Inicial del Chatbot (Mensaje de Bienvenida)</label>
          <textarea rows={2} value={welcomeMessage} onChange={(e) => { isDirtyRef.current = true; setWelcomeMessage(e.target.value); }} className="w-full bg-[#111010] border border-[#282626] rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans" placeholder="¡Hola! Te doy la bienvenida a nuestro negocio..." />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">Descripción General (Contexto Base para RAG Nivel 1)</label>
          <textarea rows={3} value={systemPrompt} onChange={(e) => { isDirtyRef.current = true; setSystemPrompt(e.target.value); }} className="w-full bg-[#111010] border border-[#282626] rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans" placeholder="Portafolio de Productos y Soluciones (SaaS y Proyectos)..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ImageUploadField label="Logotipo del Negocio" sublabel="Subir archivo o pegar con mouse/Ctrl+V" value={logoUrl} onChange={(val) => { isDirtyRef.current = true; setLogoUrl(val); }} />
          <ImageUploadField label="Avatar del Asesor IA" sublabel="Subir foto 1:1 o pegar del portapapeles" value={avatarUrl} onChange={(val) => { isDirtyRef.current = true; setAvatarUrl(val); }} aspectRatio="square" />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#282626]">
          {(saveSuccess || localSaved) && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Cambios guardados con éxito en la base de datos!
            </span>
          )}
          <button type="submit" disabled={isSaving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer">
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Tenant } from '../../../types';
import { SettingsBusinessTypeStep } from '../settings/SettingsBusinessTypeStep';
import { ImageUploadField } from '../ImageUploadField';
import { RefreshCw, Save, CheckCircle2 } from 'lucide-react';

interface BusinessIdentitySubTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const BusinessIdentitySubTab: React.FC<BusinessIdentitySubTabProps> = ({
  tenant,
  tenantSlug,
  onUpdateSettings,
  saveSuccess
}) => {
  const [bizType, setBizType] = useState('tienda');
  const [name, setName] = useState(tenant?.name || 'GeoSoft');
  const [slug, setSlug] = useState(tenant?.slug || tenantSlug || 'geosoft');
  const [tone, setTone] = useState(tenant?.tone_of_voice || 'Profesional y Cortés');
  const [systemPrompt, setSystemPrompt] = useState(tenant?.system_prompt || '');
  const [logoUrl, setLogoUrl] = useState(tenant?.logo_url || '');
  const [avatarUrl, setAvatarUrl] = useState(tenant?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false); const isDirtyRef = useRef(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
      setSlug(tenant.slug || tenantSlug || '');
      setTone(tenant.tone_of_voice || 'Profesional y Cortés');
      setLogoUrl(tenant.logo_url || '');
      setAvatarUrl(tenant.avatar_url || '');
      if (tenant.system_prompt) setSystemPrompt(tenant.system_prompt);
    }
  }, [tenant, tenantSlug]);

  const handleAutoSlug = () => {
    const gen = name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (gen) { setSlug(gen); isDirtyRef.current = true; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({
      name,
      slug,
      tone_of_voice: tone,
      system_prompt: systemPrompt,
      logo_url: logoUrl,
      avatar_url: avatarUrl
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* 1. Tipo de Negocio (Configuración Automática) */}
      <SettingsBusinessTypeStep selectedBizType={bizType} onSelectBizType={(t) => { setBizType(t); isDirtyRef.current = true; }} />

      {/* 2. Formulario de Identidad y Contexto RAG */}
      <form onSubmit={handleSubmit} className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Negocio</label>
            <input
              type="text" value={name} onChange={(e) => { setName(e.target.value); isDirtyRef.current = true; }}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              placeholder="Ej. GeoSoft"
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
                placeholder="geosoft"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">Tono de Voz de la IA</label>
          <select
            value={tone} onChange={(e) => { setTone(e.target.value); isDirtyRef.current = true; }}
            className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
          >
            <option value="Profesional y Cortés">🏢 Profesional y Cortés (Corporativo & Respetuoso)</option> <option value="Amigable y Enérgico">⚡ Amigable y Enérgico (Cercano & Dinámico)</option>
            <option value="Experto Consultor y Técnico">🔬 Experto Consultor y Técnico (Detallado)</option> <option value="Persuasivo y Enfocado a Cierre">🎯 Persuasivo y Enfocado a Cierre (Ventas)</option>
            <option value="Cálido y Empático">❤️ Cálido y Empático (Servicial & Humano)</option> <option value="Elegante y Exclusivo (Lujo)">✨ Elegante y Exclusivo (VIP & Premium)</option>
            <option value="Divertido y Creativo">🎉 Divertido y Creativo (Casual)</option> <option value="Minimalista y Directo al Grano">⏱️ Minimalista y Directo al Grano</option>
            <option value="Asesor Financiero y de Valor">💡 Asesor de Valor y Rentabilidad</option> <option value="Urgencia y Alta Conversión (Flash)">🔥 Urgencia y Alta Conversión</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">
            Descripción General (Contexto Base para RAG Nivel 1)
          </label>
          <textarea
            rows={3} value={systemPrompt} onChange={(e) => { setSystemPrompt(e.target.value); isDirtyRef.current = true; }}
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="Portafolio de Productos y Soluciones (SaaS y Proyectos)..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ImageUploadField
            label="Logotipo del Negocio" sublabel="Subir archivo o pegar con mouse/Ctrl+V"
            value={logoUrl} onChange={(val) => { setLogoUrl(val); isDirtyRef.current = true; }}
          />
          <ImageUploadField
            label="Avatar del Asesor IA" sublabel="Subir foto 1:1 o pegar del portapapeles"
            value={avatarUrl} onChange={(val) => { setAvatarUrl(val); isDirtyRef.current = true; }} aspectRatio="square"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#282626]">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado correctamente
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

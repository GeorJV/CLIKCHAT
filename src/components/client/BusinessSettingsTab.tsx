import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types';
import { BusinessLandingCard } from './BusinessLandingCard';
import { RefreshCw, Upload, Save, CheckCircle2 } from 'lucide-react';

interface BusinessSettingsTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
}

export const BusinessSettingsTab: React.FC<BusinessSettingsTabProps> = ({
  tenant,
  tenantSlug,
  onUpdateSettings,
  saveSuccess
}) => {
  const [name, setName] = useState(tenant?.name || 'Aura Skincare & Tech');
  const [slug, setSlug] = useState(tenant?.slug || tenantSlug || 'aura-glow');
  const [tone, setTone] = useState(tenant?.tone_of_voice || 'Profesional y Cortés');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color || '#32AAC8');
  const [systemPrompt, setSystemPrompt] = useState(
    tenant?.system_prompt ||
    'Eres Aria, asesora experta en ventas de Aura Glow. Responde con calidez, destaca los beneficios dermatológicos, y guía al cliente hacia la compra con naturalidad sin ser invasiva.'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
      setSlug(tenant.slug || tenantSlug || '');
      setTone(tenant.tone_of_voice || 'Profesional y Cortés');
      setPrimaryColor(tenant.primary_color || '#32AAC8');
      if (tenant.system_prompt) setSystemPrompt(tenant.system_prompt);
    }
  }, [tenant, tenantSlug]);

  const handleAutoSlug = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (generated) setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({
      name,
      slug,
      tone_of_voice: tone,
      primary_color: primaryColor,
      system_prompt: systemPrompt
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 max-w-4xl text-slate-100 font-sans">
      <div>
        <h2 className="text-lg font-black tracking-tight text-white">Mi Negocio</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configura la identidad de tu marca, el slug público para clientes y el contexto base para el agente.
        </p>
      </div>

      <BusinessLandingCard slug={slug} />

      <form onSubmit={handleSubmit} className="onyx-card rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Nombre del Negocio</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-300">Slug para la URL</label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
              >
                Auto-generar <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus-within:border-emerald-500">
              <span className="text-zinc-500 font-mono mr-1.5 select-none">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-transparent flex-1 text-white font-mono focus:outline-none text-xs"
                placeholder="mi-tienda"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Tono de Voz de la IA</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Profesional y Cortés">Profesional y Cortés</option>
              <option value="Amigable y Enérgico">Amigable y Enérgico</option>
              <option value="Experto Consultor y Técnico">Experto Consultor y Técnico</option>
              <option value="Persuasivo y Enfocado a Cierre">Persuasivo y Enfocado a Cierre</option>
              <option value="Cálido y Empático">Cálido y Empático</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Color Primario de la Marca</label>
            <div className="flex items-center gap-2 bg-[#111010] border border-[#282626] rounded-xl px-3 py-1.5">
              <label
                className="w-5 h-5 rounded-md cursor-pointer border border-white/20 relative shrink-0 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="bg-transparent text-xs font-mono text-white focus:outline-none flex-1 uppercase"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">
            Descripción General (Contexto Base para RAG Nivel 1)
          </label>
          <textarea
            rows={3}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-[#111010] border border-[#282626] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Logotipo</label>
            <label className="border border-dashed border-[#282626] hover:border-[#3e3b3b] bg-[#111010] rounded-xl py-3 px-3 flex flex-col items-center justify-center cursor-pointer transition text-center">
              <Upload className="w-4 h-4 text-zinc-400 mb-1" />
              <span className="text-xs text-zinc-300 font-medium">Subir logo (PNG, JPG)</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Avatar del Agente IA</label>
            <label className="border border-dashed border-[#282626] hover:border-[#3e3b3b] bg-[#111010] rounded-xl py-3 px-3 flex flex-col items-center justify-center cursor-pointer transition text-center">
              <Upload className="w-4 h-4 text-zinc-400 mb-1" />
              <span className="text-xs text-zinc-300 font-medium">Subir avatar (1:1)</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#282626]">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado en D1!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

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
      primary_color: primaryColor,
      system_prompt: systemPrompt
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-2.5 max-w-4xl text-slate-100 font-sans">
      <div>
        <h2 className="text-lg font-black tracking-tight text-white">Mi Negocio</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configura la identidad de tu marca, el slug público para clientes y el contexto base para el agente.
        </p>
      </div>

      <BusinessLandingCard slug={slug} />

      <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Nombre del Negocio</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-300">Slug para la URL (Identificador Único)</label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                Auto-generado <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus-within:border-indigo-500">
              <span className="text-slate-500 font-mono mr-1.5 select-none">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-transparent flex-1 text-white font-mono focus:outline-none text-xs"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Solo letras minúsculas, números y guiones. Se actualiza automáticamente al guardar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Tono de Voz de la IA</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Profesional y Cortés">Profesional y Cortés</option>
              <option value="Amigable y Enérgico">Amigable y Enérgico</option>
              <option value="Experto Consultor y Técnico">Experto Consultor y Técnico</option>
              <option value="Persuasivo y Enfocado a Cierre">Persuasivo y Enfocado a Cierre</option>
              <option value="Cálido y Empático">Cálido y Empático</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Color Primario de la Marca</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <label
                className="w-6 h-6 rounded-md cursor-pointer border border-white/20 relative shrink-0 shadow-sm"
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
          <label className="block text-[11px] font-bold text-slate-300 mb-1">
            Descripción General (Contexto Base para RAG Nivel 1)
          </label>
          <textarea
            rows={3}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
          <p className="text-[10px] text-slate-400 mt-0.5">
            Esta información alimentará el Nivel 1 del RAG (Memoria Base) para que el bot conozca a qué se dedica tu negocio y responda de forma personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Logotipo</label>
            <label className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-lg py-2.5 px-2.5 flex flex-col items-center justify-center cursor-pointer transition text-center">
              <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
              <span className="text-[11px] text-slate-300 font-medium">Subir logo (PNG, JPG)</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Avatar del Agente IA</label>
            <label className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-lg py-2.5 px-2.5 flex flex-col items-center justify-center cursor-pointer transition text-center">
              <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
              <span className="text-[11px] text-slate-300 font-medium">Subir avatar (1:1)</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1.5 border-t border-slate-800/60">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado en D1!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

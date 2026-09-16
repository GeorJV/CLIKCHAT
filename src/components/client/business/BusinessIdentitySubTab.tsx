import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { SettingsBusinessTypeStep } from '../settings/SettingsBusinessTypeStep';
import { Store, Save, CheckCircle2, ExternalLink } from 'lucide-react';

interface BusinessIdentitySubTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
  onOpenLiveChat?: () => void;
}

export const BusinessIdentitySubTab: React.FC<BusinessIdentitySubTabProps> = ({
  tenant,
  tenantSlug,
  onUpdateSettings,
  saveSuccess,
  onOpenLiveChat
}) => {
  const [bizType, setBizType] = useState('tienda');
  const [name, setName] = useState(tenant?.name || '');
  const [slug, setSlug] = useState(tenant?.slug || tenantSlug || '');
  const [phone, setPhone] = useState(tenant?.cta_url || '');
  const [botName, setBotName] = useState(tenant?.bot_name || 'Sofía');
  const [botRole, setBotRole] = useState('Asesor Comercial & Ventas');
  const [hours, setHours] = useState(tenant?.business_hours || 'Lunes a Sábado de 9am a 6pm.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
      setSlug(tenant.slug || tenantSlug || '');
      setPhone(tenant.cta_url || '');
      setBotName(tenant.bot_name || 'Sofía');
      if (tenant.business_hours) setHours(tenant.business_hours);
    }
  }, [tenant, tenantSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({
      name,
      slug,
      cta_url: phone,
      bot_name: botName,
      business_hours: hours,
      system_prompt: `Rol: ${botRole}. Horarios: ${hours}. Tipo de negocio: ${bizType}.`
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* 1. Selector de Tipo de Negocio */}
      <SettingsBusinessTypeStep
        selectedBizType={bizType}
        onSelectBizType={setBizType}
      />

      {/* 2. Datos de Identidad Comercial */}
      <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#282626] pb-3">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Identidad del Negocio & Canales de Contacto</span>
          </h3>
          <span className="text-[11px] font-semibold text-zinc-400">Sincronizado con D1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-300">Nombre Comercial *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-white font-bold focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Tienda Online"
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-300">Slug / Enlace QLink *</label>
            <input
              type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().trim())} required
              className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              placeholder="Ej. mi-tienda"
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-300">WhatsApp / Teléfono *</label>
            <input
              type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required
              className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              placeholder="+506 8888-9999"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
          <div>
            <label className="block font-bold mb-1 text-slate-300">Nombre del Asesor IA</label>
            <input
              type="text" value={botName} onChange={(e) => setBotName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-white font-bold focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Sofía"
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-300">Rol o Especialidad del Asesor</label>
            <input
              type="text" value={botRole} onChange={(e) => setBotRole(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-white font-bold focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Asesor Comercial & Ventas"
            />
          </div>
        </div>

        <div className="text-xs pt-1">
          <label className="block font-bold mb-1 text-slate-300">Horario de Atención & Datos Base</label>
          <textarea
            rows={2} value={hours} onChange={(e) => setHours(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#282626] bg-[#111010] text-slate-200 font-normal focus:outline-none focus:border-emerald-500 leading-relaxed text-xs"
            placeholder="Lunes a Sábado de 9:00 AM a 6:00 PM."
          />
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
            <Save className="w-4 h-4" /> <span>{isSaving ? 'Guardando en D1...' : '✓ Guardar Cambios'}</span>
          </button>
          {onOpenLiveChat && (
            <button type="button" onClick={onOpenLiveChat} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer">
              <ExternalLink className="w-4 h-4 text-emerald-400" /> <span>Probar Chat en Vivo</span>
            </button>
          )}
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Cambios guardados correctamente
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

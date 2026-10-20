import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { Store, CheckCircle2, Save, MapPin, Phone, Clock, DollarSign } from 'lucide-react';
import { BusinessTypeSelector } from '../../client/settings/BusinessTypeSelector';

interface VoceroBusinessProfileSettingsProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroBusinessProfileSettings: React.FC<VoceroBusinessProfileSettingsProps> = ({
  tenant,
  onUpdateSettings,
}) => {
  const [name, setName] = useState(tenant?.name || '');
  const [slug, setSlug] = useState(tenant?.slug || '');
  const [bizType, setBizType] = useState(tenant?.business_type || 'tienda');
  const [phone, setPhone] = useState(tenant?.phone || '');
  const [address, setAddress] = useState(tenant?.address || '');
  const [hours, setHours] = useState(tenant?.business_hours || 'Lunes a Sábado: 8:00 AM - 6:00 PM');
  const [currency, setCurrency] = useState(tenant?.currency || 'CRC');
  const [botName, setBotName] = useState(tenant?.bot_name || 'Valeria');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      if (tenant.name) setName(tenant.name);
      if (tenant.slug) setSlug(tenant.slug);
      if (tenant.business_type) setBizType(tenant.business_type);
      if (tenant.phone) setPhone(tenant.phone);
      if (tenant.address) setAddress(tenant.address);
      if (tenant.business_hours) setHours(tenant.business_hours);
      if (tenant.currency) setCurrency(tenant.currency);
      if (tenant.bot_name) setBotName(tenant.bot_name);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const ok = await onUpdateSettings({
        name,
        slug,
        business_type: bizType,
        phone,
        address,
        business_hours: hours,
        currency,
        bot_name: botName,
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
      {/* Tarjeta de Modalidad de Negocio */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#0a1730] mb-1">Giro y Modalidad Comercial</h3>
        <p className="text-xs text-[#62728d] mb-4">Define cómo se comporta la IA al vender y atender a tus clientes.</p>
        <BusinessTypeSelector value={bizType} onChange={setBizType} />
      </div>

      {/* Tarjeta de Información General */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#0a1730]">Identidad del Negocio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Nombre Comercial</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pizzería Roma, Barbería Clásica"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1">Identificador Web (Slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="pizzeria-roma"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs font-mono text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#0d5bff]" /> Teléfono Oficial / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+506 8888-8888 o +52 55..."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#0d5bff]" /> Moneda Oficial
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            >
              <option value="CRC">Colones Costarricenses (₡ CRC)</option>
              <option value="MXN">Pesos Mexicanos ($ MXN)</option>
              <option value="USD">Dólares Americanos ($ USD)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#0d5bff]" /> Dirección o Ubicación Física
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="San José, 100m norte del parque central..."
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0d5bff]" /> Horarios de Atención Comercial
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Lunes a Viernes 9am - 7pm, Sábados 10am - 4pm"
              className="w-full rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
          {savedSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> ¡Perfil actualizado con éxito!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#0d5bff] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0047e1] transition cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Guardando en D1...' : 'Guardar Perfil'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

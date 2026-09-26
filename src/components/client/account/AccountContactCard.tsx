import React, { useState, useEffect } from 'react';
import { Mail, Phone, Store, User, Save, CheckCircle2 } from 'lucide-react';
import { Tenant } from '../../../types';

interface AccountContactCardProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const AccountContactCard: React.FC<AccountContactCardProps> = ({ tenant, onUpdateSettings }) => {
  const [email, setEmail] = useState(tenant?.owner_email || '');
  const [phone, setPhone] = useState(tenant?.phone || '+506 8888-8888');
  const [ownerName, setOwnerName] = useState(tenant?.owner_name || '');
  const [businessType, setBusinessType] = useState(tenant?.business_type || 'restaurante');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (tenant) {
      if (tenant.owner_email) setEmail(tenant.owner_email);
      if (tenant.phone) setPhone(tenant.phone);
      if (tenant.owner_name) setOwnerName(tenant.owner_name);
      if (tenant.business_type) setBusinessType(tenant.business_type);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onUpdateSettings({
      owner_email: email.trim(),
      phone: phone.trim(),
      owner_name: ownerName.trim(),
      business_type: businessType
    });
    setIsSaving(false);
    if (ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    }
  };

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#282626] bg-[#141313] text-slate-100 font-sans">
      <div className="flex items-center justify-between border-b border-[#242323] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Datos de la Cuenta & Contacto</h3>
            <p className="text-xs text-zinc-400">Información del titular y contacto comercial</p>
          </div>
        </div>

        {isSaved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> Guardado
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="propietario@empresa.com"
              required
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Teléfono / WhatsApp</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+506 8888-8888"
              required
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Nombre del Titular */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Nombre del Titular</span>
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Nombre y Apellidos"
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tipo de Negocio */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tipo de Negocio</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="restaurante">Restaurante / Comidas y Bebidas</option>
              <option value="tienda">Tienda / Comercio Minorista</option>
              <option value="servicios">Servicios Profesionales / Citas</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Actualizar Datos de Contacto'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { RegisterFormData } from '../../types/auth';
import { Store, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

interface ClientRegisterProps {
  onRegister: (data: RegisterFormData) => Promise<boolean>;
  onSwitchToLogin: () => void;
  error?: string | null;
}

export const ClientRegister: React.FC<ClientRegisterProps> = ({
  onRegister,
  onSwitchToLogin,
  error
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    businessName: '',
    businessType: 'tienda',
    email: '',
    password: '',
    currency: 'CRC'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onRegister(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-lg onyx-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#282626]">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1e1d1d] border border-[#2e2b2b] text-emerald-400 mx-auto mb-3">
          <Store className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight">
          Crea tu Cuenta de Negocio
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 text-center mt-1 mb-5">
          Tu cuenta privada y aislada con asistente de ventas 24/7 en el Edge.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nombre del Dueño
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Carlos Mendoza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nombre del Negocio
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Pizzería Bella Roma"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Tipo de Comercio
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="tienda">Tienda / Retail</option>
                <option value="restaurante">Restaurante / Comida</option>
                <option value="servicios">Servicios / Citas</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Moneda Oficial
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CRC">CRC (₡ Colones)</option>
                <option value="USD">USD ($ Dólares)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@negocio.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Configurando tu Tienda...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Crear Cuenta y Comenzar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#282626] text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-zinc-400 hover:text-emerald-400 font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>¿Ya tienes una cuenta? Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

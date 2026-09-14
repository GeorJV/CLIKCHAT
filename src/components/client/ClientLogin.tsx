import React, { useState } from 'react';
import { TenantListItem } from '../../types/client';
import { Store, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface ClientLoginProps {
  availableTenants: TenantListItem[];
  onLogin: (tenantSlug: string) => void;
  onOpenChatPreview?: (tenantSlug: string) => void;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({
  availableTenants,
  onLogin,
  onOpenChatPreview
}) => {
  const [selectedSlug, setSelectedSlug] = useState(availableTenants[0]?.slug || 'acme-store');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlug) onLogin(selectedSlug);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md onyx-card rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1e1d1d] border border-[#2e2b2b] text-emerald-400 mx-auto mb-4">
          <Store className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight">
          Portal del Dueño de Negocio
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 text-center mt-1 mb-6">
          Gestiona tu catálogo, configura el horario comercial y entrena a tu bot con las preguntas de tus clientes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Selecciona tu Tienda / Inquilino
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full bg-[#111010] border border-[#282626] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {availableTenants.length > 0 ? (
                availableTenants.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name} ({t.slug}) - Asesor: {t.bot_name}
                  </option>
                ))
              ) : (
                <option value="acme-store">TechStore Innovations (acme-store)</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ingresar al Panel de Control</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#282626] flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => onLogin('acme-store')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceso rápido demo: <strong>TechStore (acme-store)</strong></span>
          </button>
          {onOpenChatPreview && (
            <button
              type="button"
              onClick={() => onOpenChatPreview(selectedSlug)}
              className="text-[11px] text-zinc-400 hover:text-white underline transition cursor-pointer"
            >
              Ver cómo ve el cliente el chat de esta tienda
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

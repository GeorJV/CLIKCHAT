import React from 'react';
import { Shield, CheckCircle2, Building, Mail, User } from 'lucide-react';

interface UserProfileTabProps {
  userId?: string | null;
  tenantName?: string;
  tenantSlug?: string;
  ownerName?: string;
  ownerEmail?: string;
  plan?: string;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  userId,
  tenantName = 'ClikChat Boutique & Tech',
  tenantSlug = 'acme-store',
  ownerName,
  ownerEmail,
  plan = 'pro'
}) => {
  const displayName = ownerName || tenantName || 'Propietario';
  const displayEmail = ownerEmail || `contacto@${tenantSlug}.com`;
  const resolvedId = userId || tenantSlug;

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-fade-in font-sans">
      <div className="bg-[#181717] border border-[#282626] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/10 shrink-0">
            <div className="w-full h-full bg-[#161515] rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xl">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{displayName}</h1>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ID: {resolvedId}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-zinc-500" />
              <span>{displayEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cuenta Verificada D1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#181717] border border-[#282626] p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Negocio Asociado</span>
          </div>
          <div className="p-3 bg-[#131212] rounded-xl border border-[#252323] space-y-1">
            <p className="text-xs font-bold text-white">{tenantName}</p>
            <p className="text-[11px] text-zinc-400 font-mono">Slug: {tenantSlug}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Plan {plan.toUpperCase()} • Cloudflare Edge</p>
          </div>
        </div>

        <div className="bg-[#181717] border border-[#282626] p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Seguridad & Permisos</span>
          </div>
          <div className="p-3 bg-[#131212] rounded-xl border border-[#252323] space-y-1">
            <p className="text-xs font-bold text-white">Rol: Propietario del Negocio</p>
            <p className="text-[11px] text-zinc-400">Autenticación de 2 Factores Activa</p>
            <p className="text-[11px] text-zinc-400">Base de datos: Cloudflare D1 Serverless</p>
          </div>
        </div>
      </div>
    </div>
  );
};

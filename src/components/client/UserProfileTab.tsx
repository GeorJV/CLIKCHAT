import React from 'react';
import { User, Shield, Key, Bell, CheckCircle2, Building, ExternalLink } from 'lucide-react';

interface UserProfileTabProps {
  userId?: string | null;
  tenantName?: string;
  tenantSlug?: string;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  userId = 'usr-admin-01',
  tenantName = 'Clikchat Store',
  tenantSlug = 'acme-store',
}) => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-[#181717] border border-[#282626] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-[#161515] rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xl">
              {userId ? userId.slice(0, 2).toUpperCase() : 'US'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Panel de Usuario</h1>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ID: {userId || 'usr-principal'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Gestión de credenciales, cuenta de acceso y perfil de negocio</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cuenta Verificada
          </span>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-[#181717] border border-[#282626] p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Negocio Asociado</span>
          </div>
          <div className="p-3 bg-[#131212] rounded-xl border border-[#252323] space-y-1">
            <p className="text-xs font-bold text-white">{tenantName}</p>
            <p className="text-[11px] text-zinc-400 font-mono">Slug: {tenantSlug}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Plan Pro Activo • Soporte 24/7</p>
          </div>
        </div>

        <div className="bg-[#181717] border border-[#282626] p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Seguridad & Permisos</span>
          </div>
          <div className="p-3 bg-[#131212] rounded-xl border border-[#252323] space-y-1">
            <p className="text-xs font-bold text-white">Rol: Propietario / Super Admin</p>
            <p className="text-[11px] text-zinc-400">Autenticación de 2 Factores Activa</p>
            <p className="text-[11px] text-zinc-400">Sesión encriptada con Cloudflare Edge</p>
          </div>
        </div>
      </div>
    </div>
  );
};

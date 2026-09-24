import React from 'react';
import { X, Store, Check, LogOut } from 'lucide-react';
import { TenantListItem } from '../../../types/client';

interface SwitchTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTenants: TenantListItem[];
  currentSlug: string;
  onSelectTenant: (slug: string) => void;
  onLogout?: () => void;
}

export const SwitchTenantModal: React.FC<SwitchTenantModalProps> = ({
  isOpen,
  onClose,
  availableTenants,
  currentSlug,
  onSelectTenant,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#161515] border border-[#2b2929] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Cabecera del Modal */}
        <div className="px-4 py-3.5 border-b border-[#282626] flex items-center justify-between bg-[#121111]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Cambiar de Cuenta / Negocio</h3>
              <p className="text-[10px] text-zinc-400">Selecciona el inquilino que deseas administrar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#212020] hover:bg-[#2c2a2a] text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Lista de Cuentas / Inquilinos Disponibles */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          {availableTenants.length > 0 ? (
            availableTenants.map((t) => {
              const isActive = t.slug === currentSlug;
              return (
                <div
                  key={t.id || t.slug}
                  onClick={() => {
                    onSelectTenant(t.slug);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-[#1b1a1a] hover:bg-[#232121] border-[#292727] text-zinc-300'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs truncate text-white">{t.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#272525] text-zinc-400 font-mono">
                        {t.slug}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Asesor: <strong className="text-zinc-300">{t.bot_name || 'Sofía'}</strong> • Plan: <span className="uppercase text-emerald-400">{t.plan || 'Pro'}</span>
                    </div>
                  </div>
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-zinc-500 hover:text-emerald-400 shrink-0">
                      Activar →
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-zinc-500">
              No hay otras cuentas configuradas en este portal.
            </div>
          )}
        </div>

        {/* Pie con Cierre de Sesión */}
        {onLogout && (
          <div className="px-4 py-3 bg-[#111010] border-t border-[#262424] flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">¿Deseas salir del portal?</span>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition cursor-pointer"
            >
              <LogOut size={12} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

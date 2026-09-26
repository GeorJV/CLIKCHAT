import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Tenant } from '../../../types';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';

interface AccountDangerZoneCardProps {
  tenant: Tenant | null;
  userEmail: string;
}

export const AccountDangerZoneCard: React.FC<AccountDangerZoneCardProps> = ({
  tenant,
  userEmail
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('clikchat_auth_token') : null;
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo eliminar la cuenta');
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('clikchat_auth_token');
        localStorage.removeItem('clikchat_role');
        localStorage.removeItem('clikchat_active_tenant_slug');
        window.location.href = '/login?deleted=1';
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Error al procesar la solicitud.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl p-5 sm:p-6 shadow-xl border border-red-500/25 bg-[#171111] text-slate-100 font-sans space-y-4">
        <div className="flex items-center gap-2.5 border-b border-red-500/20 pb-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/25">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-red-200">Zona de Peligro</h3>
            <p className="text-xs text-zinc-400">Acciones críticas e irreversibles sobre tu negocio y cuenta</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pt-1">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-200">Eliminar Cuenta y Datos Comerciales</span>
            <p className="text-xs text-zinc-400 max-w-xl">
              Se eliminará definitivamente tu cuenta de usuario, catálogo de productos, FAQs y el historial de chats de tu tienda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition shadow-md cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Cuenta</span>
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        userEmail={userEmail}
        storeName={tenant?.name}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};

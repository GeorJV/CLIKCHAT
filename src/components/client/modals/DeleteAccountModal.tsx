import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
  storeName?: string;
  isDeleting: boolean;
  error?: string | null;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  storeName,
  isDeleting,
  error
}) => {
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const isConfirmed = confirmInput.trim().toUpperCase() === 'ELIMINAR';

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || isDeleting) return;
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#161313] border border-red-500/30 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 font-sans space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#282222] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">¿Eliminar cuenta definitivamente?</h3>
              <p className="text-xs text-red-400/90 font-medium">Esta acción es irreversible</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-zinc-300">
          <p>
            Al eliminar la cuenta de <span className="font-bold text-white">{userEmail}</span>
            {storeName ? <> y el negocio <span className="font-bold text-white">{storeName}</span></> : ''}:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1">
            <li>Se eliminará todo tu catálogo de productos y precios.</li>
            <li>Se borrarán los entrenamientos, FAQs y el bot de ventas.</li>
            <li>Se perderá el historial completo de conversaciones y pedidos.</li>
            <li>No podrás recuperar el acceso ni restaurar esta tienda.</li>
          </ul>

          <div className="pt-2">
            <label className="block font-bold text-zinc-300 mb-1.5">
              Para confirmar, escribe <span className="text-red-400 font-mono tracking-wider">ELIMINAR</span> abajo:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Escribe ELIMINAR"
              disabled={isDeleting}
              className="w-full bg-[#100c0c] border border-red-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono tracking-wide"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#282222]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg disabled:opacity-40 disabled:hover:bg-red-600 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Definitivamente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

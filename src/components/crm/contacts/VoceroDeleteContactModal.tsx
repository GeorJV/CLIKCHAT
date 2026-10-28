import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface VoceroDeleteContactModalProps {
  isOpen: boolean;
  count: number;
  contactName?: string;
  isBulk?: boolean;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const VoceroDeleteContactModal: React.FC<VoceroDeleteContactModalProps> = ({
  isOpen, count, contactName, isBulk, isDeleting, onConfirm, onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#e8edf6] relative">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1 rounded-full text-[#8391aa] hover:bg-[#f6f8fc] hover:text-[#0a1730] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-[#0a1730]">
              {isBulk ? `¿Eliminar ${count} contactos?` : `¿Eliminar contacto?`}
            </h3>
            <p className="text-[11px] text-[#8391aa]">Directorio de Clientes CRM</p>
          </div>
        </div>

        <p className="text-xs text-[#42506b] mb-4 leading-relaxed">
          {isBulk ? (
            <>Estás a punto de eliminar <strong className="text-rose-700 font-bold">{count} contactos</strong> seleccionados. Esta acción es irreversible.</>
          ) : (
            <>¿Estás seguro de eliminar a <strong className="text-rose-700 font-bold">{contactName || 'este contacto'}</strong>? Esta acción es irreversible.</>
          )}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-xl border border-[#dde5f1] text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{isBulk ? `Eliminar ${count}` : 'Eliminar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, X, ShoppingBag, MessageSquareText } from 'lucide-react';

interface ExitIntentToastProps {
  isOpen: boolean;
  storeName?: string;
  hasItemsInCart?: boolean;
  onProceedCheckout: () => void;
  onAskQuestion: (query: string) => void;
  onDismiss: () => void;
}

export const ExitIntentToast: React.FC<ExitIntentToastProps> = ({
  isOpen,
  storeName = 'Tienda',
  hasItemsInCart = false,
  onProceedCheckout,
  onAskQuestion,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-[calc(100vw-3rem)] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="rounded-2xl border border-blue-400/30 bg-[#0c1424]/95 backdrop-blur-xl p-4 text-white shadow-2xl ring-1 ring-blue-500/20">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-blue-300 font-bold">
                Atención Inmediata
              </p>
              <h4 className="text-sm font-bold text-white leading-tight">
                {hasItemsInCart ? '¿Deseas asegurar tu orden?' : `¿Tienes alguna duda con ${storeName}?`}
              </h4>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {hasItemsInCart
            ? 'Te lo dejamos listo con pago SINPE Móvil o en efectivo al recibir. ¿Deseas confirmar los datos de entrega?'
            : 'Un asesor virtual o humano puede responderte en menos de 10 segundos tus dudas sobre precios, horarios o envío.'}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {hasItemsInCart ? (
            <button
              onClick={() => {
                onDismiss();
                onProceedCheckout();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Confirmar Pedido</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onDismiss();
                onAskQuestion('¿Tienen entregas express el día de hoy?');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>Consultar Envío</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 transition cursor-pointer"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
};

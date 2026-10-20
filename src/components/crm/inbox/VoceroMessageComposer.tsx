import React, { useState } from 'react';
import { Send, Zap, CreditCard, Calendar, UtensilsCrossed, PackageCheck } from 'lucide-react';

interface VoceroMessageComposerProps {
  onSendMessage: (text: string) => void;
  channel: string;
  disabled?: boolean;
}

const QUICK_MACROS = [
  { icon: CreditCard, label: 'Link de Pago', text: 'Te comparto el enlace oficial para completar tu pago de forma 100% segura:' },
  { icon: UtensilsCrossed, label: 'Comanda Lista', text: '¡Excelente! Tu pedido ha sido confirmado y ya está en preparación en cocina.' },
  { icon: Calendar, label: 'Agendar Cita', text: 'Contamos con dos horarios disponibles para tu sesión: ¿te queda mejor por la mañana o por la tarde?' },
  { icon: PackageCheck, label: 'Despacho', text: 'Tu orden ha sido empaquetada y va en camino a tu dirección con el repartidor.' },
];

export const VoceroMessageComposer: React.FC<VoceroMessageComposerProps> = ({
  onSendMessage,
  channel,
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-zinc-950 border-t border-zinc-800 space-y-2">
      {/* Botones de Macros / Respuestas Rápidas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-semibold shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Macros:
        </span>
        {QUICK_MACROS.map((macro, idx) => {
          const Icon = macro.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setText(macro.text)}
              className="flex items-center gap-1 px-2 py-0.8 rounded-md bg-zinc-900 hover:bg-zinc-800 text-[10px] font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 whitespace-nowrap transition cursor-pointer"
            >
              <Icon className="w-2.5 h-2.5 text-emerald-400" />
              <span>{macro.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input de Mensaje */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              channel === 'whatsapp'
                ? 'Escribe como asesor humano (se enviará a WhatsApp)...'
                : 'Escribe un mensaje para el cliente...'
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </div>
    </div>
  );
};

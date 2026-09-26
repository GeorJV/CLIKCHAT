import React, { useState } from 'react';
import { ExternalLink, MessageCircle, Plus, Check } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isUser?: boolean;
  className?: string;
  onActionClick?: (text: string) => void;
}

/**
 * Parsea segmentos de texto con formato markdown básico:
 * - Enlaces [Texto](url)
 * - Negrita **texto**
 */
function renderInlineFormatted(text: string, isUser: boolean): React.ReactNode[] {
  // Regex para capturar [texto](url) y **texto**
  const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Enlace markdown [label](url)
      const label = match[2];
      const url = match[3];
      const isWhatsApp = url.includes('wa.me') || url.includes('whatsapp.com');

      nodes.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-bold my-0.5 px-2 py-0.5 rounded-lg text-xs transition duration-200 break-all ${
            isWhatsApp
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950/40'
              : isUser
              ? 'bg-white/20 hover:bg-white/30 text-white underline decoration-white/50'
              : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 underline decoration-indigo-400/50'
          }`}
        >
          {isWhatsApp ? <MessageCircle className="w-3 h-3 shrink-0" /> : <ExternalLink className="w-3 h-3 shrink-0" />}
          <span className="truncate max-w-[220px]">{label}</span>
        </a>
      );
    } else if (match[4]) {
      // Negrita **texto**
      nodes.push(
        <strong key={`bold-${match.index}`} className={isUser ? 'font-bold text-white' : 'font-bold text-amber-300/90'}>
          {match[4]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({
  content,
  isUser = false,
  className = '',
  onActionClick
}) => {
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  if (!content) return null;

  const handleAdd = (rawItem: string, idx: number) => {
    setRecentlyAdded(idx);
    setTimeout(() => setRecentlyAdded(null), 2500);
    const cleanName = rawItem.replace(/\*\*/g, '').trim();
    onActionClick?.(`Agregar ${cleanName}`);
  };

  // Normalizar saltos y limpiar encabezados ###
  const lines = content.split('\n');

  return (
    <div
      className={`text-xs sm:text-sm leading-relaxed select-text space-y-1.5 break-words max-w-full ${
        isUser ? 'text-white' : 'text-slate-100'
      } ${className}`}
    >
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`spacer-${idx}`} className="h-1" />;
        }

        // Si es encabezado markdown (### o ## o #)
        const isHeader = /^#{1,4}\s+/.test(trimmed);
        const cleanLine = trimmed.replace(/^#{1,4}\s+/, '');

        if (isHeader) {
          return (
            <div
              key={`line-${idx}`}
              className="font-bold text-xs sm:text-[13px] text-amber-300 pt-1 pb-0.5 tracking-wide flex items-center gap-1.5 break-words"
            >
              {renderInlineFormatted(cleanLine, isUser)}
            </div>
          );
        }

        // Detección de Comanda / Ticket con caracteres de caja
        if (!isUser && /^[╔║╠╚═]/.test(trimmed)) {
          return (
            <div key={`line-${idx}`} className="font-mono text-[11px] sm:text-xs text-amber-200/90 whitespace-pre overflow-x-auto leading-tight select-text py-0.5">
              {trimmed}
            </div>
          );
        }

        // Detección de opciones con precio: viñetas o listas como "- Refresco en lata ($1.50)"
        const bulletMatch = !isUser && trimmed.match(/^([-*•]|\d+[.)])\s+(.+)$/);
        if (bulletMatch) {
          const rawItem = bulletMatch[2];
          const hasPrice = /(?:[\$₡€£]\s*[\d,.]+|[\d,.]+\s*(?:[\$₡€£]|USD|CRC|EUR|COP|MXN))/i.test(rawItem);

          if (hasPrice && onActionClick) {
            const isAdded = recentlyAdded === idx;
            return (
              <div key={`opt-${idx}`} className="flex items-center justify-between gap-2.5 py-1 px-2.5 rounded-xl bg-amber-500/[0.08] border border-amber-400/25 hover:border-amber-400/50 transition group my-1.5">
                <div className="flex-1 min-w-0 font-medium text-slate-100 leading-snug break-words">
                  <span className="text-amber-400 mr-1.5 font-bold">•</span>
                  {renderInlineFormatted(rawItem, isUser)}
                </div>
                <button
                  type="button" onClick={() => handleAdd(rawItem, idx)} disabled={isAdded}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 cursor-default'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-black shadow-orange-950/40 border border-amber-300/70'
                  }`}
                  title={`Agregar ${rawItem.replace(/\*\*/g, '').trim()} a la orden`}
                >
                  {isAdded ? (<><Check className="w-3 h-3 text-emerald-300 stroke-[3]" /><span>Agregado</span></>) : (<><Plus className="w-3 h-3 stroke-[3]" /><span>Agregar</span></>)}
                </button>
              </div>
            );
          }
        }

        return (
          <div key={`line-${idx}`} className="break-words leading-snug">
            {renderInlineFormatted(trimmed, isUser)}
          </div>
        );
      })}
    </div>
  );
};

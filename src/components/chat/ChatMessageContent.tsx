import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isUser?: boolean;
  className?: string;
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
  className = ''
}) => {
  if (!content) return null;

  // Normalizar saltos y limpiar encabezados ###
  const lines = content.split('\n');

  return (
    <div
      className={`text-xs sm:text-sm leading-relaxed select-text space-y-1.5 break-words [overflow-wrap:anywhere] break-all max-w-full overflow-hidden ${
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
              className="font-bold text-xs sm:text-[13px] text-amber-300 pt-1 pb-0.5 tracking-wide flex items-center gap-1.5 break-words [overflow-wrap:anywhere]"
            >
              {renderInlineFormatted(cleanLine, isUser)}
            </div>
          );
        }

        return (
          <div key={`line-${idx}`} className="break-words [overflow-wrap:anywhere] leading-snug">
            {renderInlineFormatted(trimmed, isUser)}
          </div>
        );
      })}
    </div>
  );
};

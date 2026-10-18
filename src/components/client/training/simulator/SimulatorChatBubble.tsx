import React from 'react';
import { Bot, User, Edit3, Zap, Layers } from 'lucide-react';

export interface SimulatorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  ragLevel?: string;
  inResponseTo?: string;
}

interface SimulatorChatBubbleProps {
  message: SimulatorMessage;
  botName: string;
  onCorrect?: (msg: SimulatorMessage) => void;
}

export const SimulatorChatBubble: React.FC<SimulatorChatBubbleProps> = ({
  message,
  botName,
  onCorrect
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 my-2`}>
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-zinc-500 font-semibold">
        {isUser ? (
          <>
            <span>Tú (Simulando Cliente)</span>
            <User className="w-3 h-3 text-emerald-400" />
          </>
        ) : (
          <>
            <Bot className="w-3 h-3 text-emerald-400" />
            <span className="text-zinc-300 font-bold">{botName}</span>
            {message.ragLevel === 'level_2_faq' ? (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-emerald-400" /> Nivel 2: Regla Q&A ($0)
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-0.5">
                <Layers className="w-2.5 h-2.5" /> Nivel 3: IA & Catálogo
              </span>
            )}
          </>
        )}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
          isUser
            ? 'bg-emerald-600 text-white rounded-tr-none'
            : 'bg-[#1b1a1a] text-zinc-200 border border-[#2c2929] rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Botón de Corrección Rápida en 1-Clic para respuestas del Bot */}
        {!isUser && onCorrect && (
          <div className="mt-2.5 pt-2 border-t border-[#292626] flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-400">¿No es lo que esperabas?</span>
            <button
              type="button"
              onClick={() => onCorrect(message)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Corregir respuesta</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

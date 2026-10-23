import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { InterviewMessage } from '../../../services/aiOnboardingService';

interface Props {
  messages: InterviewMessage[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (text?: string) => void;
  isLoading: boolean;
}

const QUICK_SUGGESTIONS = [
  'Restaurante y cafetería',
  'Tienda de ropa o retail',
  'Servicios profesionales',
  'Salud, estética y belleza'
];

export const VoceroAiInterviewChat: React.FC<Props> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <div className="flex flex-col flex-1 h-[480px] font-sans">
      {/* Lista de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f8fafc]">
        {messages.map((m) => {
          const isAi = m.role === 'assistant';
          return (
            <div key={m.id} className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                isAi ? 'bg-[#0d5bff] shadow-2xs' : 'bg-[#0a1730]'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                isAi
                  ? 'bg-white text-[#0a1730] border border-[#e2e8f0]'
                  : 'bg-[#0d5bff] text-white rounded-tr-xs'
              }`}>
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0d5bff] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl px-3.5 py-2.5 text-xs text-[#62728d] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0d5bff]" />
              <span>Procesando en Cloudflare Edge con Meta Llama 3...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sugerencias Rápidas para el inicio */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-white border-t border-[#edf2f9] flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          <span className="text-[10px] font-bold text-[#8391aa] uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#0d5bff]" /> Giro:
          </span>
          {QUICK_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              disabled={isLoading}
              onClick={() => onSendMessage(sug)}
              className="px-2.5 py-1 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0a1730] text-[11px] font-semibold transition shrink-0 cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Formulario de Entrada */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#e2e8f0] flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          disabled={isLoading}
          className="flex-1 bg-[#f8fafc] border border-[#d8e2f0] rounded-xl px-3.5 py-2 text-xs text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white disabled:opacity-40 transition cursor-pointer shrink-0"
          title="Enviar respuesta"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import { Phone, Mail, MessageSquare, Bot, User, UserCheck } from 'lucide-react';
import { CrmLead, CrmMessage } from '../../../types/crm';
import { VoceroHumanTakeoverBar } from './VoceroHumanTakeoverBar';
import { VoceroMessageComposer } from './VoceroMessageComposer';

interface VoceroActiveChatProps {
  lead: CrmLead | null;
  messages: CrmMessage[];
  isLoadingMessages: boolean;
  onToggleTakeover: (leadId: string) => void;
  onSendMessage: (leadId: string, text: string) => void;
}

export const VoceroActiveChat: React.FC<VoceroActiveChatProps> = ({
  lead,
  messages,
  isLoadingMessages,
  onToggleTakeover,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-900/40 text-zinc-500">
        <MessageSquare className="w-10 h-10 text-zinc-700 mb-2" />
        <h3 className="text-sm font-bold text-zinc-300">Selecciona una conversación</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Elige cualquier lead de la lista izquierda para ver su historial en vivo y tomar el control humano.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d0f] border-r border-zinc-800">
      {/* Barra de Control Humano / Pausar IA */}
      <VoceroHumanTakeoverBar
        isAiPaused={lead.ai_paused}
        onToggleTakeover={() => onToggleTakeover(lead.id)}
        leadName={lead.name}
      />

      {/* Flujo de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 space-y-1">
            <p className="text-xs font-semibold text-zinc-400">Sin mensajes registrados en esta sesión</p>
            <p className="text-[11px] text-zinc-600">Envía un mensaje abajo para iniciar la conversación.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isAgent = msg.sender === 'agent';
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
              >
                {/* Remitente Badge */}
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {isUser && (
                    <>
                      <User className="w-3 h-3 text-zinc-400" />
                      <span className="text-[10px] font-semibold text-zinc-400">{lead.name || 'Cliente'}</span>
                    </>
                  )}
                  {isBot && (
                    <>
                      <Bot className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400">Bot (RAG ClikChat)</span>
                    </>
                  )}
                  {isAgent && (
                    <>
                      <UserCheck className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-400">Asesor Humano</span>
                    </>
                  )}
                  <span className="text-[9px] text-zinc-600 font-mono">
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                {/* Burbuja del mensaje */}
                <div
                  className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                    isUser
                      ? 'bg-zinc-800 text-zinc-100 rounded-tl-sm border border-zinc-700/60'
                      : isAgent
                      ? 'bg-blue-950/80 text-blue-100 rounded-tr-sm border border-blue-500/40 shadow-sm'
                      : 'bg-emerald-950/70 text-emerald-100 rounded-tr-sm border border-emerald-500/30 shadow-sm'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compositor de Mensajes */}
      <VoceroMessageComposer
        onSendMessage={(text) => onSendMessage(lead.id, text)}
        channel={lead.channel}
      />
    </div>
  );
};

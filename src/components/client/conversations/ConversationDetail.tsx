import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, CheckCheck, MessageSquare, RefreshCw, Hash } from 'lucide-react';
import { ConversationSession, ChatMessageRecord } from './types';
import { getVisitorDisplayName } from './conversationUtils';
import { ChatMessageContent } from '../../chat/ChatMessageContent';

interface ConversationDetailProps {
  session: ConversationSession | null;
  onToggleStatus?: (id: string) => void;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({ session, onToggleStatus }) => {
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const currentSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session?.id) {
      setMessages([]);
      currentSessionIdRef.current = null;
      return;
    }

    if (currentSessionIdRef.current !== session.id) {
      setMessages([]);
      currentSessionIdRef.current = session.id;
    }

    let isMounted = true;

    const fetchSessionMessages = async (showSpinner = false) => {
      if (showSpinner) setLoading(true);
      try {
        const res = await fetch(`/api/chat/messages/${encodeURIComponent(session.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && currentSessionIdRef.current === session.id && data?.messages) {
            setMessages(data.messages);
            return;
          }
        }
      } catch (err) {
        console.warn('Error al cargar mensajes de sesión:', err);
      } finally {
        if (isMounted && showSpinner) setLoading(false);
      }
    };

    fetchSessionMessages(true);

    const interval = setInterval(() => {
      fetchSessionMessages(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [session?.id]);

  if (!session) {
    return (
      <div className="onyx-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[460px]">
        <div className="w-12 h-12 rounded-2xl bg-[#141313] border border-[#282626] flex items-center justify-center text-zinc-500">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm font-bold text-zinc-200">Ningún chat seleccionado</p>
        <p className="text-xs text-zinc-500 max-w-xs">
          Selecciona una conversación del listado real para auditar la transcripción completa y las trazas del RAG.
        </p>
      </div>
    );
  }

  const displayName = getVisitorDisplayName(session);

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 min-h-[500px]">
      {/* Encabezado del Chat Seleccionado */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262424]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141313] border border-[#282626] flex items-center justify-center text-emerald-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{displayName}</h4>
              {session.status === 'online' ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="text-[10px] font-medium text-zinc-500">
                  Historial (Cerrado)
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-0.5">
                <Hash className="w-3 h-3 text-zinc-600" />
                {session.id}
              </span>
              {session.user_phone && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  {session.user_phone}
                </span>
              )}
              {session.user_email && (
                <span className="flex items-center gap-1 text-zinc-300">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  {session.user_email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 bg-[#111010] px-2.5 py-1 rounded-lg border border-[#282626] font-mono">
            {messages.length || session.total_messages} msgs
          </span>
          {onToggleStatus && (
            <button
              type="button"
              onClick={() => onToggleStatus(session.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                session.status === 'online'
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {session.status === 'online' ? 'Finalizar Chat' : 'Reabrir Chat'}
            </button>
          )}
        </div>
      </div>

      {/* Título de Transcripción */}
      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
        <span>Transcripción Real de la Conversación</span>
        <span className="text-zinc-500 font-normal">Memoria D1 & RAG</span>
      </div>

      {/* Burbujas de Mensajes WhatsApp Style */}
      <div className="flex-1 space-y-3 bg-[#111010] p-4 rounded-xl border border-[#262424] max-h-[460px] overflow-y-auto">
        {loading && messages.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-500 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
            <span className="text-xs">Cargando mensajes reales de D1...</span>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            const text = m.message || m.content || m.text || '';
            const time = m.timestamp || (m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
            const rag = m.rag_level_used || m.rag_level;

            return (
              <div key={m.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3 text-xs shadow-sm break-words overflow-hidden ${
                    isUser
                      ? 'bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-tr-none border border-[#D79F4C]/30 shadow-md'
                      : 'bg-[#181717] border border-[#282626] text-zinc-200 rounded-tl-none shadow-lg shadow-black/60'
                  }`}
                >
                  <ChatMessageContent content={text} isUser={isUser} />
                  <div className={`mt-1.5 pt-1 flex items-center justify-between text-[9px] ${
                    isUser ? 'text-amber-200/80 border-t border-white/10' : 'text-zinc-500 border-t border-white/[0.06]'
                  }`}>
                    {rag ? (
                      <span className="font-mono text-emerald-400">Traza RAG: {rag}</span>
                    ) : <span />}
                    <span className="flex items-center gap-1 font-mono">
                      {time}
                      {isUser && <CheckCheck className="w-3 h-3 text-amber-300 inline" />}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-zinc-500 py-8">Esta conversación no tiene mensajes registrados en D1.</p>
        )}
      </div>
    </div>
  );
};

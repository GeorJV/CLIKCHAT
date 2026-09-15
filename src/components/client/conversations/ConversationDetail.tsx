import React from 'react';
import { User, Phone, CheckCheck, MessageSquare } from 'lucide-react';
import { ConversationSession } from './conversationsDemo';

interface ConversationDetailProps {
  session: ConversationSession | null;
  onToggleStatus?: (id: string) => void;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({ session, onToggleStatus }) => {
  if (!session) {
    return (
      <div className="onyx-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[460px]">
        <div className="w-12 h-12 rounded-2xl bg-[#141313] border border-[#282626] flex items-center justify-center text-zinc-500">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm font-bold text-zinc-200">Ningún chat seleccionado</p>
        <p className="text-xs text-zinc-500 max-w-xs">
          Selecciona una conversación online o del historial a la izquierda para inspeccionar su transcripción completa.
        </p>
      </div>
    );
  }

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 min-h-[500px]">
      {/* Encabezado del Chat Seleccionado */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#262424]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141313] border border-[#282626] flex items-center justify-center text-emerald-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{session.user_name || 'Cliente Anónimo'}</h4>
              {session.status === 'online' ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="text-[10px] font-medium text-zinc-500">
                  Cerrado
                </span>
              )}
            </div>
            {session.user_phone && (
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-zinc-500" />
                <span>{session.user_phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 bg-[#111010] px-2.5 py-1 rounded-lg border border-[#282626]">
            {session.total_messages} msgs
          </span>
          {onToggleStatus && (
            <button
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
        <span>Transcripción de la Conversación</span>
        <span className="text-zinc-500 font-normal">Bot con RAG Activo</span>
      </div>

      {/* Burbujas de Mensajes WhatsApp Style */}
      <div className="flex-1 space-y-3 bg-[#111010] p-4 rounded-xl border border-[#262424] max-h-[460px] overflow-y-auto">
        {session.messages && session.messages.length > 0 ? (
          session.messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-[#181717] border border-[#282626] text-zinc-200 rounded-tl-none shadow-lg shadow-black/60'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div className={`mt-1.5 pt-1 flex items-center justify-between text-[9px] ${
                  m.sender === 'user' ? 'text-emerald-200 border-t border-white/10' : 'text-zinc-500 border-t border-white/[0.06]'
                }`}>
                  {m.rag_level ? (
                    <span className="font-mono text-emerald-400">Traza RAG: {m.rag_level}</span>
                  ) : <span />}
                  <span className="flex items-center gap-1 font-mono">
                    {m.time}
                    {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-300 inline" />}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-zinc-500 py-8">Sin mensajes en esta sesión.</p>
        )}
      </div>
    </div>
  );
};



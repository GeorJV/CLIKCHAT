import React from 'react';
import { Clock, User, Radio, Archive } from 'lucide-react';
import { ConversationSession } from './conversationsDemo';

interface ConversationListProps {
  sessions: ConversationSession[];
  selectedId: string | null;
  onSelectSession: (id: string) => void;
  activeFilter: 'online' | 'closed';
  onChangeFilter: (filter: 'online' | 'closed') => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  sessions,
  selectedId,
  onSelectSession,
  activeFilter,
  onChangeFilter
}) => {
  const onlineCount = sessions.filter(s => s.status === 'online').length;
  const closedCount = sessions.filter(s => s.status === 'closed').length;
  const filtered = sessions.filter(s => s.status === activeFilter);

  return (
    <div className="space-y-3">
      {/* Botones Superiores: Chats Online vs Historial */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#121111] rounded-xl border border-[#282626]">
        <button
          type="button"
          onClick={() => onChangeFilter('online')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeFilter === 'online'
              ? 'bg-[#1e1d1d] text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Chats Online ({onlineCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeFilter('closed')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeFilter === 'closed'
              ? 'bg-[#1e1d1d] text-zinc-200 border border-[#383535] shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Archive className="w-3.5 h-3.5 text-zinc-400" />
          <span>Historial ({closedCount})</span>
        </button>
      </div>

      {/* Lista de Conversaciones */}
      <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 bg-[#121111] rounded-xl border border-[#262424]">
            No hay conversaciones en esta pestaña.
          </div>
        ) : (
          filtered.map(c => {
            const isSelected = selectedId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onSelectSession(c.id)}
                className={`p-3 rounded-xl border transition cursor-pointer select-none space-y-1.5 ${
                  isSelected
                    ? 'bg-[#1c1b1b] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-[#151414] border-[#262424] hover:border-[#383535] hover:bg-[#181717]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{c.user_name || 'Cliente Anónimo'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-normal shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-zinc-600" />
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {c.status === 'online' ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En Vivo
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1 shrink-0">
                      Cerrado
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <p className="text-zinc-400 truncate leading-snug flex-1">
                    {c.last_message ? `"${c.last_message}"` : 'Sin mensajes'}
                  </p>
                  <span className="text-[10px] text-zinc-400 bg-[#111010] px-1.5 py-0.5 rounded border border-[#282626] shrink-0">
                    {c.total_messages} msgs
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

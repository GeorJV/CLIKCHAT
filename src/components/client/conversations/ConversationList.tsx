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

  const renderBadge = (level?: string) => {
    switch (level) {
      case 'semantic_cache':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">⚡ Caché</span>;
      case 'level_2_faq':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">💡 FAQ Nivel 2</span>;
      case 'level_3_catalog':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">📦 Catálogo D1</span>;
      default:
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1e1d1d] text-zinc-400 border border-[#2e2b2b]">Chat</span>;
    }
  };

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
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{c.user_name || 'Cliente Anónimo'}</span>
                  </span>
                  {c.status === 'online' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En Vivo
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1e1d1d] text-zinc-400 border border-[#2e2b2b] shrink-0">
                      Cerrado
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {renderBadge(c.last_rag_level)}
                    <span className="text-zinc-400 bg-[#111010] px-1.5 py-0.2 rounded border border-[#282626]">
                      {c.total_messages} msgs
                    </span>
                  </div>
                </div>

                {c.last_message && (
                  <p className="text-[11px] text-zinc-400 truncate leading-snug">
                    "{c.last_message}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

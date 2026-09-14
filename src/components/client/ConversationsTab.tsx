import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Clock, User, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { FALLBACK_SESSIONS, ConversationSession } from './conversations/conversationsDemo';

export const ConversationsTab: React.FC<{ tenantId?: string }> = ({ tenantId }) => {
  const [sessions, setSessions] = useState<ConversationSession[]>(FALLBACK_SESSIONS);
  const [expandedId, setExpandedId] = useState<string | null>('sess-84920492-preview');
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/tenant-conversations/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.conversations && data.conversations.length > 0) {
          setSessions(data.conversations);
        }
      }
    } catch {
      // Retiene sesiones demo
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const renderBadge = (level?: string) => {
    switch (level) {
      case 'semantic_cache':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">⚡ Caché $0</span>;
      case 'level_2_faq':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">💡 FAQ Nivel 2</span>;
      case 'level_3_catalog':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">📦 Catálogo D1</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1e1d1d] text-zinc-400 border border-[#2e2b2b]">Conversación</span>;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="onyx-card rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Auditoría de Conversaciones (RAG Nivel 1 & D1)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Historial de chats en tiempo real con la traza de memoria y nivel de RAG utilizado.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {sessions.length} Sesiones
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((c) => {
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="onyx-card rounded-2xl p-4 sm:p-5 space-y-3 transition">
              <div
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                  <span className="text-zinc-600">•</span>
                  {c.user_name && (
                    <span className="text-white font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-400 inline" /> {c.user_name}
                    </span>
                  )}
                  {c.user_phone && (
                    <span className="text-zinc-400 text-[11px] hidden sm:inline">
                      <Phone className="w-3 h-3 inline mr-0.5 text-zinc-500" /> {c.user_phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {renderBadge(c.last_rag_level)}
                  <span className="text-[10px] text-zinc-400 bg-[#111010] px-2 py-0.5 rounded border border-[#282626]">
                    {c.total_messages} msgs
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </div>
              </div>

              {c.last_message && !isExpanded && (
                <div className="bg-[#111010] p-3 rounded-xl border border-[#262424] text-xs text-zinc-300">
                  <span className="text-zinc-500 font-semibold mr-1">Último mensaje:</span>
                  <span>"{c.last_message}"</span>
                </div>
              )}

              {isExpanded && c.messages && (
                <div className="pt-2 border-t border-[#262424] space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Transcripción de la Conversación:</span>
                  <div className="space-y-2 bg-[#111010] p-3 rounded-xl border border-[#262424] max-h-60 overflow-y-auto">
                    {c.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                          m.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-[#181717] border border-[#282626] text-zinc-200 rounded-tl-none'
                        }`}>
                          <p>{m.text}</p>
                          {m.rag_level && (
                            <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] text-emerald-400">
                              <span>Traza RAG: {m.rag_level}</span>
                              {m.time && <span className="text-zinc-400">{m.time}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Clock, User, Sparkles, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

interface ConversationItem {
  id: string;
  user_name?: string;
  user_phone?: string;
  created_at: string;
  last_message?: string;
  last_rag_level?: string;
  total_messages: number;
}

interface ConversationsTabProps {
  tenantId?: string;
}

export const ConversationsTab: React.FC<ConversationsTabProps> = ({ tenantId }) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/tenant-conversations/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const getBadge = (level?: string) => {
    switch (level) {
      case 'semantic_cache':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">⚡ Caché $0</span>;
      case 'level_2_faq':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">💡 FAQ Nivel 2</span>;
      case 'level_3_catalog':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">📦 Catálogo D1</span>;
      case 'unstructured_docs':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">📄 Manuales</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Conversación</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Auditoría de Conversaciones (RAG Nivel 1 & D1)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Historial de chats en tiempo real con la traza de memoria y nivel de RAG utilizado.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {conversations.length} Sesiones
        </span>
      </div>

      {isLoading && conversations.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">Cargando conversaciones desde Cloudflare D1...</div>
      ) : conversations.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
          Aún no hay conversaciones registradas para esta tienda.
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-slate-500">{c.id.substring(0, 16)}...</span>
                  {c.user_name && <span className="text-slate-200 font-semibold ml-1"><User className="w-3 h-3 inline" /> {c.user_name}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {getBadge(c.last_rag_level)}
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {c.total_messages} msgs
                  </span>
                </div>
              </div>

              {c.last_message && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-500 font-semibold mr-1">Último mensaje:</span>
                  <span>"{c.last_message}"</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

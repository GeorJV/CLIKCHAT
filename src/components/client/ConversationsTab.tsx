import React from 'react';
import { MessageSquare, Radio } from 'lucide-react';
import { useConversations } from './conversations/useConversations';
import { ConversationList } from './conversations/ConversationList';
import { ConversationDetail } from './conversations/ConversationDetail';

export const ConversationsTab: React.FC<{ tenantId?: string }> = ({ tenantId }) => {
  const {
    sessions,
    activeFilter,
    selectedId,
    setSelectedId,
    handleToggleStatus,
    handleChangeFilter
  } = useConversations(tenantId);

  const selectedSession = sessions.find(s => s.id === selectedId) || null;
  const onlineCount = sessions.filter(s => s.status === 'online').length;

  return (
    <div className="space-y-3.5 font-sans">
      {/* Encabezado General */}
      <div className="onyx-card rounded-xl p-3.5 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 leading-tight">
              <span>Auditoría de Conversaciones (RAG Nivel 1 & D1)</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
              Monitorea en tiempo real los chats atendidos por el bot y consulta el historial completo de clientes reales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <Radio className={`w-3 h-3 ${onlineCount > 0 ? 'animate-pulse' : ''}`} />
            <span>{onlineCount} Online</span>
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1a1919] text-zinc-400 border border-[#282626] font-mono">
            {sessions.length} Total
          </span>
        </div>
      </div>

      {/* Vista de 2 Columnas: Lista a la Izquierda, Transcripción a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <ConversationList
            sessions={sessions}
            selectedId={selectedId}
            onSelectSession={setSelectedId}
            activeFilter={activeFilter}
            onChangeFilter={handleChangeFilter}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <ConversationDetail
            session={selectedSession}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
};

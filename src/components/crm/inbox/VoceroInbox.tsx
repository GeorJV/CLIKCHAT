import React from 'react';
import { CrmLead, CrmMessage, CrmStageId, CrmInboxFilter } from '../../../types/crm';
import { VoceroConversationList } from './VoceroConversationList';
import { VoceroActiveChat } from './VoceroActiveChat';
import { VoceroLeadDetailPanel } from './VoceroLeadDetailPanel';

interface VoceroInboxProps {
  leads: CrmLead[];
  selectedLead: CrmLead | null;
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  messages: CrmMessage[];
  isLoadingLeads: boolean;
  isLoadingMessages: boolean;
  filterInbox: CrmInboxFilter;
  onSetFilterInbox: (filter: CrmInboxFilter) => void;
  searchTerm: string;
  onSetSearchTerm: (term: string) => void;
  onChangeStage: (leadId: string, stage: CrmStageId) => void;
  onToggleTakeover: (leadId: string) => void;
  onSendMessage: (leadId: string, text: string) => void;
  onUpdateLead: (leadId: string, fields: Partial<CrmLead>) => void;
  onOpenNewLeadModal: () => void;
}

export const VoceroInbox: React.FC<VoceroInboxProps> = ({
  leads,
  selectedLead,
  selectedLeadId,
  onSelectLead,
  messages,
  isLoadingLeads,
  isLoadingMessages,
  filterInbox,
  onSetFilterInbox,
  searchTerm,
  onSetSearchTerm,
  onChangeStage,
  onToggleTakeover,
  onSendMessage,
  onUpdateLead,
  onOpenNewLeadModal,
}) => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-zinc-950 font-sans">
      {/* Columna 1: Lista de Conversaciones Multicanal */}
      <div className="w-80 shrink-0 h-full border-r border-zinc-800/80">
        <VoceroConversationList
          leads={leads}
          selectedLeadId={selectedLeadId}
          onSelectLead={onSelectLead}
          filterInbox={filterInbox}
          onSetFilterInbox={onSetFilterInbox}
          searchTerm={searchTerm}
          onSetSearchTerm={onSetSearchTerm}
          onOpenNewLeadModal={onOpenNewLeadModal}
          isLoading={isLoadingLeads}
        />
      </div>

      {/* Columna 2: Chat Activo & Control de Takeover */}
      <div className="flex-1 h-full min-w-0">
        <VoceroActiveChat
          lead={selectedLead}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          onToggleTakeover={onToggleTakeover}
          onSendMessage={onSendMessage}
        />
      </div>

      {/* Columna 3: Panel de Detalles del Lead & CRM */}
      <div className="w-80 shrink-0 h-full hidden lg:block">
        <VoceroLeadDetailPanel
          lead={selectedLead}
          onChangeStage={onChangeStage}
          onUpdateLead={onUpdateLead}
        />
      </div>
    </div>
  );
};

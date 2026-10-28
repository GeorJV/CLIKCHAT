import React, { useState } from 'react';
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
  businessType?: string;
  tenantSlug?: string;
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
  businessType,
  tenantSlug,
}) => {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="flex h-full w-full overflow-hidden bg-white font-sans">
      {/* Columna 1: Lista de Conversaciones */}
      <div className="w-[320px] shrink-0 h-full border-r border-[#e8edf6]">
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
          tenantSlug={tenantSlug}
        />
      </div>

      {/* Columna 2: Hilo del Chat Activo */}
      <div className="flex-1 h-full min-w-0">
        <VoceroActiveChat
          lead={selectedLead}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          panelOpen={panelOpen}
          onTogglePanel={() => setPanelOpen(!panelOpen)}
          onToggleTakeover={onToggleTakeover}
          onSendMessage={onSendMessage}
        />
      </div>

      {/* Columna 3: Detalles del Contacto */}
      {panelOpen && selectedLead && (
        <div className="w-80 shrink-0 h-full border-l border-[#e8edf6]">
          <VoceroLeadDetailPanel
            lead={selectedLead}
            onChangeStage={onChangeStage}
            onUpdateLead={onUpdateLead}
            onSendMessage={onSendMessage}
            onClose={() => setPanelOpen(false)}
            businessType={businessType}
          />
        </div>
      )}
    </div>
  );
};

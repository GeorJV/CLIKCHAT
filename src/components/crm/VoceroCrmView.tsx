import React, { useState } from 'react';
import { useVoceroCrm } from '../../hooks/useVoceroCrm';
import { useVoceroMode } from '../../hooks/useVoceroMode';
import { VoceroAppNav, VoceroNavTab } from './VoceroAppNav';
import { VoceroInbox } from './inbox/VoceroInbox';
import { VoceroPipelineBoard } from './pipeline/VoceroPipelineBoard';
import { VoceroContactsView } from './contacts/VoceroContactsView';
import { VoceroAiSandbox } from './sandbox/VoceroAiSandbox';

interface VoceroCrmViewProps {
  tenantId?: string;
  tenantSlug: string;
  tenantName?: string;
}

export const VoceroCrmView: React.FC<VoceroCrmViewProps> = ({
  tenantId,
  tenantSlug,
  tenantName,
}) => {
  const [activeTab, setActiveTab] = useState<VoceroNavTab>('inbox');
  const { setVoceroMode } = useVoceroMode();

  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    selectedLead,
    messages,
    isLoadingLeads,
    isLoadingMessages,
    filterInbox,
    setFilterInbox,
    searchTerm,
    setSearchTerm,
    changeLeadStage,
    toggleTakeover,
    sendAgentMessage,
    updateLead,
    createLead,
  } = useVoceroCrm(tenantId);

  const handleSelectLeadFromPipeline = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('inbox');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f8fc] font-sans">
      {/* Barra Lateral Vocero Oficial (Azul Marino Fijo #0b1327) */}
      <VoceroAppNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={leads.filter(l => l.stage === 'lead').length}
        userName={tenantName || tenantSlug}
        onSwitchToClassic={() => setVoceroMode(false)}
      />

      {/* Contenido Principal con Papel Frío Vocero (#f6f8fc) */}
      <main className="flex-1 h-full min-w-0 overflow-hidden relative bg-[#f6f8fc]">
        {activeTab === 'inbox' && (
          <VoceroInbox
            leads={leads}
            selectedLead={selectedLead}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
            messages={messages}
            isLoadingLeads={isLoadingLeads}
            isLoadingMessages={isLoadingMessages}
            filterInbox={filterInbox}
            onSetFilterInbox={setFilterInbox}
            searchTerm={searchTerm}
            onSetSearchTerm={setSearchTerm}
            onChangeStage={changeLeadStage}
            onToggleTakeover={toggleTakeover}
            onSendMessage={sendAgentMessage}
            onUpdateLead={updateLead}
            onOpenNewLeadModal={() => setActiveTab('pipeline')}
          />
        )}

        {activeTab === 'pipeline' && (
          <VoceroPipelineBoard
            leads={leads}
            onSelectLead={handleSelectLeadFromPipeline}
            onChangeStage={changeLeadStage}
            onCreateLead={createLead}
          />
        )}

        {activeTab === 'contacts' && (
          <VoceroContactsView
            leads={leads}
            onSelectLead={handleSelectLeadFromPipeline}
          />
        )}

        {(activeTab === 'agent' || activeTab === 'lab' || activeTab === 'onboarding') && (
          <VoceroAiSandbox
            tenantSlug={tenantSlug}
            tenantName={tenantName}
          />
        )}

        {(activeTab === 'bookings' || activeTab === 'results' || activeTab === 'settings') && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[#42506b]">
            <p className="font-serif text-[24px] italic text-[#0a1730] mb-2">
              Sección de {activeTab.toUpperCase()}
            </p>
            <p className="text-xs text-[#8391aa] max-w-sm">
              Sincronizado directamente con Cloudflare D1 en tiempo real.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { useVoceroCrm } from '../../hooks/useVoceroCrm';
import { useVoceroMode } from '../../hooks/useVoceroMode';
import { VoceroTopNav, VoceroViewTab } from './VoceroTopNav';
import { VoceroInbox } from './inbox/VoceroInbox';
import { VoceroPipelineBoard } from './pipeline/VoceroPipelineBoard';
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
  const [activeTab, setActiveTab] = useState<VoceroViewTab>('inbox');
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
    <div className="flex flex-col h-full w-full bg-zinc-950 text-slate-100 overflow-hidden font-sans">
      {/* Barra de Navegación Superior Vocero CRM */}
      <VoceroTopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tenantName={tenantName}
        tenantSlug={tenantSlug}
        onSwitchToClassic={() => setVoceroMode(false)}
      />

      {/* Contenido Dinámico de la Vista */}
      <main className="flex-1 overflow-hidden relative">
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

        {activeTab === 'sandbox' && (
          <div className="h-full overflow-y-auto p-4">
            <VoceroAiSandbox
              tenantSlug={tenantSlug}
              tenantName={tenantName}
            />
          </div>
        )}
      </main>
    </div>
  );
};

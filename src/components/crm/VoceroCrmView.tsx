import React, { useState } from 'react';
import { useVoceroCrm } from '../../hooks/useVoceroCrm';
import { useVoceroMode } from '../../hooks/useVoceroMode';
import { useClientPortal } from '../../hooks/useClientPortal';
import { VoceroAppNav, VoceroNavTab } from './VoceroAppNav';
import { VoceroInbox } from './inbox/VoceroInbox';
import { VoceroPipelineBoard } from './pipeline/VoceroPipelineBoard';
import { VoceroContactsView } from './contacts/VoceroContactsView';
import { VoceroAiSandbox } from './sandbox/VoceroAiSandbox';
import { VoceroSettingsView } from './settings/VoceroSettingsView';
import { VoceroAgentView } from './agent/VoceroAgentView';
import { VoceroOnboardingView } from './onboarding/VoceroOnboardingView';
import { VoceroBookingsView } from './bookings/VoceroBookingsView';
import { VoceroResultsView } from './results/VoceroResultsView';
import { VoceroClikChatView } from './clikchat/VoceroClikChatView';

interface VoceroCrmViewProps {
  tenantId?: string;
  tenantSlug: string;
  tenantName?: string;
}

export const VoceroCrmView: React.FC<VoceroCrmViewProps> = ({ tenantId, tenantSlug, tenantName }) => {
  const [activeTab, setActiveTab] = useState<VoceroNavTab>('inbox');
  const { setVoceroMode } = useVoceroMode();

  const {
    tenant, products, faqs, updateSettings,
    createProduct, updateProduct, deleteProduct,
    createFaq, updateFaq, deleteFaq,
  } = useClientPortal(tenantSlug);

  const {
    leads, selectedLeadId, setSelectedLeadId, selectedLead, messages,
    isLoadingLeads, isLoadingMessages, filterInbox, setFilterInbox,
    searchTerm, setSearchTerm, changeLeadStage, toggleTakeover,
    sendAgentMessage, updateLead, createLead,
  } = useVoceroCrm(tenant?.id || tenantId);

  const handleSelectLeadFromPipeline = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('inbox');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f8fc] font-sans">
      <VoceroAppNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={leads.filter(l => l.stage === 'lead').length}
        userName={tenant?.name || tenantName || tenantSlug}
        onSwitchToClassic={() => setVoceroMode(false)}
      />

      <main className="flex-1 h-full min-w-0 overflow-hidden relative bg-[#f6f8fc]">
        {activeTab === 'inbox' && (
          <VoceroInbox
            leads={leads} selectedLead={selectedLead} selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId} messages={messages} isLoadingLeads={isLoadingLeads}
            isLoadingMessages={isLoadingMessages} filterInbox={filterInbox} onSetFilterInbox={setFilterInbox}
            searchTerm={searchTerm} onSetSearchTerm={setSearchTerm} onChangeStage={changeLeadStage}
            onToggleTakeover={toggleTakeover} onSendMessage={sendAgentMessage} onUpdateLead={updateLead}
            onOpenNewLeadModal={() => setActiveTab('pipeline')}
          />
        )}

        {activeTab === 'pipeline' && (
          <VoceroPipelineBoard
            leads={leads} onSelectLead={handleSelectLeadFromPipeline}
            onChangeStage={changeLeadStage} onCreateLead={createLead}
          />
        )}

        {activeTab === 'contacts' && (
          <VoceroContactsView leads={leads} onSelectLead={handleSelectLeadFromPipeline} />
        )}

        {activeTab === 'bookings' && (
          <VoceroBookingsView tenantId={tenant?.id || tenantId} currency={tenant?.currency} />
        )}

        {activeTab === 'clikchat' && (
          <VoceroClikChatView
            tenant={tenant} tenantSlug={tenantSlug} leads={leads} selectedLead={selectedLead}
            selectedLeadId={selectedLeadId} onSelectLead={setSelectedLeadId} messages={messages}
            onToggleTakeover={toggleTakeover} onSendMessage={sendAgentMessage} onUpdateSettings={updateSettings}
          />
        )}

        {activeTab === 'onboarding' && (
          <VoceroOnboardingView tenant={tenant} products={products} faqs={faqs} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'agent' && (
          <VoceroAgentView
            tenant={tenant} tenantSlug={tenantSlug} faqs={faqs} onUpdateSettings={updateSettings}
            onCreateFaq={createFaq} onUpdateFaq={updateFaq} onDeleteFaq={deleteFaq}
          />
        )}

        {activeTab === 'lab' && (
          <VoceroAiSandbox tenantSlug={tenantSlug} tenantName={tenant?.name || tenantName} />
        )}

        {activeTab === 'results' && (
          <VoceroResultsView leads={leads} tenantSlug={tenantSlug} currency={tenant?.currency} />
        )}

        {activeTab === 'settings' && (
          <VoceroSettingsView
            tenant={tenant} tenantSlug={tenantSlug} products={products} onUpdateSettings={updateSettings}
            onCreateProduct={createProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct}
          />
        )}
      </main>
    </div>
  );
};

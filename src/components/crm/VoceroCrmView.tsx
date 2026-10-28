import React, { useState, useEffect } from 'react';
import { useVoceroCrm } from '../../hooks/useVoceroCrm';
import { useVoceroMode } from '../../hooks/useVoceroMode';
import { useClientPortal } from '../../hooks/useClientPortal';
import { useAppRouter, getVoceroTabPath } from '../../hooks/useAppRouter';
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
import { VoceroAiAnalystView } from './analyst/VoceroAiAnalystView';
import { VoceroProductsView } from './products/VoceroProductsView';
import { VoceroFaqRagView } from './faqs/VoceroFaqRagView';
import { VoceroAiReportsView } from './reports/VoceroAiReportsView';
import { MyAccountTab } from '../client/account/MyAccountTab';
import { FlaskConical } from 'lucide-react';
import { useNewBookingAlert } from '../../hooks/useNewBookingAlert';
import { NewBookingBanner } from '../client/NewBookingBanner';

interface VoceroCrmViewProps {
  tenantId?: string;
  tenantSlug: string;
  tenantName?: string;
  onLogout?: () => void;
}

export const VoceroCrmView: React.FC<VoceroCrmViewProps> = ({ tenantId, tenantSlug, tenantName, onLogout }) => {
  const { pathname, navigate, currentVoceroTab } = useAppRouter();
  const [activeTab, setActiveTab] = useState<VoceroNavTab>(() => currentVoceroTab || 'settings');
  const { setVoceroMode } = useVoceroMode();

  const {
    tenant, products, faqs, unresolved, updateSettings, createProduct, updateProduct,
    deleteProduct, createFaq, updateFaq, deleteFaq, resolveQuery, trackProductEvent
  } = useClientPortal(tenantSlug);

  const pendingUnresolvedCount = (unresolved || []).filter(u => u.status === 'pending').length;

  const {
    leads, selectedLeadId, setSelectedLeadId, selectedLead, messages,
    isLoadingLeads, isLoadingMessages, filterInbox, setFilterInbox,
    searchTerm, setSearchTerm, changeLeadStage, toggleTakeover,
    sendAgentMessage, updateLead, createLead, deleteLead, deleteLeads
  } = useVoceroCrm(tenant?.id || tenantId);

  const {
    newBooking, unreadCount: unreadBookingsCount, highlightedBookingId,
    acknowledgeBooking, focusBooking, dismissAlert
  } = useNewBookingAlert(tenantSlug);
  const [autoOpenBooking, setAutoOpenBooking] = useState<any>(null);

  useEffect(() => {
    if (currentVoceroTab && currentVoceroTab !== activeTab) setActiveTab(currentVoceroTab);
  }, [currentVoceroTab]);

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  useEffect(() => {
    const canonical = getVoceroTabPath(tenantSlug, activeTab);
    const isSubSetting = ['/perfil', '/canales', '/whatsapp', '/catalogo', '/ia', '/motor-ia', '/zernio', '/cuenta', '/ajustes'].some(s => pathname.includes(s));
    if (!isSubSetting && pathname !== canonical && !pathname.endsWith(`/${activeTab}`) && !pathname.includes(`/${activeTab}`)) {
      navigate(canonical, { replace: true });
    }
  }, [tenantSlug]);

  const handleSelectTab = (tab: VoceroNavTab, subPath?: string) => {
    setActiveTab(tab);
    let targetPath = subPath ? `/user/mi-negocio/${encodeURIComponent(tenantSlug)}/${subPath}` : getVoceroTabPath(tenantSlug, tab);
    if (tab === 'settings' && !subPath && typeof window !== 'undefined') {
      const saved = localStorage.getItem('clikchat_settings_subtab_' + tenantSlug);
      if (saved) targetPath = `/user/mi-negocio/${encodeURIComponent(tenantSlug)}/${saved}`;
    }
    if (pathname !== targetPath) navigate(targetPath);
  };

  const handleSelectLeadFromPipeline = (leadId: string) => {
    setSelectedLeadId(leadId);
    handleSelectTab('inbox');
  };

  return (
    <div className="flex h-full w-full max-h-[100dvh] overflow-hidden bg-[#f6f8fc] font-sans">
      <VoceroAppNav
        activeTab={activeTab} onSelectTab={handleSelectTab}
        unreadCount={leads.filter(l => l.stage === 'lead').length}
        unresolvedCount={pendingUnresolvedCount}
        unreadBookingsCount={unreadBookingsCount}
        userName={tenant?.name || tenantName || tenantSlug} onSwitchToClassic={() => setVoceroMode(false)} onLogout={onLogout}
      />

      <main className="flex-1 h-full min-w-0 flex flex-col overflow-hidden relative bg-[#f6f8fc]">
        {newBooking && (
          <div className="shrink-0 px-4 sm:px-6 pt-3">
            <NewBookingBanner booking={newBooking} onViewBooking={(b) => { focusBooking(b); setAutoOpenBooking(b); handleSelectTab('bookings'); dismissAlert(); }} onDismiss={dismissAlert} />
          </div>
        )}
        <div className="flex-1 min-h-0 h-full w-full overflow-hidden">
          {activeTab === 'inbox' && (
            <VoceroInbox
              leads={leads} selectedLead={selectedLead} selectedLeadId={selectedLeadId}
              onSelectLead={setSelectedLeadId} messages={messages} isLoadingLeads={isLoadingLeads}
              isLoadingMessages={isLoadingMessages} filterInbox={filterInbox} onSetFilterInbox={setFilterInbox}
              searchTerm={searchTerm} onSetSearchTerm={setSearchTerm} onChangeStage={changeLeadStage}
              onToggleTakeover={toggleTakeover} onSendMessage={sendAgentMessage} onUpdateLead={updateLead} onOpenNewLeadModal={() => handleSelectTab('pipeline')}
              businessType={tenant?.business_type || (tenant as any)?.businessType}
            />
          )}
          {activeTab === 'pipeline' && (
            <VoceroPipelineBoard leads={leads} onSelectLead={handleSelectLeadFromPipeline} onChangeStage={changeLeadStage} onCreateLead={createLead} businessType={tenant?.business_type || (tenant as any)?.businessType} />
          )}
          {activeTab === 'contacts' && (
            <VoceroContactsView leads={leads} onSelectLead={handleSelectLeadFromPipeline} onDeleteLead={deleteLead} onDeleteLeads={deleteLeads} />
          )}
          {activeTab === 'bookings' && (
            <VoceroBookingsView tenantId={tenant?.id || tenantId} currency={tenant?.currency} highlightedBookingId={highlightedBookingId} autoOpenBooking={autoOpenBooking} onAcknowledgeBooking={acknowledgeBooking} onClearAutoOpenBooking={() => setAutoOpenBooking(null)} />
          )}
          {activeTab === 'clikchat' && (
            <VoceroClikChatView
              tenant={tenant} tenantSlug={tenantSlug} leads={leads} selectedLead={selectedLead} selectedLeadId={selectedLeadId}
              onSelectLead={setSelectedLeadId} messages={messages} onToggleTakeover={toggleTakeover} onSendMessage={sendAgentMessage} onUpdateSettings={updateSettings}
            />
          )}
          {activeTab === 'products' && (
            <VoceroProductsView products={products} tenant={tenant} onCreateProduct={createProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />
          )}
          {activeTab === 'onboarding' && (
            <VoceroOnboardingView tenant={tenant} products={products} faqs={faqs} onNavigateTab={handleSelectTab} onUpdateSettings={updateSettings} onCreateProduct={createProduct} onCreateFaq={createFaq} />
          )}
          {activeTab === 'agent' && (
            <VoceroAgentView tenant={tenant} tenantSlug={tenantSlug} faqs={faqs} onUpdateSettings={updateSettings} onCreateFaq={createFaq} onUpdateFaq={updateFaq} onDeleteFaq={deleteFaq} />
          )}
          {activeTab === 'faqs' && (
            <VoceroFaqRagView faqs={faqs} unresolved={unresolved} onCreateFaq={createFaq} onUpdateFaq={updateFaq} onDeleteFaq={deleteFaq} onResolveQuery={resolveQuery} />
          )}
          {activeTab === 'lab' && (
            <VoceroAiSandbox tenantSlug={tenantSlug} tenantId={tenant?.id || tenantId} tenant={tenant} tenantName={tenant?.name || tenantName} products={products} faqs={faqs} onCreateFaq={createFaq} />
          )}
          {activeTab === 'analyst' && <VoceroAiAnalystView tenantSlug={tenantSlug} tenantId={tenant?.id || tenantId} currency={tenant?.currency} />}
          {activeTab === 'reports' && <VoceroAiReportsView tenantSlug={tenantSlug} tenantId={tenant?.id || tenantId} onOpenInboxLead={() => handleSelectTab('inbox')} />}
          {activeTab === 'results' && <VoceroResultsView leads={leads} tenantSlug={tenantSlug} currency={tenant?.currency} products={products} onTrackProductEvent={trackProductEvent} />}
          {activeTab === 'settings' && (
            <VoceroSettingsView tenant={tenant} tenantSlug={tenantSlug} products={products} onUpdateSettings={updateSettings} onCreateProduct={createProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />
          )}
          {activeTab === 'account' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0b0c10]">
              <MyAccountTab tenant={tenant} user={null} onUpdateSettings={updateSettings} />
            </div>
          )}
        </div>

        {/* Botón flotante para probar el bot al instante desde cualquier pantalla */}
        {activeTab !== 'lab' && (
          <div className="fixed bottom-16 right-4 z-40">
            <button
              onClick={() => handleSelectTab('lab')}
              title="Abrir Simulador en vivo para probar al Asistente"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#0d5bff] hover:bg-[#0047e1] text-white shadow-xl hover:shadow-2xl transition cursor-pointer border border-blue-400/30"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Probar Asistente</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

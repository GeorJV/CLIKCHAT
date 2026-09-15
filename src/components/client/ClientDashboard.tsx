import React, { useState } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';
import { useAppRouter, TAB_ROUTE_MAP } from '../../hooks/useAppRouter';
import { ClientTab } from '../../types/client';
import { ClientSidebar } from './ClientSidebar';
import { ClientLogin } from './ClientLogin';
import { ChatbotQLinkTab } from './ChatbotQLinkTab';
import { UnresolvedQueriesTab } from './UnresolvedQueriesTab';
import { FaqsManagerTab } from './FaqsManagerTab';
import { ProductsManagerTab } from './ProductsManagerTab';
import { DocumentsManagerTab } from './DocumentsManagerTab';
import { BotSettingsTab } from './BotSettingsTab';
import { BusinessSettingsTab } from './BusinessSettingsTab';
import { ConversationsTab } from './ConversationsTab';
import { ClientsTab } from './ClientsTab';
import { AgendaTab } from './AgendaTab';
import { UserProfileTab } from './UserProfileTab';

interface ClientDashboardProps {
  tenantSlug?: string;
  onOpenLiveChat?: () => void;
  onSelectTenant?: (slug: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  tenantSlug = 'acme-store',
  onOpenLiveChat,
  onSelectTenant
}) => {
  const { pathname, navigate, currentTab, isLoginUrl, isUserRoute, userId } = useAppRouter();
  const [authOverride, setAuthOverride] = useState<boolean | null>(null);
  const isAuthenticated = authOverride !== null ? authOverride : !isLoginUrl;
  const activeTab: ClientTab = currentTab;

  const {
    tenantSlug: currentSlug,
    setTenantSlug,
    tenant,
    products,
    faqs,
    unresolved,
    availableTenants,
    isLoading,
    saveSuccess,
    resolveQuery,
    createFaq,
    updateFaq,
    deleteFaq,
    createBulkFaqs,
    createProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
    loadTenantData
  } = useClientPortal(tenantSlug);

  const handleLogin = (slug: string) => {
    setTenantSlug(slug);
    setAuthOverride(true);
    navigate('/dashboard');
    if (onSelectTenant) onSelectTenant(slug);
  };

  const handleTabChange = (tab: ClientTab) => {
    navigate(TAB_ROUTE_MAP[tab] || '/dashboard');
  };

  if (!isAuthenticated) {
    return (
      <ClientLogin
        availableTenants={availableTenants}
        onLogin={handleLogin}
        onOpenChatPreview={onOpenLiveChat}
      />
    );
  }

  const pendingCount = unresolved.filter(u => u.status === 'pending').length;

  return (
    <div className="h-full w-full flex bg-[#151414] text-slate-100 overflow-hidden font-sans">
      {/* Dark Modern Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        unresolvedCount={pendingCount}
        tenantSlug={currentSlug}
      />

      {/* Main Content Viewport with Dot Grid Texture */}
      <main className="flex-1 h-full overflow-y-auto p-3 sm:px-6 sm:pt-2.5 sm:pb-6 bg-dot-grid transition-all duration-300">
        <div className="w-full transition-all duration-300">
          {isLoading && !tenant && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {activeTab === 'chatbot' && <ChatbotQLinkTab tenant={tenant} tenantSlug={currentSlug} onOpenLiveChat={onOpenLiveChat} />}
          {activeTab === 'business' && <BusinessSettingsTab tenant={tenant} tenantSlug={currentSlug} onUpdateSettings={updateSettings} saveSuccess={saveSuccess} />}
          {activeTab === 'products' && (
            <ProductsManagerTab
              products={products}
              tenantSlug={currentSlug}
              tenant={tenant}
              onRefresh={() => loadTenantData(currentSlug)}
              onCreateProduct={createProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />
          )}
          {activeTab === 'faqs' && <FaqsManagerTab faqs={faqs} onCreateFaq={createFaq} onUpdateFaq={updateFaq} onDeleteFaq={deleteFaq} onCreateBulkFaqs={createBulkFaqs} />}
          {activeTab === 'documents' && <DocumentsManagerTab tenantId={tenant?.id} />}
          {activeTab === 'audit' && <UnresolvedQueriesTab unresolved={unresolved} onResolve={resolveQuery} />}
          {activeTab === 'conversations' && <ConversationsTab tenantId={tenant?.id} />}
          {activeTab === 'settings' && <BotSettingsTab tenant={tenant} onUpdateSettings={updateSettings} saveSuccess={saveSuccess} onOpenLiveChat={onOpenLiveChat} />}
          {activeTab === 'clientes' && <ClientsTab />}
          {activeTab === 'agenda' && <AgendaTab />}
          {activeTab === 'user' && <UserProfileTab userId={userId} tenantName={tenant?.name} tenantSlug={currentSlug} />}
        </div>
      </main>
    </div>
  );
};

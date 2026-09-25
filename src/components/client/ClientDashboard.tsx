import React, { useState } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';
import { useAppRouter, TAB_ROUTE_MAP } from '../../hooks/useAppRouter';
import { ClientTab } from '../../types/client';
import { ClientSidebar } from './ClientSidebar';
import { ClientLogin } from './ClientLogin';
import { ChatbotQLinkTab } from './ChatbotQLinkTab';
import { BusinessSettingsTab } from './BusinessSettingsTab';
import { ProductsManagerTab } from './ProductsManagerTab';
import { ConversationsTab } from './ConversationsTab';
import { ClientsTab } from './ClientsTab';
import { AgendaTab } from './AgendaTab';
import { AITrainingTab } from './training/AITrainingTab';
import { SupportTab } from './support/SupportTab';
import { UserProfileTab } from './UserProfileTab';
import { SwitchTenantModal } from './modals/SwitchTenantModal';

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
  const { navigate, currentTab, isLoginUrl, userId } = useAppRouter();
  const [authOverride, setAuthOverride] = useState<boolean | null>(null);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const isAuthenticated = authOverride !== null ? authOverride : !isLoginUrl;
  const activeTab: ClientTab = currentTab;

  const {
    tenantSlug: currentSlug, setTenantSlug, tenant, products, faqs, unresolved,
    availableTenants, isLoading, saveSuccess, resolveQuery, createFaq, updateFaq,
    deleteFaq, createBulkFaqs, createProduct, updateProduct, deleteProduct,
    updateSettings, loadTenantData
  } = useClientPortal(tenantSlug);

  const handleLogin = (slug: string) => {
    setTenantSlug(slug); setAuthOverride(true); navigate('/dashboard');
    if (onSelectTenant) onSelectTenant(slug);
  };

  if (!isAuthenticated) {
    return <ClientLogin availableTenants={availableTenants} onLogin={handleLogin} onOpenChatPreview={onOpenLiveChat} />;
  }

  const pendingCount = unresolved.filter(u => u.status === 'pending').length;

  return (
    <div className="h-full w-full flex bg-[#151414] text-slate-100 overflow-hidden font-sans">
      <ClientSidebar activeTab={activeTab} setActiveTab={(tab) => navigate(TAB_ROUTE_MAP[tab] || '/dashboard')} unresolvedCount={pendingCount} tenantSlug={currentSlug} />
      <main className="flex-1 h-full overflow-y-auto p-3 sm:px-6 sm:pt-2.5 sm:pb-6 bg-dot-grid transition-all duration-300">
        <div className="w-full transition-all duration-300">
          {isLoading && !tenant && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {activeTab === 'chatbot' && (
            <ChatbotQLinkTab
              tenant={tenant}
              tenantSlug={currentSlug}
              products={products}
              onRefresh={() => loadTenantData(currentSlug)}
              onOpenLiveChat={onOpenLiveChat}
              onSwitchAccount={() => setIsSwitchModalOpen(true)}
            />
          )}
          {(activeTab === 'business' || activeTab === 'faqs' || activeTab === 'settings') && (
            <BusinessSettingsTab
              tenant={tenant} tenantSlug={currentSlug} onUpdateSettings={updateSettings} saveSuccess={saveSuccess}
              onOpenLiveChat={onOpenLiveChat} faqs={faqs} onCreateFaq={createFaq} onUpdateFaq={updateFaq}
              onDeleteFaq={deleteFaq} onCreateBulkFaqs={createBulkFaqs} initialSubTab={activeTab === 'faqs' ? 'faqs' : 'identity'}
            />
          )}
          {activeTab === 'products' && (
            <ProductsManagerTab
              products={products} tenantSlug={currentSlug} tenant={tenant}
              onRefresh={() => loadTenantData(currentSlug)} onCreateProduct={createProduct}
              onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct}
            />
          )}
          {activeTab === 'training' && (
            <AITrainingTab
              tenantId={tenant?.id}
              tenant={tenant}
              onUpdateSettings={updateSettings}
              unresolved={unresolved}
              onResolve={resolveQuery}
            />
          )}
          {activeTab === 'soporte' && (
            <SupportTab ownerEmail={tenant?.owner_email} tenantName={tenant?.name} />
          )}
          {activeTab === 'conversations' && <ConversationsTab tenantId={tenant?.id} />}
          {activeTab === 'clientes' && <ClientsTab tenantId={tenant?.id} />}
          {activeTab === 'agenda' && <AgendaTab tenantId={tenant?.id} />}
          {activeTab === 'user' && (
            <UserProfileTab userId={userId} tenantName={tenant?.name} tenantSlug={currentSlug} ownerName={tenant?.owner_name} ownerEmail={tenant?.owner_email} plan={tenant?.plan} />
          )}
        </div>
      </main>

      <SwitchTenantModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        availableTenants={availableTenants}
        currentSlug={currentSlug}
        onSelectTenant={(slug) => {
          setTenantSlug(slug);
          if (onSelectTenant) onSelectTenant(slug);
        }}
        onLogout={() => {
          setAuthOverride(false);
          navigate('/login');
        }}
      />
    </div>
  );
};

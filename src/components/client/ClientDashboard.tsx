import React, { useState } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<ClientTab>('chatbot');

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
    deleteFaq,
    createBulkFaqs,
    createProduct,
    updateProduct,
    deleteProduct,
    updateSettings
  } = useClientPortal(tenantSlug);

  const handleLogin = (slug: string) => {
    setTenantSlug(slug);
    setIsAuthenticated(true);
    if (onSelectTenant) onSelectTenant(slug);
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
    <div className="h-full w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Dark Modern Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unresolvedCount={pendingCount}
        tenantSlug={currentSlug}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 bg-slate-950/60">
        <div className="max-w-5xl mx-auto">
          {isLoading && !tenant && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {activeTab === 'chatbot' && <ChatbotQLinkTab tenant={tenant} tenantSlug={currentSlug} onOpenLiveChat={onOpenLiveChat} />}
          {activeTab === 'business' && <BusinessSettingsTab tenant={tenant} tenantSlug={currentSlug} onUpdateSettings={updateSettings} saveSuccess={saveSuccess} />}
          {activeTab === 'products' && <ProductsManagerTab products={products} tenantSlug={currentSlug} tenant={tenant} onCreateProduct={createProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />}
          {activeTab === 'faqs' && <FaqsManagerTab faqs={faqs} onCreateFaq={createFaq} onDeleteFaq={deleteFaq} onCreateBulkFaqs={createBulkFaqs} />}
          {activeTab === 'documents' && <DocumentsManagerTab tenantId={tenant?.id} />}
          {activeTab === 'audit' && <UnresolvedQueriesTab unresolved={unresolved} onResolve={resolveQuery} />}
          {activeTab === 'conversations' && <ConversationsTab tenantId={tenant?.id} />}
          {activeTab === 'settings' && <BotSettingsTab tenant={tenant} onUpdateSettings={updateSettings} saveSuccess={saveSuccess} onOpenLiveChat={onOpenLiveChat} />}
        </div>
      </main>
    </div>
  );
};

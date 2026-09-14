import React, { useState } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';
import { ClientTab } from '../../types/client';
import { ClientHeader } from './ClientHeader';
import { ClientLogin } from './ClientLogin';
import { UnresolvedQueriesTab } from './UnresolvedQueriesTab';
import { FaqsManagerTab } from './FaqsManagerTab';
import { ProductsManagerTab } from './ProductsManagerTab';
import { BotSettingsTab } from './BotSettingsTab';

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
  const [activeTab, setActiveTab] = useState<ClientTab>('audit');

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
    createProduct,
    updateSettings
  } = useClientPortal(tenantSlug);

  const handleLogin = (slug: string) => {
    setTenantSlug(slug);
    setIsAuthenticated(true);
    if (onSelectTenant) onSelectTenant(slug);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100">
      <ClientHeader
        tenant={tenant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unresolvedCount={pendingCount}
        onOpenLiveChat={onOpenLiveChat}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        {isLoading && !tenant && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {activeTab === 'audit' && (
          <UnresolvedQueriesTab
            unresolved={unresolved}
            onResolve={resolveQuery}
          />
        )}

        {activeTab === 'faqs' && (
          <FaqsManagerTab
            faqs={faqs}
            onCreateFaq={createFaq}
            onDeleteFaq={deleteFaq}
          />
        )}

        {activeTab === 'products' && (
          <ProductsManagerTab
            products={products}
            onCreateProduct={createProduct}
          />
        )}

        {activeTab === 'settings' && (
          <BotSettingsTab
            tenant={tenant}
            onUpdateSettings={updateSettings}
            saveSuccess={saveSuccess}
          />
        )}
      </main>
    </div>
  );
};

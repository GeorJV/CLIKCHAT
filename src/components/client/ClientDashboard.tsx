import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClientPortal } from '../../hooks/useClientPortal';
import { useAppRouter, getTenantTabPath } from '../../hooks/useAppRouter';
import { ClientTab } from '../../types/client';
import { ClientSidebar } from './ClientSidebar';
import { ClientLogin } from './ClientLogin';
import { ClientRegister } from './ClientRegister';
import { ChatbotQLinkTab } from './ChatbotQLinkTab';
import { BusinessSettingsTab } from './BusinessSettingsTab';
import { ProductsManagerTab } from './ProductsManagerTab';
import { ConversationsTab } from './ConversationsTab';
import { ClientsTab } from './ClientsTab';
import { AgendaTab } from './AgendaTab';
import { AITrainingTab } from './training/AITrainingTab';
import { SupportTab } from './support/SupportTab';
import { UserProfileTab } from './UserProfileTab';
import { MyAccountTab } from './account/MyAccountTab';
import { SwitchTenantModal } from './modals/SwitchTenantModal';

interface ClientDashboardProps {
  tenantSlug?: string;
  onOpenLiveChat?: () => void;
  onSelectTenant?: (slug: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  tenantSlug = '',
  onOpenLiveChat,
  onSelectTenant
}) => {
  const { navigate, currentTab, routeTenantSlug, isPanelUrl, pathname } = useAppRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login, register, logout } = useAuth();
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const activeTab: ClientTab = currentTab;

  const storedSlug = typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null;
  const activeSlug = routeTenantSlug || user?.tenantSlug || (storedSlug && storedSlug !== 'acme-store' ? storedSlug : '') || (tenantSlug && tenantSlug !== 'acme-store' ? tenantSlug : '') || 'geosoft';

  const {
    tenantSlug: currentSlug, setTenantSlug, tenant, products, faqs, unresolved,
    availableTenants, isLoading, saveSuccess, resolveQuery, createFaq, updateFaq,
    deleteFaq, createBulkFaqs, createProduct, updateProduct, deleteProduct,
    updateSettings, loadTenantData
  } = useClientPortal(activeSlug);

  useEffect(() => {
    if (activeSlug && activeSlug !== 'acme-store' && typeof window !== 'undefined') {
      localStorage.setItem('clikchat_active_tenant_slug', activeSlug);
    }
  }, [activeSlug]);

  useEffect(() => {
    if (isAuthenticated && activeSlug && !isPanelUrl) {
      navigate(getTenantTabPath(activeSlug, activeTab), { replace: true });
    }
  }, [isAuthenticated, activeSlug, isPanelUrl, activeTab, navigate]);

  if (isAuthLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#151414]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isRegisterView) {
      return (
        <ClientRegister
          onRegister={register}
          onSwitchToLogin={() => setIsRegisterView(false)}
          error={authError}
        />
      );
    }
    return (
      <ClientLogin
        onLogin={login}
        onSwitchToRegister={() => setIsRegisterView(true)}
        error={authError}
      />
    );
  }

  const pendingCount = unresolved.filter(u => u.status === 'pending').length;

  return (
    <div className="h-full w-full flex bg-[#151414] text-slate-100 overflow-hidden font-sans">
      <ClientSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(getTenantTabPath(currentSlug || activeSlug, tab))}
        unresolvedCount={pendingCount}
        tenantSlug={currentSlug}
        onLogout={logout}
      />
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
            <SupportTab ownerEmail={user?.email || tenant?.owner_email} tenantName={tenant?.name} />
          )}
          {activeTab === 'conversations' && <ConversationsTab tenantId={tenant?.id} />}
          {activeTab === 'clientes' && <ClientsTab tenantId={tenant?.id} />}
          {activeTab === 'agenda' && <AgendaTab tenantId={tenant?.id} />}
          {(activeTab === 'account' || activeTab === 'user') && (
            <MyAccountTab
              tenant={tenant}
              user={user}
              onUpdateSettings={updateSettings}
            />
          )}
        </div>
      </main>

      <SwitchTenantModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        availableTenants={user?.role === 'superadmin' ? availableTenants : availableTenants.filter(t => t.slug === currentSlug)}
        currentSlug={currentSlug}
        onSelectTenant={(slug) => {
          setTenantSlug(slug);
          navigate(getTenantTabPath(slug, activeTab));
          if (onSelectTenant) onSelectTenant(slug);
        }}
        onLogout={logout}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { MobileChatView } from './components/chat/MobileChatView';
import { ProductChatView } from './components/chat/product/ProductChatView';
import { ServiceChatView } from './components/chat/service/ServiceChatView';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Briefcase, ShieldCheck, Smartphone, ShoppingBag, Globe, UtensilsCrossed, Truck } from 'lucide-react';
import { useProductResolver, toServiceItem } from './hooks/useProductResolver';
import { useAppRouter, AppView, getTenantTabPath, getVoceroTabPath } from './hooks/useAppRouter';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useVoceroMode } from './hooks/useVoceroMode';
import { VoceroCrmView } from './components/crm/VoceroCrmView';
import { VoceroModeTogglePill } from './components/crm/common/VoceroModeTogglePill';
import { KitchenKdsView } from './components/kds/KitchenKdsView';
import { RiderDispatchView } from './components/rider/RiderDispatchView';
import { DEFAULT_PRODUCT } from './components/chat/product/productChatMock';

const NAV_VIEWS = [
  { id: 'landing' as AppView, label: 'Web', icon: Globe, path: '/' },
  { id: 'chat' as AppView, label: 'Chat Móvil', icon: Smartphone, path: '/chat' },
  { id: 'product' as AppView, label: 'Producto', icon: ShoppingBag, path: '/producto' },
  { id: 'kds' as AppView, label: 'KDS Cocina', icon: UtensilsCrossed, path: '/kds' },
  { id: 'rider' as AppView, label: 'Riders', icon: Truck, path: '/rider' },
  { id: 'client' as AppView, label: 'Panel', icon: Briefcase, path: '/dashboard' },
  { id: 'admin' as AppView, label: 'Admin', icon: ShieldCheck, path: '/super-admin' },
] as const;

export function App() {
  const { search, currentView, routeTenantSlug, routeProductId, navigate } = useAppRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { isVoceroMode } = useVoceroMode();
  const params = typeof window !== 'undefined' ? new URLSearchParams(search) : null;
  const productId = routeProductId || params?.get('p') || null;

  const isSuperAdmin = Boolean(
    user?.role === 'superadmin' || currentView === 'admin' || (typeof window !== 'undefined' && localStorage.getItem('clikchat_role') === 'superadmin') || params?.has('admin') || params?.get('role') === 'superadmin'
  );

  const [selectedTenantSlug, setSelectedTenantSlug] = useState<string>(() => (
    (user && user.role !== 'superadmin' ? user.tenantSlug : null) || routeTenantSlug || params?.get('t') || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'comida-callejera-xl'
  ));

  useEffect(() => {
    if (user && user.role !== 'superadmin' && user.tenantSlug) {
      if (user.tenantSlug !== selectedTenantSlug) setSelectedTenantSlug(user.tenantSlug);
      return;
    }
    const t = routeTenantSlug || params?.get('t');
    if (t && t !== selectedTenantSlug) setSelectedTenantSlug(t);
    else if (user?.tenantSlug && user.tenantSlug !== selectedTenantSlug && !t) setSelectedTenantSlug(user.tenantSlug);
  }, [search, routeTenantSlug, user?.tenantSlug, user?.role]);

  const { productItem, productsList, storeName, agentName, agentAvatar, welcomeMessage, isLoading: isResolvingProduct, responseDelaySec, botResponseSpeedSec, deliveryMode, businessType } = useProductResolver(productId, selectedTenantSlug);
  const hideTopBar = !isSuperAdmin || currentView === 'landing' || currentView === 'product' || currentView === 'service' || (currentView === 'chat' && (params?.has('t') || routeTenantSlug) && !params?.has('panel'));
  const isServicesBiz = businessType === 'servicios';
  const servicesList = productsList?.length > 0 ? productsList.map(toServiceItem) : (productItem ? [toServiceItem(productItem)] : []);

  return (
    <div className={`flex flex-col h-[100dvh] max-h-[100dvh] w-full max-w-full ${isVoceroMode ? 'bg-[#f6f8fc] text-[#0a1730]' : 'bg-[#151414] text-slate-100'} overflow-hidden font-sans`}>
      {!hideTopBar && isSuperAdmin && (
        <nav className={`h-12 shrink-0 border-b flex items-center justify-between px-3 md:px-6 z-40 ${isVoceroMode ? 'bg-white border-[#e8edf6]' : 'bg-[#151414] border-[#282626]'}`}>
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate(isVoceroMode ? getVoceroTabPath(selectedTenantSlug, 'settings') : getTenantTabPath(selectedTenantSlug, 'business'))}>
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-black text-xs shadow-sm ${isVoceroMode ? 'bg-blue-50 border-blue-200 text-[#0d5bff]' : 'bg-[#1a1919] border-[#2e2b2b] text-emerald-400'}`}>CK</div>
            <span className={`font-bold text-sm tracking-tight ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>ClikChat <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ml-1 ${isVoceroMode ? 'bg-slate-100 text-[#62728d] border-slate-200' : 'bg-white/[0.05] text-zinc-400 border-white/10'}`}>SaaS</span></span>
          </div>
          <div className={`flex items-center space-x-1 p-1 rounded-xl border ${isVoceroMode ? 'bg-[#f1f5f9] border-[#e2e8f0]' : 'bg-[#111010] border-[#282626]'}`}>
            {NAV_VIEWS.map(({ id, label, icon: Icon, path }) => (
              <button key={id} onClick={() => navigate(id === 'client' ? (isVoceroMode ? getVoceroTabPath(selectedTenantSlug, 'settings') : getTenantTabPath(selectedTenantSlug, 'business')) : path)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${currentView === id ? (isVoceroMode ? 'bg-white text-[#0d5bff] shadow-xs' : 'bg-[#222020] text-emerald-400 border border-[#383535] shadow-sm') : (isVoceroMode ? 'text-[#62728d] hover:text-[#0a1730]' : 'text-zinc-400 hover:text-white')}`}
              ><Icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{label}</span></button>
            ))}
          </div>
        </nav>
      )}

      {/* Main Container */}
      <main className={`flex-1 min-h-0 overflow-hidden relative ${isVoceroMode ? 'bg-[#f6f8fc]' : 'bg-[#151414]'}`}>
        {currentView === 'landing' && (
          <div className="h-full w-full overflow-y-auto bg-[#0a0a0c]">
            <LandingPage onGoToDashboard={(slug) => { const active = slug || selectedTenantSlug || 'comida-callejera-xl'; setSelectedTenantSlug(active); navigate(isVoceroMode ? getVoceroTabPath(active, 'settings') : getTenantTabPath(active, 'business')); }} onGoToAdmin={() => navigate('/super-admin')} />
          </div>
        )}
        {(currentView === 'chat' && !isServicesBiz) && (
          <div className="h-full w-full max-h-full overflow-hidden flex flex-col items-center justify-center bg-[#151414] p-0 sm:p-1.5 md:p-3">
            <MobileChatView tenantSlug={selectedTenantSlug} onNavigateToPanel={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))} />
          </div>
        )}
        {currentView === 'product' && (
          <div className="h-full w-full overflow-hidden bg-[#222020]">
            {isResolvingProduct && !productItem ? <div className="h-full w-full flex items-center justify-center bg-[#151414] text-xs font-semibold text-zinc-300">Cargando catálogo virtual...</div> : (
              <ProductChatView storeName={storeName || 'Tienda Oficial'} agentName={agentName || 'Asistente Virtual'} agentAvatar={agentAvatar} welcomeMessage={welcomeMessage} tenantSlug={selectedTenantSlug} initialProduct={productItem || DEFAULT_PRODUCT} products={productsList?.length > 0 ? productsList : (productItem ? [productItem] : [DEFAULT_PRODUCT])} responseDelaySec={responseDelaySec} botResponseSpeedSec={botResponseSpeedSec} deliveryMode={deliveryMode} businessType={businessType} onExit={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))} />
            )}
          </div>
        )}
        {(currentView === 'service' || (currentView === 'chat' && isServicesBiz)) && (
          <div className="h-full w-full overflow-hidden bg-[#131212]">
            {isResolvingProduct && !storeName ? <div className="h-full w-full flex items-center justify-center bg-[#151414] text-xs font-semibold text-zinc-300">Cargando agenda y asesoría virtual...</div> : (
              <ServiceChatView storeName={storeName || 'Centro Especializado'} agentName={agentName || 'Asesora Profesional'} agentAvatar={agentAvatar} welcomeMessage={welcomeMessage} tenantSlug={selectedTenantSlug} responseDelaySec={responseDelaySec} botResponseSpeedSec={botResponseSpeedSec} deliveryMode={deliveryMode} services={servicesList} initialService={servicesList[0]} onExit={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))} />
            )}
          </div>
        )}
        {currentView === 'kds' && <div className="h-full w-full overflow-hidden bg-[#121214]"><ErrorBoundary fallbackTitle="KDS Cocina"><KitchenKdsView tenantSlug={selectedTenantSlug} storeName={storeName || 'Cocina'} /></ErrorBoundary></div>}
        {currentView === 'rider' && <div className="h-full w-full overflow-hidden bg-[#121214]"><ErrorBoundary fallbackTitle="Motorizados"><RiderDispatchView riderName="Repartidor Express" /></ErrorBoundary></div>}
        {currentView === 'client' && (
          <div className={`h-full w-full ${isVoceroMode ? 'bg-[#f6f8fc] text-[#0a1730] overflow-hidden' : 'bg-[#151414] text-slate-100 overflow-y-auto'}`}>
            {isVoceroMode ? (
              <ErrorBoundary fallbackTitle="ClikChat CRM"><VoceroCrmView tenantSlug={selectedTenantSlug} tenantName={storeName} onLogout={logout} /></ErrorBoundary>
            ) : (
              <ErrorBoundary fallbackTitle="Panel del Negocio"><ClientDashboard tenantSlug={selectedTenantSlug} onOpenLiveChat={() => navigate(`/chat/${selectedTenantSlug}`)} onSelectTenant={(slug) => { setSelectedTenantSlug(slug); if (typeof window !== 'undefined') localStorage.setItem('clikchat_active_tenant_slug', slug); }} /></ErrorBoundary>
            )}
          </div>
        )}
        {currentView === 'admin' && <div className="h-full w-full overflow-y-auto bg-[#151414]"><ErrorBoundary fallbackTitle="Super Admin Panel"><SuperAdminDashboard /></ErrorBoundary></div>}
        <VoceroModeTogglePill />
      </main>
    </div>
  );
}

export default App;

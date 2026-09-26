import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { MobileChatView } from './components/chat/MobileChatView';
import { ProductChatView } from './components/chat/product/ProductChatView';
import { ServiceChatView } from './components/chat/service/ServiceChatView';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Briefcase, ShieldCheck, Smartphone, ShoppingBag, Calendar, Globe } from 'lucide-react';
import { useProductResolver } from './hooks/useProductResolver';
import { useAppRouter, AppView, getTenantTabPath } from './hooks/useAppRouter';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const NAV_VIEWS = [
  { id: 'landing' as AppView, label: 'Web Oficial', icon: Globe, path: '/' },
  { id: 'chat' as AppView, label: 'Chat Móvil', icon: Smartphone, path: '/chat' },
  { id: 'product' as AppView, label: 'Chat Producto', icon: ShoppingBag, path: '/producto' },
  { id: 'service' as AppView, label: 'Chat Servicio', icon: Calendar, path: '/servicio' },
  { id: 'client' as AppView, label: 'Panel Cliente', icon: Briefcase, path: '/dashboard' },
  { id: 'admin' as AppView, label: 'Super Admin', icon: ShieldCheck, path: '/super-admin' },
] as const;

export function App() {
  const { pathname, search, currentView, routeTenantSlug, routeProductId, navigate } = useAppRouter();
  const { user } = useAuth();
  const params = typeof window !== 'undefined' ? new URLSearchParams(search) : null;
  const productId = routeProductId || params?.get('p') || null;

  const isSuperAdmin = Boolean(
    user?.role === 'superadmin' ||
    currentView === 'admin' ||
    (typeof window !== 'undefined' && localStorage.getItem('clikchat_role') === 'superadmin') ||
    params?.has('admin') ||
    params?.get('role') === 'superadmin'
  );

  const [selectedTenantSlug, setSelectedTenantSlug] = useState<string>(() => (
    routeTenantSlug || params?.get('t') || (typeof window !== 'undefined' ? localStorage.getItem('clikchat_active_tenant_slug') : null) || 'geosoft'
  ));

  useEffect(() => {
    const t = routeTenantSlug || params?.get('t');
    if (t && t !== selectedTenantSlug) {
      setSelectedTenantSlug(t);
    } else if (user?.tenantSlug && user.tenantSlug !== selectedTenantSlug && !t) {
      setSelectedTenantSlug(user.tenantSlug);
    }
  }, [search, routeTenantSlug, user?.tenantSlug]);
  const { productItem, storeName, agentName, agentAvatar, welcomeMessage, isLoading: isResolvingProduct, responseDelaySec, businessType } = useProductResolver(productId, selectedTenantSlug);

  const hideTopBar = !isSuperAdmin || currentView === 'landing' || currentView === 'product' || currentView === 'service' || (currentView === 'chat' && (params?.has('t') || routeTenantSlug) && !params?.has('panel'));

  return (
    <div className="flex flex-col h-screen w-screen bg-[#151414] text-slate-100 overflow-hidden font-sans">
      {!hideTopBar && isSuperAdmin && (
        <nav className="h-12 shrink-0 bg-[#151414] border-b border-[#282626] flex items-center justify-between px-3 md:px-6 z-40">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))}>
            <div className="w-7 h-7 rounded-lg bg-[#1a1919] border border-[#2e2b2b] flex items-center justify-center font-mono font-black text-emerald-400 text-xs shadow-sm">
              CK
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              ClikChat <span className="text-[10px] text-zinc-400 font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 ml-1">SaaS Multi-Tenant</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#111010] p-1 rounded-xl border border-[#282626]">
            {NAV_VIEWS.map(({ id, label, icon: Icon, path }) => (
              <button
                key={id}
                onClick={() => navigate(id === 'client' ? getTenantTabPath(selectedTenantSlug, 'business') : path)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === id
                    ? 'bg-[#222020] text-emerald-400 border border-[#383535] shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Main Container */}
      <main className="flex-1 overflow-hidden relative bg-[#151414]">
        {currentView === 'landing' && (
          <div className="h-full w-full overflow-y-auto bg-[#0a0a0c]">
            <LandingPage
              onGoToDashboard={(targetSlug) => {
                const active = targetSlug || localStorage.getItem('clikchat_active_tenant_slug') || selectedTenantSlug || 'geosoft';
                setSelectedTenantSlug(active);
                navigate(getTenantTabPath(active, 'business'));
              }}
              onGoToAdmin={() => navigate('/super-admin')}
            />
          </div>
        )}

        {currentView === 'chat' && (
          <div className="h-full w-full flex items-center justify-center bg-[#151414] p-0 md:p-4">
            <MobileChatView
              tenantSlug={selectedTenantSlug}
              onNavigateToPanel={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))}
            />
          </div>
        )}

        {currentView === 'product' && (
          <div className="h-full w-full overflow-hidden bg-[#222020]">
            {isResolvingProduct || !productItem ? (
              <div className="h-full w-full flex flex-col items-center justify-center bg-[#151414] text-zinc-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs font-semibold text-zinc-300">Cargando producto y asesoría virtual...</span>
              </div>
            ) : (
              <ProductChatView
                storeName={storeName || 'Tienda Oficial'}
                agentName={agentName || 'Asistente Virtual'}
                agentAvatar={agentAvatar}
                welcomeMessage={welcomeMessage}
                initialProduct={productItem}
                products={[productItem]}
                responseDelaySec={responseDelaySec}
                businessType={businessType}
                onExit={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))}
              />
            )}
          </div>
        )}

        {currentView === 'service' && (
          <div className="h-full w-full overflow-hidden bg-[#131212]">
            {isResolvingProduct || !storeName ? (
              <div className="h-full w-full flex flex-col items-center justify-center bg-[#151414] text-zinc-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs font-semibold text-zinc-300">Cargando servicio y asesoría virtual...</span>
              </div>
            ) : (
              <ServiceChatView
                storeName={storeName || 'Centro Especializado'}
                agentName={agentName || 'Asesora Profesional'}
                agentAvatar={agentAvatar}
                responseDelaySec={responseDelaySec}
                onExit={() => navigate(getTenantTabPath(selectedTenantSlug, 'business'))}
              />
            )}
          </div>
        )}

        {currentView === 'client' && (
          <div className="h-full w-full overflow-y-auto bg-[#151414]">
            <ErrorBoundary fallbackTitle="Panel del Negocio">
              <ClientDashboard
                tenantSlug={selectedTenantSlug}
                onOpenLiveChat={() => navigate(`/chat/${selectedTenantSlug}`)}
                onSelectTenant={(slug) => {
                  setSelectedTenantSlug(slug);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('clikchat_active_tenant_slug', slug);
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        )}

        {currentView === 'admin' && (
          <div className="h-full w-full overflow-y-auto bg-[#151414]">
            <SuperAdminDashboard />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { MobileChatView } from './components/chat/MobileChatView';
import { ProductChatView } from './components/chat/product/ProductChatView';
import { ServiceChatView } from './components/chat/service/ServiceChatView';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Briefcase, ShieldCheck, Smartphone, ShoppingBag, Calendar } from 'lucide-react';
import { useProductResolver } from './hooks/useProductResolver';

const NAV_VIEWS = [
  { id: 'chat', label: 'Chat Móvil', icon: Smartphone },
  { id: 'product', label: 'Chat Producto', icon: ShoppingBag },
  { id: 'service', label: 'Chat Servicio', icon: Calendar },
  { id: 'client', label: 'Panel Cliente', icon: Briefcase },
  { id: 'admin', label: 'Super Admin', icon: ShieldCheck },
] as const;

export function App() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const productId = params?.get('p') || null;
  const isServiceChat = params?.get('view') === 'service' || params?.has('s') || params?.has('service');
  const isProductChat = params?.get('view') === 'product' || params?.has('p');
  const isDirectChat = params?.get('view') === 'chat' || (params?.has('t') && !params?.has('panel'));
  const initialView = isServiceChat ? 'service' : isProductChat ? 'product' : isDirectChat ? 'chat' : 'client';
  const [currentView, setCurrentView] = useState<'chat' | 'product' | 'service' | 'client' | 'admin'>(initialView);
  const [selectedTenantSlug, setSelectedTenantSlug] = useState(params?.get('t') || 'acme-store');
  const { productItem, storeName, agentName, agentAvatar, isLoading: isResolvingProduct } = useProductResolver(productId, selectedTenantSlug);

  // Cuando se genera el link de producto, servicio o chat directo, la barra superior no debe aparecer
  const hideTopBar = isProductChat || isServiceChat || isDirectChat || currentView === 'product' || currentView === 'service';

  return (
    <div className="flex flex-col h-screen w-screen bg-[#151414] text-slate-100 overflow-hidden font-sans">
      {/* SaaS Global Top Bar (Oculta automáticamente en links de producto, servicio o chats de clientes) */}
      {!hideTopBar && (
        <nav className="h-12 shrink-0 bg-[#151414] border-b border-[#282626] flex items-center justify-between px-3 md:px-6 z-40">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1a1919] border border-[#2e2b2b] flex items-center justify-center font-mono font-black text-emerald-400 text-xs shadow-sm">
              CK
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              ClikChat <span className="text-[10px] text-zinc-400 font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 ml-1">SaaS Multi-Tenant</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#111010] p-1 rounded-xl border border-[#282626]">
            {NAV_VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
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
        {currentView === 'chat' && (
          <div className="h-full w-full flex items-center justify-center bg-[#151414] p-0 md:p-4">
            <MobileChatView
              tenantSlug={selectedTenantSlug}
              onNavigateToPanel={() => setCurrentView('client')}
            />
          </div>
        )}

        {currentView === 'product' && (
          <div className="h-full w-full overflow-hidden bg-[#222020]">
            {isResolvingProduct && !productItem ? (
              <div className="h-full w-full flex flex-col items-center justify-center bg-[#222020] text-zinc-400">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs font-semibold text-zinc-300">Cargando producto y asesoría virtual...</span>
              </div>
            ) : (
              <ProductChatView
                storeName={storeName}
                agentName={agentName}
                agentAvatar={agentAvatar}
                initialProduct={productItem || undefined}
                products={productItem ? [productItem] : []}
                onExit={() => setCurrentView('client')}
              />
            )}
          </div>
        )}

        {currentView === 'service' && (
          <div className="h-full w-full overflow-hidden bg-[#131212]">
            <ServiceChatView
              storeName="Centro Estético Aura"
              agentName="Dra. Elena"
              onExit={() => setCurrentView('client')}
            />
          </div>
        )}

        {currentView === 'client' && (
          <div className="h-full w-full overflow-y-auto bg-[#151414]">
            <ClientDashboard
              tenantSlug={selectedTenantSlug}
              onOpenLiveChat={() => setCurrentView('chat')}
              onSelectTenant={(slug) => setSelectedTenantSlug(slug)}
            />
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

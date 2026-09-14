import React, { useState } from 'react';
import { MobileChatView } from './components/chat/MobileChatView';
import { ProductChatView } from './components/chat/product/ProductChatView';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { MessageSquare, Briefcase, ShieldCheck, Smartphone, ShoppingBag } from 'lucide-react';

export function App() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isProductChat = params?.get('view') === 'product' || params?.has('p');
  const isDirectChat = params?.get('view') === 'chat' || (params?.has('t') && !params?.has('panel'));
  const initialView = isProductChat ? 'product' : isDirectChat ? 'chat' : 'client';
  const [currentView, setCurrentView] = useState<'chat' | 'product' | 'client' | 'admin'>(initialView);
  const [selectedTenantSlug, setSelectedTenantSlug] = useState(params?.get('t') || 'acme-store');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#151414] text-slate-100 overflow-hidden font-sans">
      
      {/* SaaS Global Top Bar in Linear/Raycast Dark */}
      <nav className="h-12 shrink-0 bg-[#151414] border-b border-[#282626] flex items-center justify-between px-3 md:px-6 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1a1919] border border-[#2e2b2b] flex items-center justify-center font-mono font-black text-emerald-400 text-xs shadow-sm">
            CK
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            ClikChat <span className="text-[10px] text-zinc-400 font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 ml-1">SaaS Multi-Tenant</span>
          </span>
        </div>

        {/* View Switcher Tabs in Linear Dark Style */}
        <div className="flex items-center space-x-1 bg-[#111010] p-1 rounded-xl border border-[#282626]">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'chat'
                ? 'bg-[#222020] text-white border border-[#383535] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat Móvil</span>
          </button>

          <button
            onClick={() => setCurrentView('product')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'product'
                ? 'bg-[#222020] text-emerald-400 border border-[#383535] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat Producto</span>
          </button>

          <button
            onClick={() => setCurrentView('client')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'client'
                ? 'bg-[#222020] text-white border border-[#383535] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel Cliente</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#222020] text-white border border-[#383535] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Super Admin</span>
          </button>
        </div>
      </nav>

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
          <div className="h-full w-full overflow-hidden bg-[#131212]">
            <ProductChatView
              storeName="Clikchat Store"
              agentName="Sofía"
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

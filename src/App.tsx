import React, { useState } from 'react';
import { MobileChatView } from './components/chat/MobileChatView';
import { ClientDashboard } from './components/client/ClientDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { MessageSquare, Briefcase, ShieldCheck, Smartphone, ExternalLink } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'client' | 'admin'>('chat');
  const [selectedTenantSlug, setSelectedTenantSlug] = useState('demo-store');

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* SaaS Global Top Bar */}
      <nav className="h-12 shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-600/40">
            CK
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            ClikChat <span className="text-[10px] text-indigo-400 font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">SaaS Multi-Tenant</span>
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              currentView === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat Móvil</span>
          </button>

          <button
            onClick={() => setCurrentView('client')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              currentView === 'client'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel Cliente</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Super Admin</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'chat' && (
          <div className="h-full w-full flex items-center justify-center bg-slate-950 p-0 md:p-4">
            <MobileChatView
              tenantSlug={selectedTenantSlug}
              onNavigateToPanel={() => setCurrentView('client')}
            />
          </div>
        )}

        {currentView === 'client' && (
          <div className="h-full w-full overflow-y-auto bg-slate-950">
            <ClientDashboard
              tenantSlug={selectedTenantSlug}
              onOpenLiveChat={() => setCurrentView('chat')}
            />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="h-full w-full overflow-y-auto bg-slate-950">
            <SuperAdminDashboard />
          </div>
        )}
      </main>

    </div>
  );
}

export default App;

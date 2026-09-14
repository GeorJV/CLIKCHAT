import React from 'react';
import { Tenant } from '../../types';
import { ClientTab } from '../../types/client';
import { HelpCircle, Package, Settings, MessageSquare, LogOut, ExternalLink, Bot } from 'lucide-react';

interface ClientHeaderProps {
  tenant: Tenant | null;
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  unresolvedCount: number;
  onOpenLiveChat?: () => void;
  onLogout?: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  tenant,
  activeTab,
  setActiveTab,
  unresolvedCount,
  onOpenLiveChat,
  onLogout
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {tenant?.name || 'Panel del Negocio'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {tenant?.slug || 'multi-tenant'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Asesor IA: <strong>{tenant?.bot_name || 'Sofía'}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Horario: {tenant?.business_hours || 'Lunes a Sábado 8am-7pm'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenLiveChat && (
            <button
              onClick={onOpenLiveChat}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Probar Chat en Vivo</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Cambiar de Tienda / Salir"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex space-x-1 sm:space-x-2 mt-4 border-t border-slate-800/80 pt-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Bandeja HITL</span>
          {unresolvedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black animate-pulse">
              {unresolvedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'faqs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Banco FAQs (RAG N2)</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Catálogo (RAG N3)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Ajustes & Horario</span>
        </button>
      </nav>
    </header>
  );
};

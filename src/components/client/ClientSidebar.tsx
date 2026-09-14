import React, { useState } from 'react';
import { ClientTab } from '../../types/client';
import { Bot, Store, ShoppingBag, BookOpen, FileText, Brain, MessageSquare, Settings, Sparkles, Gift, Pin } from 'lucide-react';

interface ClientSidebarProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  unresolvedCount: number;
  tenantSlug: string;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  activeTab,
  setActiveTab,
  unresolvedCount
}) => {
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  const navItems = [
    { id: 'chatbot' as ClientTab, label: 'Mi Chatbot & QLink', icon: Bot },
    { id: 'business' as ClientTab, label: 'Mi Negocio', icon: Store },
    { id: 'products' as ClientTab, label: 'Mis Productos', icon: ShoppingBag },
    { id: 'faqs' as ClientTab, label: 'Preguntas FAQ', icon: BookOpen },
    { id: 'documents' as ClientTab, label: 'Documentos & Manuales', icon: FileText },
    { id: 'audit' as ClientTab, label: 'Entrenamiento IA', icon: Brain, badge: unresolvedCount },
    { id: 'conversations' as ClientTab, label: 'Conversaciones', icon: MessageSquare },
    { id: 'settings' as ClientTab, label: 'Configuración', icon: Settings }
  ];

  return (
    <aside className="w-60 shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-3 select-none h-full overflow-y-auto">
      <div className="space-y-2">
        {/* Mode Toggle Header */}
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className="flex items-center space-x-2 text-[11px] font-bold tracking-wider text-slate-200 hover:text-white transition"
          >
            <span className={`w-2 h-2 rounded-full ${isSimpleMode ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
            <span>{isSimpleMode ? 'MODO SIMPLE' : 'MODO PRO'}</span>
          </button>
          <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
            <Pin className="w-3 h-3" />
          </div>
        </div>

        {/* Section Title */}
        <div className="px-2 pt-0.5">
          <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
            ⭐ PANEL PRINCIPAL
          </span>
        </div>

        {/* Menu Items tightly grouped */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 border border-slate-700/80 text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white min-w-[16px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Cards */}
      <div className="space-y-2 pt-2.5 border-t border-slate-800/60">
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-2.5 text-left">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>¿Funnels o Webhooks?</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
            Activa el Modo Pro arriba para analítica avanzada de CRM y webhooks.
          </p>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-amber-400 hover:text-amber-300 text-xs font-bold transition shadow-sm"
        >
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>Invita & Gana</span>
        </button>
      </div>
    </aside>
  );
};

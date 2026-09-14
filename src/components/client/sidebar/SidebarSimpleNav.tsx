import React from 'react';
import { ClientTab } from '../../../types/client';
import { Bot, Store, ShoppingBag, BookOpen, FileText, Brain, MessageSquare, Settings } from 'lucide-react';

interface SidebarSimpleNavProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  isExpanded: boolean;
  unresolvedCount: number;
}

export const SidebarSimpleNav: React.FC<SidebarSimpleNavProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  unresolvedCount
}) => {
  const navItems = [
    { id: 'chatbot' as ClientTab, label: 'Mi Chatbot & QLink', icon: Bot },
    { id: 'business' as ClientTab, label: 'Mi Negocio', icon: Store },
    { id: 'products' as ClientTab, label: 'Mis Productos', icon: ShoppingBag },
    { id: 'faqs' as ClientTab, label: 'Preguntas FAQ', icon: BookOpen },
    { id: 'audit' as ClientTab, label: 'Entrenamiento IA', icon: Brain, badge: unresolvedCount },
    { id: 'conversations' as ClientTab, label: 'Conversaciones', icon: MessageSquare },
    { id: 'settings' as ClientTab, label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="space-y-1">
      {/* Category Title */}
      <div className={`py-1 ${isExpanded ? 'px-2' : 'text-center'}`}>
        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
          {isExpanded ? '⭐ Panel Principal' : '⭐'}
        </span>
      </div>

      {/* Nav Buttons */}
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center ${
                isExpanded ? 'justify-between px-2.5' : 'justify-center px-0'
              } py-2 rounded-xl text-xs font-semibold transition relative group cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border border-slate-700/80 text-emerald-400 font-bold shadow-sm shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'space-x-2.5' : 'justify-center'} min-w-0`}>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {isExpanded && <span className="truncate text-left">{item.label}</span>}
              </div>

              {/* Badge for unresolved items */}
              {item.badge !== undefined && item.badge > 0 && (
                isExpanded ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white min-w-[16px] text-center animate-pulse shadow-sm shadow-rose-500/30">
                    {item.badge}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

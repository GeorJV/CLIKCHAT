import React from 'react';
import { ClientTab } from '../../../types/client';
import { Bot, Store, ShoppingBag, BookOpen, Brain, MessageSquare, Settings, Users, Calendar } from 'lucide-react';

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
    { id: 'chatbot' as ClientTab, label: 'Dashboard Principal', icon: Bot },
    { id: 'business' as ClientTab, label: 'Mi Negocio', icon: Store },
    { id: 'products' as ClientTab, label: 'Catálogo de Productos', icon: ShoppingBag },
    { id: 'conversations' as ClientTab, label: 'Conversaciones', icon: MessageSquare },
    { id: 'clientes' as ClientTab, label: 'Gestión de Clientes', icon: Users },
    { id: 'agenda' as ClientTab, label: 'Agenda de Citas', icon: Calendar },
    { id: 'settings' as ClientTab, label: 'Agente IA & Prompts', icon: Brain, badge: unresolvedCount },
    { id: 'faqs' as ClientTab, label: 'Base de Conocimiento', icon: BookOpen },
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
              className={`${
                isExpanded ? 'w-full justify-between px-2.5 py-2 rounded-xl' : 'w-8 h-8 justify-center p-0 mx-auto rounded-lg'
              } flex items-center text-xs font-semibold transition relative group cursor-pointer ${
                isActive
                  ? 'bg-[#1a1919] border border-[#2e2b2b] text-emerald-400 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-[#181717]'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'space-x-2.5' : 'justify-center'} min-w-0`}>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'
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
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

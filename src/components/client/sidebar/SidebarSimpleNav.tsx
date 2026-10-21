import React from 'react';
import { ClientTab } from '../../../types/client';
import {
  Bot, Store, ShoppingBag, Brain, MessageSquare,
  Users, Calendar, LifeBuoy, UserCheck, MessageCircle, Kanban
} from 'lucide-react';

interface SidebarSimpleNavProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  isExpanded: boolean;
  unresolvedCount: number;
  isService?: boolean;
}

export const SidebarSimpleNav: React.FC<SidebarSimpleNavProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  unresolvedCount,
  isService = false
}) => {
  const setupItems = [
    { id: 'business' as ClientTab, step: '1', label: '1. Mi Negocio', icon: Store },
    { id: 'products' as ClientTab, step: '2', label: isService ? '2. Mis Servicios' : '2. Mis Productos / Menú', icon: ShoppingBag },
    { id: 'training' as ClientTab, step: '3', label: '3. Flujo en 4 Pasos & IA', icon: Brain, badge: unresolvedCount },
    { id: 'whatsapp' as ClientTab, step: '4', label: '4. WhatsApp Oficial', icon: MessageCircle }
  ];

  const operationItems = [
    { id: 'crm' as ClientTab, label: 'ClikChat CRM (3-Col & Kanban)', icon: Kanban },
    { id: 'chatbot' as ClientTab, label: 'Dashboard & Métricas', icon: Bot },
    { id: 'conversations' as ClientTab, label: 'Conversaciones', icon: MessageSquare },
    { id: 'clientes' as ClientTab, label: 'Gestión de Clientes', icon: Users },
    { id: 'agenda' as ClientTab, label: 'Agenda de Citas', icon: Calendar }
  ];

  const systemItems = [
    { id: 'account' as ClientTab, label: 'Mi Cuenta', icon: UserCheck },
    { id: 'soporte' as ClientTab, label: 'Soporte', icon: LifeBuoy }
  ];

  const renderNavButton = (item: { id: ClientTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; step?: string }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        title={item.label}
        className={`${
          isExpanded ? 'w-full justify-between px-2.5 py-1.5 rounded-xl' : 'w-8 h-8 justify-center p-0 mx-auto rounded-lg'
        } flex items-center text-xs font-semibold transition relative group cursor-pointer ${
          isActive
            ? 'bg-[#1a1919] border border-emerald-500/40 text-emerald-400 font-bold shadow-sm shadow-emerald-500/10'
            : 'text-zinc-400 hover:text-white hover:bg-[#181717]'
        }`}
      >
        <div className={`flex items-center ${isExpanded ? 'space-x-2.5' : 'justify-center'} min-w-0`}>
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}
          />
          {isExpanded && <span className="truncate text-left text-xs">{item.label}</span>}
        </div>

        {item.badge !== undefined && item.badge > 0 && (
          isExpanded ? (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white min-w-[16px] text-center animate-pulse">
              {item.badge}
            </span>
          ) : (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )
        )}
      </button>
    );
  };

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Pasos de Configuración Inicial */}
      <div className="space-y-1">
        <div className={`py-0.5 ${isExpanded ? 'px-2' : 'text-center'}`}>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
            {isExpanded ? '🚀 Configuración (4 Pasos)' : '🚀'}
          </span>
        </div>
        <nav className="space-y-0.5">{setupItems.map(renderNavButton)}</nav>
      </div>

      {/* 2. Operación y Ventas */}
      <div className="space-y-1 pt-1 border-t border-[#222020]">
        <div className={`py-0.5 ${isExpanded ? 'px-2' : 'text-center'}`}>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {isExpanded ? '📊 Operación & Clientes' : '📊'}
          </span>
        </div>
        <nav className="space-y-0.5">{operationItems.map(renderNavButton)}</nav>
      </div>

      {/* 3. Sistema y Soporte */}
      <div className="space-y-1 pt-1 border-t border-[#222020]">
        <nav className="space-y-0.5">{systemItems.map(renderNavButton)}</nav>
      </div>
    </div>
  );
};

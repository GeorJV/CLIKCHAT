import React from 'react';
import {
  Inbox, Kanban, Users, CalendarDays, ListChecks, ShoppingBag,
  Sparkles, FlaskConical, BarChart3, Settings, ArrowRightLeft, MessageSquareCode, Bot, LogOut, BookOpen
} from 'lucide-react';
import { VoceroBrandLogo } from './VoceroBrandLogo';

export type VoceroNavTab = 'inbox' | 'pipeline' | 'contacts' | 'bookings' | 'clikchat' | 'products' | 'onboarding' | 'agent' | 'faqs' | 'lab' | 'analyst' | 'results' | 'settings';

interface VoceroAppNavProps {
  activeTab: VoceroNavTab;
  onSelectTab: (tab: VoceroNavTab) => void;
  unreadCount?: number;
  unresolvedCount?: number;
  userName?: string;
  onSwitchToClassic: () => void;
  onLogout?: () => void;
}

export const VoceroAppNav: React.FC<VoceroAppNavProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
  unresolvedCount = 0,
  userName = 'Admin',
  onSwitchToClassic,
  onLogout,
}) => {
  const GROUPS = [
    {
      title: 'Trabajo',
      items: [
        { id: 'inbox' as VoceroNavTab, label: 'Bandeja', icon: Inbox, badge: unreadCount },
        { id: 'pipeline' as VoceroNavTab, label: 'Pipeline', icon: Kanban },
        { id: 'contacts' as VoceroNavTab, label: 'Contactos', icon: Users },
        { id: 'bookings' as VoceroNavTab, label: 'Citas', icon: CalendarDays },
      ]
    },
    {
      title: 'Canal Propio',
      items: [
        { id: 'clikchat' as VoceroNavTab, label: 'ClikChat Web', icon: MessageSquareCode },
        { id: 'products' as VoceroNavTab, label: 'Productos / Menú', icon: ShoppingBag },
      ]
    },
    {
      title: 'Agente & Inteligencia',
      items: [
        { id: 'onboarding' as VoceroNavTab, label: 'Guía de inicio', icon: ListChecks },
        { id: 'agent' as VoceroNavTab, label: 'Flow IQ (Agente)', icon: Sparkles },
        { id: 'faqs' as VoceroNavTab, label: 'FAQ IQ (Memoria RAG)', icon: BookOpen, badge: unresolvedCount },
        { id: 'lab' as VoceroNavTab, label: 'Live Lab (Pruebas)', icon: FlaskConical },
      ]
    },
    {
      title: 'Inteligencia',
      items: [
        { id: 'analyst' as VoceroNavTab, label: 'Analista IA', icon: Bot },
        { id: 'results' as VoceroNavTab, label: 'Resultados', icon: BarChart3 },
      ]
    }
  ];

  return (
    <aside className="w-56 shrink-0 h-full flex flex-col justify-between p-3 select-none vocero-nav-dark border-r font-sans text-[#e8eefc] overflow-y-auto [scrollbar-width:none]">
      <div className="space-y-4">
        {/* Marca Vocero Oficial */}
        <div className="px-2 pt-1 pb-1">
          <VoceroBrandLogo />
        </div>

        {/* Menú de Secciones */}
        <nav className="flex flex-col gap-3.5" aria-label="Secciones">
          {GROUPS.map((group, idx) => (
            <div key={group.title || idx} className="flex flex-col gap-0.5">
              {group.title && (
                <span className="vocero-kicker mb-1 block px-2.5 text-[#889cc4]">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-[#0d5bff] text-white font-bold shadow-md shadow-[#0d5bff]/25'
                        : 'text-[#c2d0f0] hover:bg-[#132247] hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#889cc4] group-hover:text-white'}`} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        isActive ? 'bg-white text-[#0d5bff]' : 'bg-[#0d5bff] text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Pie con Ajustes, Perfil y Selector de Modo */}
      <div className="space-y-2 pt-2 border-t border-[#263866]">
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors cursor-pointer group ${
            activeTab === 'settings'
              ? 'bg-[#0d5bff] text-white font-bold shadow-md shadow-[#0d5bff]/25'
              : 'text-[#c2d0f0] hover:bg-[#132247] hover:text-white'
          }`}
        >
          <Settings className={`h-4 w-4 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-[#889cc4] group-hover:text-white'}`} strokeWidth={activeTab === 'settings' ? 2.2 : 1.8} />
          <span className="flex-1 text-left">Ajustes</span>
        </button>

        {/* Perfil del Operador */}
        <div className="flex items-center gap-2 rounded-lg bg-[#070e20] p-2 border border-[#263866]/60">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f3f82] text-[11px] font-bold text-[#6f9eff]">
            {(userName || 'AD').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white leading-tight">{userName || 'Negocio'}</p>
            <p className="truncate text-[10px] text-[#7688b0] leading-tight">Propietario · En línea</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="p-1 rounded text-[#7688b0] hover:text-rose-400 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onSwitchToClassic}
            title="Volver a ClikChat Clásico"
            className="p-1 rounded text-[#7688b0] hover:text-[#3fdcff] transition cursor-pointer"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="px-2 font-mono text-[9.5px] tracking-wider text-[#55648a]">
          v1.58.0 · commit c6ef3fa
        </p>
      </div>
    </aside>
  );
};

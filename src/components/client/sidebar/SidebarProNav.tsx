import React, { useState } from 'react';
import { ClientTab } from '../../../types/client';
import {
  ChevronDown, ChevronRight, LayoutDashboard, Users,
  Store, MessageSquare, Brain, ShoppingBag, Calendar, LifeBuoy
} from 'lucide-react';

interface SidebarProNavProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  isExpanded: boolean;
  unresolvedCount: number;
}

export const SidebarProNav: React.FC<SidebarProNavProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  unresolvedCount
}) => {
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    agencia: true,
    operaciones: true,
    ventas: true
  });

  const toggle = (cat: string) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const renderItem = (id: ClientTab, label: string, Icon: React.ComponentType<{ className?: string }>, badge?: number) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        title={label}
        className={`${
          isExpanded ? 'w-full justify-between px-2.5 py-1.5' : 'w-8 h-8 justify-center p-0 mx-auto'
        } flex items-center rounded-lg text-xs font-semibold transition relative group cursor-pointer ${
          isActive
            ? 'bg-[#1a1919] border border-[#2e2b2b] text-emerald-400 font-bold shadow-sm'
            : 'text-zinc-400 hover:text-white hover:bg-[#181717]'
        }`}
      >
        <div className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} min-w-0`}>
          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
          {isExpanded && <span className="truncate">{label}</span>}
        </div>
        {badge !== undefined && badge > 0 && (
          isExpanded ? (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
              {badge}
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
      {/* 1. AGENCIA */}
      <div>
        <button
          onClick={() => toggle('agencia')}
          className={`w-full flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'} text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 hover:text-slate-200 transition cursor-pointer`}
        >
          {isExpanded && <span>AGENCIA</span>}
          {openCats.agencia ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
        </button>
        {openCats.agencia && (
          <nav className="space-y-0.5">
            {renderItem('chatbot', 'Dashboard Principal', LayoutDashboard)}
            {renderItem('clientes', 'Gestión de Clientes', Users)}
            {renderItem('soporte', 'Soporte', LifeBuoy)}
          </nav>
        )}
      </div>

      {/* 2. OPERACIONES & CRM */}
      <div>
        <button
          onClick={() => toggle('operaciones')}
          className={`w-full flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'} text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 hover:text-slate-200 transition cursor-pointer`}
        >
          {isExpanded && <span>OPERACIONES & CRM</span>}
          {openCats.operaciones ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
        </button>
        {openCats.operaciones && (
          <nav className="space-y-0.5">
            {renderItem('business', 'Mi Negocio', Store)}
            {renderItem('conversations', 'Conversaciones', MessageSquare)}
            {renderItem('agenda', 'Agenda de Citas', Calendar)}
            {renderItem('training', 'Entrenamiento AI', Brain, unresolvedCount)}
          </nav>
        )}
      </div>

      {/* 3. VENTAS & CANALES */}
      <div>
        <button
          onClick={() => toggle('ventas')}
          className={`w-full flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'} text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 hover:text-slate-200 transition cursor-pointer`}
        >
          {isExpanded && <span>VENTAS & CANALES</span>}
          {openCats.ventas ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
        </button>
        {openCats.ventas && (
          <nav className="space-y-0.5">
            {renderItem('products', 'Mis Productos', ShoppingBag)}
          </nav>
        )}
      </div>
    </div>
  );
};

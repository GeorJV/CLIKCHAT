import React, { useState } from 'react';
import { ClientTab } from '../../../types/client';
import {
  ChevronDown, ChevronRight, LayoutDashboard, Users,
  Store, MessageSquare, Brain, FileText, ShoppingBag, BookOpen, Settings
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
        key={label}
        onClick={() => setActiveTab(id)}
        title={label}
        className={`w-full flex items-center ${isExpanded ? 'justify-between px-2.5' : 'justify-center px-0'} py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          isActive
            ? 'bg-slate-900 border border-slate-700/80 text-emerald-400 font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
        }`}
      >
        <div className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'} min-w-0`}>
          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
          {isExpanded && <span className="truncate">{label}</span>}
        </div>
        {badge !== undefined && badge > 0 && isExpanded && (
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-3">
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
            {renderItem('chatbot', 'Dashboard Pro', LayoutDashboard)}
            {renderItem('audit', 'Mis Clientes & Leads', Users)}
            {renderItem('settings', 'Config Agencia', Settings)}
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
            {renderItem('conversations', 'Conversaciones (Inbox)', MessageSquare)}
            {renderItem('audit', 'Entrenamiento IA', Brain, unresolvedCount)}
            {renderItem('documents', 'Conocimiento RAG', FileText)}
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
            {renderItem('products', 'Catálogo Productos', ShoppingBag)}
            {renderItem('faqs', 'Preguntas FAQ', BookOpen)}
          </nav>
        )}
      </div>
    </div>
  );
};

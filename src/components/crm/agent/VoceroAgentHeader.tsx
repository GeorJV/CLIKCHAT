import React, { useState, useRef, useEffect } from 'react';
import {
  UserCog, TrendingUp, ShieldCheck, ShieldAlert,
  FileText, Target, ChevronLeft, ChevronRight, Menu, Check
} from 'lucide-react';

export type VoceroAgentSubTab = 'identidad' | 'flujo' | 'objeciones' | 'reglas' | 'docs' | 'objetivos';

interface TabItem {
  id: VoceroAgentSubTab; fullLabel: string; shortLabel: string;
  icon: React.ComponentType<{ className?: string }>; badge?: number;
}

interface VoceroAgentHeaderProps {
  activeTab: VoceroAgentSubTab;
  onSelectTab: (tab: VoceroAgentSubTab) => void;
  faqCount?: number;
}

export const VoceroAgentHeader: React.FC<VoceroAgentHeaderProps> = ({ activeTab, onSelectTab, faqCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const TABS: TabItem[] = [
    { id: 'identidad', fullLabel: '1. Identidad & Tono', shortLabel: '1. Identidad', icon: UserCog },
    { id: 'flujo', fullLabel: '2. Flow IQ (Venta)', shortLabel: '2. Flow IQ', icon: TrendingUp },
    { id: 'objeciones', fullLabel: '3. FAQ IQ (Dudas)', shortLabel: '3. FAQ IQ', icon: ShieldCheck, badge: faqCount },
    { id: 'reglas', fullLabel: '4. Reglas de Seguridad', shortLabel: '4. Reglas', icon: ShieldAlert },
    { id: 'docs', fullLabel: '5. Documentos RAG', shortLabel: '5. Docs RAG', icon: FileText },
    { id: 'objetivos', fullLabel: '6. Metas', shortLabel: '6. Metas', icon: Target },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-3 sm:px-5 shadow-xs gap-2 select-none font-sans">
      {/* Título Oficial y Subtítulo Abajo para ahorrar espacio horizontal */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shadow-2xs shrink-0">
          <UserCog className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[13px] font-bold tracking-tight text-[#0a1730] leading-tight whitespace-nowrap">
            Cerebro & Flow IQ
          </h2>
          <span className="text-[10px] font-semibold text-[#8391aa] leading-none mt-0.5 whitespace-nowrap">
            Entrenamiento en 6 fases
          </span>
        </div>
      </div>

      {/* Menú de Tabs con Flechas y Menú de Tres Rayas */}
      <div className="flex items-center gap-1 min-w-0">
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="hidden md:flex p-1 rounded-lg text-slate-400 hover:text-[#0a1730] hover:bg-slate-100 transition shrink-0 cursor-pointer"
          title="Desplazar a la izquierda"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl overflow-x-auto [scrollbar-width:none] scroll-smooth"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  active ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730] hover:bg-white/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xl:inline">{tab.fullLabel}</span>
                <span className="inline xl:hidden">{tab.shortLabel}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-0.5 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="hidden md:flex p-1 rounded-lg text-slate-400 hover:text-[#0a1730] hover:bg-slate-100 transition shrink-0 cursor-pointer"
          title="Desplazar a la derecha"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Menú de Tres Rayas Desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
              isMenuOpen
                ? 'bg-blue-50 text-[#0d5bff] border-blue-200 shadow-xs'
                : 'bg-[#f1f5f9] text-[#62728d] border-transparent hover:text-[#0a1730] hover:bg-white'
            }`}
            title="Ver todas las fases"
          >
            <Menu className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-[#dde5f1] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8391aa] border-b border-slate-100 mb-1">
                Fases de Entrenamiento
              </div>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active ? 'bg-blue-50 text-[#0d5bff]' : 'text-[#42506b] hover:bg-[#f6f8fc]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.fullLabel}</span>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 text-[#0d5bff]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

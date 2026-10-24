import React from 'react';
import { MessageSquare, Kanban, FlaskConical, ArrowRightLeft } from 'lucide-react';

export type VoceroViewTab = 'inbox' | 'pipeline' | 'sandbox';

interface VoceroTopNavProps {
  activeTab: VoceroViewTab;
  onSelectTab: (tab: VoceroViewTab) => void;
  tenantName?: string;
  tenantSlug: string;
  onSwitchToClassic: () => void;
}

export const VoceroTopNav: React.FC<VoceroTopNavProps> = ({
  activeTab, onSelectTab, tenantName, tenantSlug, onSwitchToClassic,
}) => {
  const TABS: { id: VoceroViewTab; label: string; icon: React.ElementType }[] = [
    { id: 'inbox', label: 'Bandeja 3-Col', icon: MessageSquare },
    { id: 'pipeline', label: 'Pipeline Kanban', icon: Kanban },
    { id: 'sandbox', label: 'AI Sandbox', icon: FlaskConical },
  ];

  return (
    <header className="h-14 shrink-0 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between select-none font-sans z-30">
      {/* Logotipo y Título de Vocero CRM */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-md">
            CK
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">CLIKCHAT CRM</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Cloudflare Edge
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[140px] sm:max-w-none">
              {tenantName || tenantSlug}
            </p>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del CRM */}
      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === id
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Selector de Modo Visual (Oculto en celular para no estorbar) */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={onSwitchToClassic}
          title="Ver versión ClikChat Clásico"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-400" />
          <span>Modo ClikChat Clásico</span>
        </button>
      </div>
    </header>
  );
};

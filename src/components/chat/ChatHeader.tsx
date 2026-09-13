import React from 'react';
import { Tenant } from '../../types';
import { Sparkles, RefreshCw, Store } from 'lucide-react';

interface ChatHeaderProps {
  tenant: Tenant | null;
  onResetChat: () => void;
  availableTenants?: Tenant[];
  onSelectTenant?: (slug: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  tenant,
  onResetChat,
  availableTenants = [],
  onSelectTenant
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-sm">
      {/* Bot & Store Identity */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={tenant?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt="Bot Avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50"
          />
          {/* Pulsing 'En línea' indicator */}
          <span className="absolute bottom-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-900"></span>
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              {tenant?.bot_name || 'Asistente ClikChat'}
            </h1>
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Store className="w-3 h-3 text-slate-500" />
            <span className="truncate max-w-[140px] font-medium text-slate-300">
              {tenant?.name || 'Tienda Oficial'}
            </span>
            <span className="text-emerald-400 font-semibold">• En línea</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-1.5">
        {availableTenants.length > 1 && onSelectTenant && (
          <select
            value={tenant?.slug}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="text-xs bg-slate-800 text-slate-300 rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {availableTenants.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={onResetChat}
          title="Reiniciar conversación"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

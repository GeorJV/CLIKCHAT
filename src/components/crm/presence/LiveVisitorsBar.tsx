import React, { useState } from 'react';
import { Eye, ShoppingBag, Radio, X } from 'lucide-react';
import { useLiveVisitors, LiveVisitor } from '../../../hooks/useLiveVisitors';

interface LiveVisitorsBarProps {
  tenantSlug?: string;
  onSelectLeadChat?: (sessionId: string) => void;
}

export const LiveVisitorsBar: React.FC<LiveVisitorsBarProps> = ({ tenantSlug, onSelectLeadChat }) => {
  const { activeCount, visitors } = useLiveVisitors(tenantSlug);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative font-sans">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer border shadow-xs ${
          activeCount > 0
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
        }`}
        title="Radar de visitantes en vivo (Tidio Supercharged)"
      >
        <span className="relative flex h-2 w-2">
          {activeCount > 0 && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${activeCount > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
        </span>
        <Radio className="w-3 h-3 text-emerald-600" />
        <span>{activeCount} {activeCount === 1 ? 'visitante' : 'visitantes'} en vivo</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-[#d8e2f0] bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-2">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#0d5bff]" />
              <span className="text-xs font-bold text-[#0a1730]">Visitantes en Tiempo Real</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {visitors.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">
              No hay visitantes activos en este momento.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {visitors.map((v: LiveVisitor) => (
                <div
                  key={v.sessionId}
                  className="p-2 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-[#0a1730] truncate max-w-[140px]">
                      {v.sessionId.replace('anon_', 'Sesión ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      hace {v.secondsAgo}s
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate max-w-[160px]">
                      {v.activeProduct ? `Viendo: ${v.activeProduct}` : `Ruta: ${v.currentPath}`}
                    </span>
                    {v.hasCart && (
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold text-[10px]">
                        <ShoppingBag className="w-3 h-3" /> Con pedido
                      </span>
                    )}
                  </div>

                  {onSelectLeadChat && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        onSelectLeadChat(v.sessionId);
                      }}
                      className="mt-1.5 w-full text-center text-[10.5px] font-bold text-[#0d5bff] hover:underline"
                    >
                      Abrir chat directo →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

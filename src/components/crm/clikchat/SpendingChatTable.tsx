import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatSpendingItem {
  sessionId: string;
  leadName?: string;
  messagesCount: number;
  lastModel?: string;
  costUsd: number;
  neurons: number;
}

interface Props {
  chats: ChatSpendingItem[];
}

export const SpendingChatTable: React.FC<Props> = ({ chats }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
        <h3 className="text-xs font-bold text-[#0a1730] uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#0d5bff]" /> Gasto Detallado por Chat
        </h3>
        <span className="text-[10.5px] text-[#8391aa] font-mono">Últimas conversaciones activas</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] uppercase">
              <th className="pb-2 font-semibold">Cliente / Chat</th>
              <th className="pb-2 font-semibold text-center">Mensajes</th>
              <th className="pb-2 font-semibold">Modelo IA</th>
              <th className="pb-2 font-semibold text-center">Neuronas</th>
              <th className="pb-2 font-semibold text-right">Costo Estimado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chats.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                  No hay conversaciones con consumo registrado aún en este negocio.
                </td>
              </tr>
            ) : (
              chats.map((c, i) => (
                <tr key={c.sessionId || i} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 font-medium text-[#0a1730]">
                    <div>{c.leadName || 'Visitante Web'}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">{c.sessionId}</div>
                  </td>
                  <td className="py-2.5 text-center font-mono text-slate-600">{c.messagesCount}</td>
                  <td className="py-2.5">
                    <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {c.lastModel?.includes('llama') ? 'Llama 3.3 (CF)' : 'GLM-5.3-Flash'}
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-mono text-amber-600 font-semibold">
                    {c.neurons > 0 ? `${c.neurons} n` : '0 n'}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                    ${c.costUsd.toFixed(4)} USD
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

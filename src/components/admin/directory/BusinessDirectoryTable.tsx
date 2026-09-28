import React from 'react';
import { Store, Eye, MessageSquare, ExternalLink } from 'lucide-react';
import { MerchantAdminItem } from '../../../types/adminDirectory';

interface Props {
  merchants: MerchantAdminItem[];
  onOpenDetail: (m: MerchantAdminItem) => void;
}

export const BusinessDirectoryTable: React.FC<Props> = ({ merchants, onOpenDetail }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
          <tr>
            <th className="p-3">Nombre del Negocio</th>
            <th className="p-3">Email</th>
            <th className="p-3 text-center">Slug / ID</th>
            <th className="p-3 text-center">Plan</th>
            <th className="p-3 text-right">Monto</th>
            <th className="p-3 text-center">GLM 5.3 Flash ($5 Max)</th>
            <th className="p-3 text-center">GPT-4o ($2 Max)</th>
            <th className="p-3 text-center">Gasto Total IA</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {merchants.length === 0 ? (
            <tr>
              <td colSpan={10} className="p-8 text-center text-slate-400">
                No se encontraron negocios registrados en Cloudflare D1.
              </td>
            </tr>
          ) : (
            merchants.map((m) => {
              const glmUsage = m.ai_usage?.glm_usage ?? 0;
              const glmLimit = m.ai_usage?.glm_limit ?? 5.00;
              const glmPct = m.ai_usage?.glm_percentage ?? Math.min(100, Math.round((glmUsage / glmLimit) * 100));

              const gptUsage = m.ai_usage?.gpt_usage ?? 0;
              const gptLimit = m.ai_usage?.gpt_limit ?? 2.00;
              const gptPct = m.ai_usage?.gpt_percentage ?? Math.min(100, Math.round((gptUsage / gptLimit) * 100));

              const totalUsage = m.ai_usage?.total_usage ?? Number((glmUsage + gptUsage).toFixed(4));

              return (
                <tr key={m.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Store size={15} className="text-emerald-400 shrink-0" />
                      <div>
                        <span>{m.name}</span>
                        <span className="block text-[10px] font-normal text-slate-400 capitalize">
                          {m.business_type || 'tienda'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">
                    {m.owner_email}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 font-mono font-bold text-[10px] rounded-md border border-slate-700">
                      /{m.slug}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase ${
                      m.plan === 'enterprise'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        : m.plan === 'pro'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    }`}>
                      {m.plan || 'pro'}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-200">
                    {m.currency === 'CRC' ? `₡${(m.monthly_price || 0).toLocaleString()}` : `$${m.monthly_price || 0}`} / {m.billing_cycle || 'mes'}
                  </td>

                  {/* Consumo GLM 5.3 Flash */}
                  <td className="p-3 text-center">
                    <div className="space-y-1 max-w-[110px] mx-auto">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-teal-400">${glmUsage.toFixed(2)}</span>
                        <span className="text-slate-400">/ $5.00</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${glmPct >= 90 ? 'bg-rose-500' : glmPct >= 70 ? 'bg-amber-500' : 'bg-teal-500'}`}
                          style={{ width: `${Math.max(4, glmPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Consumo GPT-4o */}
                  <td className="p-3 text-center">
                    <div className="space-y-1 max-w-[110px] mx-auto">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-purple-400">${gptUsage.toFixed(2)}</span>
                        <span className="text-slate-400">/ $2.00</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${gptPct >= 90 ? 'bg-rose-500' : gptPct >= 70 ? 'bg-amber-500' : 'bg-purple-500'}`}
                          style={{ width: `${Math.max(4, gptPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Gasto Total IA */}
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-800 text-white font-mono font-black text-[11px] rounded-lg border border-slate-700">
                      ${totalUsage.toFixed(2)}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      m.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}>
                      {m.status === 'active' ? '● Activo' : '● Inactivo'}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenDetail(m)}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg shadow transition flex items-center gap-1"
                        title="Ver y editar suscripción"
                      >
                        <Eye size={12} />
                        <span>Detalle</span>
                      </button>
                      <a
                        href={`/chat/${m.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                        title="Abrir Chat Bot"
                      >
                        <MessageSquare size={13} />
                      </a>
                      <a
                        href={`/dashboard?t=${m.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 transition"
                        title="Abrir Panel Cliente"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

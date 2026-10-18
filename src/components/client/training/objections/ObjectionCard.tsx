import React from 'react';
import { FAQ } from '../../../../types';
import { Zap, HelpCircle, CheckCircle2, Trash2, Edit2 } from 'lucide-react';

interface ObjectionCardProps {
  faq: FAQ;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onTestInSimulator?: (trigger: string) => void;
}

export const ObjectionCard: React.FC<ObjectionCardProps> = ({
  faq,
  onEdit,
  onDelete,
  onTestInSimulator
}) => {
  return (
    <div className="bg-[#181717] border border-[#262424] hover:border-[#383535] rounded-xl p-4 transition-all duration-200 group">
      {/* Encabezado: Categoría & Badge Nivel 2 */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
            <span>Nivel 2 · $0 Costo</span>
          </span>
          {faq.category && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
              {faq.category}
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          {onTestInSimulator && (
            <button
              type="button"
              onClick={() => onTestInSimulator(faq.question)}
              title="Probar en el Simulador"
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/10 transition"
            >
              Probar
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(faq)}
            title="Editar Regla"
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(faq.id)}
            title="Eliminar Regla"
            className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gatillo (Si el cliente pregunta) */}
      <div className="mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Si el cliente pregunta:</span>
        </div>
        <p className="text-xs font-semibold text-white pl-5 border-l-2 border-amber-500/40">
          "{faq.question}"
        </p>
      </div>

      {/* Respuesta Exacta (El bot responde de inmediato) */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>El bot responde exactamente:</span>
        </div>
        <p className="text-xs text-zinc-300 pl-5 border-l-2 border-emerald-500/40 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

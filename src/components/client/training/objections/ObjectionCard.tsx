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
    <div className="bg-white hover:shadow-md shadow-sm rounded-2xl p-4 sm:p-5 transition-all duration-200 group font-sans">
      {/* Encabezado: Categoría & Badge Nivel 2 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center gap-1 shadow-2xs">
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600/30" />
            <span>Nivel 2 · $0 Costo</span>
          </span>
          {faq.category && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569]">
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
              className="text-[11px] font-semibold text-[#0d5bff] hover:text-[#0047e1] px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Probar
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(faq)}
            title="Editar Regla"
            className="p-1 text-[#8391aa] hover:text-[#0a1730] hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(faq.id)}
            title="Eliminar Regla"
            className="p-1 text-[#8391aa] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gatillo (Si el cliente pregunta) */}
      <div className="mb-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#62728d] flex items-center gap-1.5 mb-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Si el cliente pregunta:</span>
        </div>
        <div className="bg-[#f8fafc] rounded-xl p-2.5">
          <p className="text-xs font-bold text-[#0a1730] leading-snug">
            "{faq.question}"
          </p>
        </div>
      </div>

      {/* Respuesta Exacta (El bot responde de inmediato) */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#62728d] flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>El bot responde exactamente:</span>
        </div>
        <div className="bg-[#f0fdf4] rounded-xl p-2.5">
          <p className="text-xs text-[#166534] leading-relaxed font-medium">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

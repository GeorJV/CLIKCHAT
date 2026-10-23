import React from 'react';
import { FAQ } from '../../../../types';
import { Zap, HelpCircle, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { useVoceroMode } from '../../../../hooks/useVoceroMode';

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
  const { isVoceroMode } = useVoceroMode();

  return (
    <div className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 group font-sans ${
      isVoceroMode
        ? 'bg-white hover:shadow-md shadow-sm'
        : 'bg-[#181717] hover:bg-[#1d1c1c] border border-[#282626] shadow-md text-white'
    }`}>
      {/* Encabezado: Categoría & Badge Nivel 2 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs ${
            isVoceroMode ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            <Zap className={`w-3 h-3 ${isVoceroMode ? 'text-emerald-600 fill-emerald-600/30' : 'text-emerald-400'}`} />
            <span>Nivel 2 · $0 Costo</span>
          </span>
          {faq.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
              isVoceroMode ? 'bg-[#f1f5f9] text-[#475569]' : 'bg-[#141313] text-zinc-400 border border-[#262424]'
            }`}>
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
              className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                isVoceroMode ? 'text-[#0d5bff] hover:text-[#0047e1] hover:bg-blue-50' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              Probar
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(faq)}
            title="Editar Regla"
            className={`p-1 rounded-lg transition cursor-pointer ${
              isVoceroMode ? 'text-[#8391aa] hover:text-[#0a1730] hover:bg-[#f1f5f9]' : 'text-zinc-500 hover:text-white hover:bg-[#222020]'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(faq.id)}
            title="Eliminar Regla"
            className={`p-1 rounded-lg transition cursor-pointer ${
              isVoceroMode ? 'text-[#8391aa] hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gatillo (Si el cliente pregunta) */}
      <div className="mb-3">
        <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${
          isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'
        }`}>
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Si el cliente pregunta:</span>
        </div>
        <div className={`rounded-xl p-2.5 ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <p className={`text-xs font-bold leading-snug ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
            "{faq.question}"
          </p>
        </div>
      </div>

      {/* Respuesta Exacta (El bot responde de inmediato) */}
      <div>
        <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${
          isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'
        }`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <span>El bot responde exactamente:</span>
        </div>
        <div className={`rounded-xl p-2.5 ${isVoceroMode ? 'bg-[#f0fdf4]' : 'bg-[#121111] border border-[#222]'}`}>
          <p className={`text-xs leading-relaxed font-medium ${isVoceroMode ? 'text-[#166534]' : 'text-emerald-300'}`}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

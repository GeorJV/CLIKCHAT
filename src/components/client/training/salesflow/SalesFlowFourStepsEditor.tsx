import React from 'react';
import { SalesFlowStep } from '../salesFlowPresets';
import { MessageSquare, Tag, ShoppingCart, CheckCircle, Lightbulb } from 'lucide-react';
import { useVoceroMode } from '../../../../hooks/useVoceroMode';

interface SalesFlowFourStepsEditorProps {
  steps: [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
  onChangeStep: (index: number, updated: Partial<SalesFlowStep>) => void;
}

const STEP_ICONS = [MessageSquare, Tag, ShoppingCart, CheckCircle];
const STEP_COLORS = [
  { badge: 'bg-emerald-50 text-emerald-700', darkBadge: 'bg-emerald-500/20 text-emerald-400', tip: 'Saluda y detecta la necesidad sin presionar.' },
  { badge: 'bg-blue-50 text-blue-700', darkBadge: 'bg-blue-500/20 text-blue-400', tip: 'Presenta el producto o servicio con precio oficial.' },
  { badge: 'bg-amber-50 text-amber-700', darkBadge: 'bg-amber-500/20 text-amber-400', tip: 'Upsell (bebida/adicional) o 2 opciones de horario.' },
  { badge: 'bg-purple-50 text-purple-700', darkBadge: 'bg-purple-500/20 text-purple-400', tip: 'Comanda final, resumen y canalización a WhatsApp.' }
];

export const SalesFlowFourStepsEditor: React.FC<SalesFlowFourStepsEditorProps> = ({
  steps,
  onChangeStep
}) => {
  const { isVoceroMode } = useVoceroMode();

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-bold flex items-center gap-1.5 ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>
          <span>Embudo de Conversión en 4 Pasos Obligatorios:</span>
        </h4>
        <span className={`text-[10.5px] ${isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500'}`}>
          El bot respetará este orden estricto de inicio a fin.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {steps.map((st, idx) => {
          const Icon = STEP_ICONS[idx] || MessageSquare;
          const meta = STEP_COLORS[idx] || STEP_COLORS[0];

          return (
            <div
              key={st.step}
              className={`p-4 rounded-2xl space-y-2.5 flex flex-col justify-between transition-shadow ${
                isVoceroMode
                  ? 'bg-[#f8fafc] shadow-xs hover:shadow-sm'
                  : 'bg-[#141313] border border-[#262424] shadow-md hover:border-[#383535]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isVoceroMode ? meta.badge : meta.darkBadge
                    }`}>
                      Paso {st.step}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`} />
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => onChangeStep(idx, { title: e.target.value })}
                    className={`text-xs font-bold bg-transparent border-b border-transparent focus:outline-none px-1 text-right max-w-[170px] truncate ${
                      isVoceroMode ? 'text-[#0a1730] hover:border-[#cbd5e1] focus:border-[#0d5bff]' : 'text-white hover:border-[#444] focus:border-emerald-500'
                    }`}
                    placeholder="Título del paso"
                  />
                </div>

                <textarea
                  rows={4}
                  value={st.instruction}
                  onChange={(e) => onChangeStep(idx, { instruction: e.target.value })}
                  placeholder={`Instrucción para el Paso ${st.step}...`}
                  className={`w-full rounded-xl p-3 text-xs leading-relaxed font-sans resize-none shadow-xs focus:outline-none ${
                    isVoceroMode
                      ? 'bg-white text-[#0a1730] placeholder-[#94a3b8] focus:ring-2 focus:ring-[#0d5bff]/20'
                      : 'bg-[#100f0f] text-white placeholder-zinc-500 border border-[#242222] focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className={`flex items-center gap-1.5 text-[10.5px] pt-2 ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
                <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">{meta.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
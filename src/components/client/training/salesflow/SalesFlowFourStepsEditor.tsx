import React from 'react';
import { SalesFlowStep } from '../salesFlowPresets';
import { MessageSquare, Tag, ShoppingCart, CheckCircle, Lightbulb } from 'lucide-react';

interface SalesFlowFourStepsEditorProps {
  steps: [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
  onChangeStep: (index: number, updated: Partial<SalesFlowStep>) => void;
}

const STEP_ICONS = [MessageSquare, Tag, ShoppingCart, CheckCircle];
const STEP_COLORS = [
  { border: 'border-emerald-200', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', tip: 'Saluda y detecta la necesidad sin presionar.' },
  { border: 'border-blue-200', badge: 'bg-blue-50 text-blue-700 border-blue-200', tip: 'Presenta el producto o servicio con precio oficial.' },
  { border: 'border-amber-200', badge: 'bg-amber-50 text-amber-700 border-amber-200', tip: 'Upsell (bebida/adicional) o 2 opciones de horario.' },
  { border: 'border-purple-200', badge: 'bg-purple-50 text-purple-700 border-purple-200', tip: 'Comanda final, resumen y canalización a WhatsApp.' }
];

export const SalesFlowFourStepsEditor: React.FC<SalesFlowFourStepsEditorProps> = ({
  steps,
  onChangeStep
}) => {
  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#0a1730] flex items-center gap-1.5">
          <span>Embudo de Conversión en 4 Pasos Obligatorios:</span>
        </h4>
        <span className="text-[10.5px] text-[#8391aa]">
          El bot respetará este orden estricto de inicio a fin.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {steps.map((st, idx) => {
          const Icon = STEP_ICONS[idx] || MessageSquare;
          const meta = STEP_COLORS[idx] || STEP_COLORS[0];

          return (
            <div
              key={st.step}
              className={`p-3.5 rounded-xl bg-[#f8fafc] border ${meta.border} space-y-2.5 flex flex-col justify-between shadow-xs`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${meta.badge}`}>
                      Paso {st.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-[#62728d]" />
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => onChangeStep(idx, { title: e.target.value })}
                    className="text-xs font-bold text-[#0a1730] bg-transparent border-b border-transparent hover:border-[#cbd5e1] focus:border-[#0d5bff] focus:outline-none px-1 text-right max-w-[170px] truncate"
                    placeholder="Título del paso"
                  />
                </div>

                <textarea
                  rows={4}
                  value={st.instruction}
                  onChange={(e) => onChangeStep(idx, { instruction: e.target.value })}
                  placeholder={`Instrucción para el Paso ${st.step}...`}
                  className="w-full bg-white border border-[#d8e2f0] rounded-xl p-2.5 text-xs text-[#0a1730] placeholder-[#94a3b8] focus:outline-none focus:border-[#0d5bff] leading-relaxed font-sans resize-none shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[10.5px] text-[#62728d] pt-1.5 border-t border-[#e2e8f0]">
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

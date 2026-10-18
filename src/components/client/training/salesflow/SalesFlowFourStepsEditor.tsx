import React from 'react';
import { SalesFlowStep } from '../salesFlowPresets';
import { MessageSquare, Tag, ShoppingCart, CheckCircle, Lightbulb } from 'lucide-react';

interface SalesFlowFourStepsEditorProps {
  steps: [SalesFlowStep, SalesFlowStep, SalesFlowStep, SalesFlowStep];
  onChangeStep: (index: number, updated: Partial<SalesFlowStep>) => void;
}

const STEP_ICONS = [MessageSquare, Tag, ShoppingCart, CheckCircle];
const STEP_COLORS = [
  { border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', tip: 'Saluda y detecta la necesidad sin presionar.' },
  { border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', tip: 'Presenta el producto o servicio con precio oficial.' },
  { border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', tip: 'Upsell (bebida/adicional) o 2 opciones de horario.' },
  { border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', tip: 'Comanda final, resumen y canalización a WhatsApp.' }
];

export const SalesFlowFourStepsEditor: React.FC<SalesFlowFourStepsEditorProps> = ({
  steps,
  onChangeStep
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <span>Embudo de Conversión en 4 Pasos Obligatorios:</span>
        </h4>
        <span className="text-[10px] text-zinc-400">
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
              className={`p-3.5 rounded-xl bg-[#141313] border ${meta.border} space-y-2.5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${meta.badge}`}>
                      Paso {st.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => onChangeStep(idx, { title: e.target.value })}
                    className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-emerald-500 focus:outline-none px-1 text-right max-w-[170px] truncate"
                    placeholder="Título del paso"
                  />
                </div>

                <textarea
                  rows={4}
                  value={st.instruction}
                  onChange={(e) => onChangeStep(idx, { instruction: e.target.value })}
                  placeholder={`Instrucción para el Paso ${st.step}...`}
                  className="w-full bg-[#181717] border border-[#2a2828] rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans resize-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-1 border-t border-white/5">
                <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{meta.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

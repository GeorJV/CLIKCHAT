import React from 'react';
import { MessageSquareText, Layers, Maximize2, CheckCircle2 } from 'lucide-react';
import { DeliveryMode } from '../../../utils/messageSplitter';

interface MessageDeliveryModeSelectorProps {
  value: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
}

const MODES: { id: DeliveryMode; title: string; subtitle: string; desc: string; icon: React.ElementType }[] = [
  {
    id: 'micro',
    title: 'Mensaje por mensaje',
    subtitle: 'Micro-burbujas',
    desc: 'Divide en mensajes cortos oración por oración, como chatea una persona real en WhatsApp.',
    icon: MessageSquareText
  },
  {
    id: 'interleaved',
    title: 'Mensaje intercalado',
    subtitle: 'Moderado (2 renglones)',
    desc: 'Divide cada 2 renglones y la IA distribuye el contenido en bloques medianos equilibrados.',
    icon: Layers
  },
  {
    id: 'single',
    title: 'Mensaje único',
    subtitle: 'Bloque completo',
    desc: 'Envía toda la respuesta en una sola burbuja tradicional grande.',
    icon: Maximize2
  }
];

export const MessageDeliveryModeSelector: React.FC<MessageDeliveryModeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#42506b] flex items-center gap-1.5">
          <MessageSquareText className="h-3.5 w-3.5 text-[#0d5bff]" /> Tipo de Envío de Mensaje
        </label>
        <span className="text-[10px] font-medium text-[#62728d]">
          Humanización de burbujas en chat
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {MODES.map((mode) => {
          const isSelected = value === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`relative flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#0d5bff] bg-[#f0f5ff] shadow-xs ring-1 ring-[#0d5bff]/40'
                  : 'border-[#d8e2f0] bg-[#f8fafc] hover:border-[#b0c4de] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0d5bff]' : 'text-[#62728d]'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#0a1730]' : 'text-[#42506b]'}`}>
                    {mode.title}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0d5bff] shrink-0" />}
              </div>

              <span className={`text-[10px] font-semibold mb-1 ${isSelected ? 'text-[#0d5bff]' : 'text-[#8391aa]'}`}>
                {mode.subtitle}
              </span>

              <p className="text-[10.5px] leading-relaxed text-[#62728d]">
                {mode.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

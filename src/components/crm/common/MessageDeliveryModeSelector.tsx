import React from 'react';
import { MessageSquareText, Layers, AlignLeft, Maximize2, CheckCircle2 } from 'lucide-react';
import { DeliveryMode } from '../../../utils/messageSplitter';

interface MessageDeliveryModeSelectorProps {
  value: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
  variant?: 'light' | 'dark';
}

const MODES: { id: DeliveryMode; title: string; subtitle: string; desc: string; icon: React.ElementType }[] = [
  {
    id: 'micro',
    title: 'Microburbujas',
    subtitle: 'Oración por oración',
    desc: 'Mensajes breves y directos oración por oración, con ritmo humano.',
    icon: MessageSquareText
  },
  {
    id: 'moderate',
    title: 'Moderado',
    subtitle: '2 renglones',
    desc: 'Bloques de ~2 renglones, ágiles y cómodos sin saturar.',
    icon: Layers
  },
  {
    id: 'intermediate',
    title: 'Intermedio',
    subtitle: 'Bloque mediano',
    desc: 'Ideas consolidadas en párrafos equilibrados de ~30 a 45 palabras.',
    icon: AlignLeft
  },
  {
    id: 'single',
    title: 'Bloque completo',
    subtitle: 'Mensaje único',
    desc: 'Toda la respuesta completa en una sola burbuja unificada.',
    icon: Maximize2
  }
];

export const MessageDeliveryModeSelector: React.FC<MessageDeliveryModeSelectorProps> = ({
  value,
  onChange,
  variant = 'light'
}) => {
  const isDark = variant === 'dark';
  // Normalizar 'interleaved' a 'moderate'
  const normalizedValue = value === 'interleaved' ? 'moderate' : value;

  return (
    <div className="space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-[#42506b]'}`}>
          <MessageSquareText className={`h-3.5 w-3.5 ${isDark ? 'text-emerald-400' : 'text-[#0d5bff]'}`} />
          <span>Formato de Burbujas del Chatbot</span>
        </label>
        <span className={`text-[10px] font-medium ${isDark ? 'text-zinc-500' : 'text-[#62728d]'}`}>
          Humanización visual en WhatsApp y Web
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MODES.map((mode) => {
          const isSelected = normalizedValue === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`relative flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40 text-white shadow-md'
                    : 'border-[#0d5bff] bg-[#f0f5ff] ring-1 ring-[#0d5bff]/40 text-[#0a1730] shadow-xs'
                  : isDark
                    ? 'border-[#292727] bg-[#181717] hover:border-zinc-600 text-zinc-300 hover:bg-[#1f1e1e]'
                    : 'border-[#d8e2f0] bg-[#f8fafc] hover:border-[#b0c4de] hover:bg-white text-[#42506b]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? (isDark ? 'text-emerald-400' : 'text-[#0d5bff]') : (isDark ? 'text-zinc-400' : 'text-[#62728d]')}`} />
                  <span className={`text-xs font-bold ${isSelected ? (isDark ? 'text-white' : 'text-[#0a1730]') : (isDark ? 'text-zinc-300' : 'text-[#42506b]')}`}>
                    {mode.title}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-[#0d5bff]'}`} />}
              </div>

              <span className={`text-[10px] font-semibold mb-1 ${isSelected ? (isDark ? 'text-emerald-400' : 'text-[#0d5bff]') : (isDark ? 'text-zinc-500' : 'text-[#8391aa]')}`}>
                {mode.subtitle}
              </span>

              <p className={`text-[10.5px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#62728d]'}`}>
                {mode.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

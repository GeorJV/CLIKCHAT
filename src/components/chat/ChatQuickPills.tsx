import React from 'react';

interface ChatQuickPillsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const DEFAULT_PROMPTS = [
  { label: '💳 Métodos de Pago', text: '¿Cuáles son los métodos de pago aceptados?' },
  { label: '⌚ Smartwatch Titan Pro', text: 'Háblame del Smartwatch Titan Pro Series 9' },
  { label: '🚚 Envíos Gratis', text: '¿Cuánto tarda el envío y cuánto cuesta?' },
  { label: '🛡️ Garantía Oficial', text: '¿Qué garantía tienen los productos?' },
  { label: '❓ Probar Fallback HITL', text: '¿Hacen envíos a Marte en nave espacial?' }
];

export const ChatQuickPills: React.FC<ChatQuickPillsProps> = ({
  onSelectPrompt,
  disabled = false
}) => {
  return (
    <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto flex space-x-2 scrollbar-none">
      {DEFAULT_PROMPTS.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(p.text)}
          disabled={disabled}
          className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-40"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

import React from 'react';
import { CheckSquare, Square, Trash2 } from 'lucide-react';
import { ExtractedFaq } from '../../../utils/docFaqParser';

interface FaqPreviewItemProps {
  faq: ExtractedFaq;
  index: number;
  onToggle: (idx: number) => void;
  onRemove: (idx: number) => void;
  onChange: (idx: number, field: 'question' | 'answer', value: string) => void;
}

export const FaqPreviewItem: React.FC<FaqPreviewItemProps> = ({
  faq,
  index,
  onToggle,
  onRemove,
  onChange
}) => {
  return (
    <div
      className={`p-3 rounded-xl border transition ${
        faq.selected ? 'onyx-card' : 'bg-[#121111] border-[#222020] opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggle(index)}
          className="mt-0.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
        >
          {faq.selected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-500" />}
        </button>

        <div className="flex-1 space-y-1">
          <input
            type="text"
            value={faq.question}
            onChange={e => onChange(index, 'question', e.target.value)}
            className="w-full bg-[#111010] border border-[#282626] rounded px-2 py-1 text-xs text-white font-bold focus:border-emerald-500"
          />
          <textarea
            rows={2}
            value={faq.answer}
            onChange={e => onChange(index, 'answer', e.target.value)}
            className="w-full bg-[#111010] border border-[#282626] rounded p-2 text-xs text-zinc-300 focus:border-emerald-500"
          />
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
          title="Descartar pregunta"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

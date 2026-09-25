import React, { useState } from 'react';
import { QuickActionOption } from '../../types/productChat';

interface QuickActionButtonsProps {
  actions: QuickActionOption[];
  onSelect: (actionText: string) => void;
  disabled?: boolean;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  actions,
  onSelect,
  disabled = false
}) => {
  const [clickedId, setClickedId] = useState<string | null>(null);

  if (!actions || actions.length === 0) return null;

  const handleClick = (action: QuickActionOption) => {
    if (disabled || clickedId) return;
    setClickedId(action.id);
    onSelect(action.actionText);
  };

  const getVariantStyles = (variant?: string, isClicked?: boolean) => {
    if (isClicked) {
      return 'bg-emerald-600 text-white border-emerald-500 scale-95 opacity-90 shadow-md';
    }
    switch (variant) {
      case 'success':
        return 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 shadow-sm';
      case 'primary':
        return 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-500/40 hover:border-indigo-400 shadow-sm';
      default:
        return 'bg-[#181717] hover:bg-[#222020] text-zinc-300 border-zinc-700/60 hover:border-zinc-500';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-white/[0.08] select-none animate-fade-in">
      {actions.map((act) => {
        const isClicked = clickedId === act.id;
        return (
          <button
            key={act.id}
            type="button"
            onClick={() => handleClick(act)}
            disabled={disabled || (clickedId !== null && !isClicked)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles(
              act.variant,
              isClicked
            )}`}
          >
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};

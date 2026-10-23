import React from 'react';
import { CrmLead } from '../../../types/crm';
import { computeLeadScore } from '../../../utils/leadScoring';
import { Flame, ShieldCheck } from 'lucide-react';

interface VoceroLeadScoreMeterProps {
  lead: CrmLead;
}

export const VoceroLeadScoreMeter: React.FC<VoceroLeadScoreMeterProps> = ({ lead }) => {
  const result = computeLeadScore(lead);

  return (
    <div className="space-y-2 p-3 rounded-xl border border-[#dde5f1] bg-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span className="vocero-kicker text-[#0a1730]">Lead Score & Termómetro</span>
        </div>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${result.badgeBg} ${result.badgeText} ${result.badgeBorder}`}
        >
          <span>{result.emoji}</span>
          <span>{result.label}</span>
        </span>
      </div>

      {/* Barra de progreso / Termómetro */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-mono text-[13px] font-black text-[#0a1730]">
            {result.score} <span className="text-[10px] text-[#8391aa] font-semibold">/ 100 pts</span>
          </span>
          <span className="text-[10.5px] text-[#62728d] font-medium">
            {result.score >= 70 ? 'Listo para cierre' : result.score >= 40 ? 'En nutrición' : 'Por calificar'}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${result.barGradient} transition-all duration-500 ease-out`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Píldoras de Criterios Identificados */}
      {result.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 border-t border-[#edf2f7]">
          {result.reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-0.5 text-[9.5px] font-medium text-[#475569] bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0]"
            >
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

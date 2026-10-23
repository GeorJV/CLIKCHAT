import React from 'react';
import { CrmLead } from '../../../types/crm';
import { computeLeadScore } from '../../../utils/leadScoring';

interface VoceroLeadScorePillProps {
  lead: CrmLead;
  showScore?: boolean;
}

export const VoceroLeadScorePill: React.FC<VoceroLeadScorePillProps> = ({
  lead,
  showScore = true,
}) => {
  const { score, label, emoji, badgeBg, badgeText, badgeBorder } = computeLeadScore(lead);

  return (
    <span
      title={`Lead Score: ${score}/100 (${label})`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border transition ${badgeBg} ${badgeText} ${badgeBorder}`}
    >
      <span>{emoji}</span>
      {showScore && <span>{score}</span>}
    </span>
  );
};

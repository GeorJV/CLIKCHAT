import React from 'react';
import { Sparkles, Gift } from 'lucide-react';

interface SidebarFooterProps {
  isExpanded: boolean;
  isSimpleMode: boolean;
  onSwitchToPro: () => void;
  showToast: (msg: string) => void;
  tenantSlug: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isExpanded,
  isSimpleMode,
  onSwitchToPro,
  showToast,
  tenantSlug
}) => {
  const handleInvite = () => {
    const inviteUrl = `https://clikchat.pages.dev/?ref=${tenantSlug || 'partner'}`;
    navigator.clipboard?.writeText(inviteUrl);
    showToast('🎁 ¡Enlace de invitación copiado al portapapeles!');
  };

  return (
    <div className="space-y-2 pt-2.5 border-t border-[#282626]">
      {/* Promo Card in Modo Simple */}
      {isSimpleMode && isExpanded && (
        <div
          onClick={onSwitchToPro}
          className="bg-[#181717] hover:bg-[#1d1c1c] border border-[#282626] hover:border-[#383535] rounded-xl p-2.5 text-left transition cursor-pointer group shadow-sm"
          title="Haz clic para activar Modo Pro"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-200 group-hover:text-white">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>¿Funnels o Webhooks?</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
            Activa el Modo Pro para analítica avanzada de CRM, embudos y webhooks.
          </p>
        </div>
      )}

      {/* Invita & Gana Button */}
      <button
        type="button"
        onClick={handleInvite}
        title="Invita a un amigo y gana créditos"
        className={`${
          isExpanded ? 'w-full py-2 px-3 space-x-1.5 rounded-xl' : 'w-8 h-8 p-0 mx-auto rounded-lg'
        } flex items-center justify-center border border-[#282626] bg-[#181717] hover:bg-[#1e1d1d] hover:border-amber-500/40 text-amber-300 text-xs font-bold transition shadow-sm cursor-pointer active:scale-95`}
      >
        <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        {isExpanded && <span>Invita & Gana</span>}
      </button>
    </div>
  );
};

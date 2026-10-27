import React, { useState, useEffect } from 'react';

interface Props {
  agentName?: string;
  storeName?: string;
  serviceTitle?: string;
}

export const ServiceChatLoadingBubble: React.FC<Props> = ({
  agentName,
  storeName,
  serviceTitle,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const advisor = agentName ? agentName.trim() : 'Asesor';
  const business = storeName ? storeName.trim() : 'el negocio';

  const phases = [
    `${advisor} está escribiendo...`,
    `Analizando tu consulta para ${business}...`,
    `Preparando la mejor asesoría en ${serviceTitle || 'servicios'}...`,
    `${advisor} está redactando tu respuesta...`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [phases.length]);

  return (
    <div className="flex items-start justify-start animate-fade-in mt-1.5" role="status" aria-live="polite">
      <div className="bg-[#1e1d1d] border border-white/[0.12] rounded-2xl rounded-bl-sm px-3.5 py-2 flex items-center gap-2 shadow-md shadow-black/40">
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
        </div>
        <span className="text-xs text-zinc-300 font-medium transition-all duration-300 ease-in-out select-none">
          {phases[phaseIndex]}
        </span>
      </div>
    </div>
  );
};

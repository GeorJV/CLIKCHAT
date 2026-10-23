import React from 'react';
import { ShoppingBag, UserCog, Bot, QrCode, CheckCircle2 } from 'lucide-react';

export type OnboardingStepId = 'catalog' | 'personality' | 'simulator' | 'qr';

interface OnboardingStepperProps {
  currentStep: OnboardingStepId;
  onSelectStep: (step: OnboardingStepId) => void;
  isService?: boolean;
  hasCatalog: boolean;
  hasPersonality: boolean;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
  onSelectStep,
  isService = false,
  hasCatalog,
  hasPersonality
}) => {
  const steps: Array<{ id: OnboardingStepId; label: string; icon: React.ComponentType<{ className?: string }>; done: boolean }> = [
    {
      id: 'catalog',
      label: isService ? '1. Servicios & Tarifas' : '1. Menú / Catálogo',
      icon: ShoppingBag,
      done: hasCatalog
    },
    {
      id: 'personality',
      label: '2. Personalidad & Cierre',
      icon: UserCog,
      done: hasPersonality
    },
    {
      id: 'simulator',
      label: '3. Simulador en Vivo',
      icon: Bot,
      done: false
    },
    {
      id: 'qr',
      label: '4. Link & QR de Campaña',
      icon: QrCode,
      done: false
    }
  ];

  return (
    <div className="bg-[#161515] border border-[#262424] p-3 rounded-2xl mb-4">
      <div className="flex items-center justify-between gap-1 overflow-x-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          return (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => onSelectStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                    : s.done
                    ? 'bg-[#1b1a1a] text-emerald-400 border-emerald-500/30 hover:bg-[#222121]'
                    : 'bg-[#131212] text-zinc-400 border-[#282626] hover:text-white hover:bg-[#1a1919]'
                }`}
              >
                {s.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                )}
                <span>{s.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block w-4 h-[1px] bg-[#2a2828] shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

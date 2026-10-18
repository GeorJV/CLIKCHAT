import React, { useState } from 'react';
import { Tenant } from '../../../types';
import { ClientTab } from '../../../types/client';
import {
  Store, ShoppingBag, Brain, MessageCircle,
  CheckCircle2, Circle, ArrowRight, Sparkles, ChevronDown, ChevronUp, Bot, ExternalLink
} from 'lucide-react';

interface AgentSetupFlowHeroProps {
  tenant: Tenant | null;
  productCount: number;
  onNavigateTab: (tab: ClientTab) => void;
  onOpenLiveChat?: () => void;
}

export const AgentSetupFlowHero: React.FC<AgentSetupFlowHeroProps> = ({
  tenant,
  productCount,
  onNavigateTab,
  onOpenLiveChat
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clikchat_hide_setup_hero') === 'true';
    }
    return false;
  });

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clikchat_hide_setup_hero', String(next));
    }
  };

  const isStep1Done = Boolean(tenant?.name && tenant?.business_type);
  const isStep2Done = productCount > 0;
  const isStep3Done = Boolean(tenant?.sales_flow_rules && tenant?.sales_flow_rules.includes('PASO 1'));

  const stepsCompleted = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0);
  const progressPercent = Math.round((stepsCompleted / 3) * 100);

  const steps = [
    {
      num: 1,
      title: 'Identidad & Modalidad',
      subtitle: isStep1Done ? (tenant?.name || 'Configurado') : 'Nombre, logo y qué vendes',
      isDone: isStep1Done,
      icon: Store,
      tab: 'business' as ClientTab,
      btnText: isStep1Done ? 'Revisar' : 'Iniciar'
    },
    {
      num: 2,
      title: tenant?.business_type === 'servicios' ? 'Tus Servicios' : 'Catálogo o Menú',
      subtitle: isStep2Done ? `${productCount} ítems listos` : 'Fotos, precios y extras',
      isDone: isStep2Done,
      icon: ShoppingBag,
      tab: 'products' as ClientTab,
      btnText: isStep2Done ? 'Gestionar' : 'Cargar'
    },
    {
      num: 3,
      title: 'Flujo de Venta en 4 Pasos',
      subtitle: isStep3Done ? 'Embudo secuencial activo' : 'Pautas de saludo y comanda',
      isDone: isStep3Done,
      icon: Brain,
      tab: 'training' as ClientTab,
      btnText: isStep3Done ? 'Calibrado' : 'Afinar'
    },
    {
      num: 4,
      title: 'Probar Bot & WhatsApp',
      subtitle: 'Simulador en vivo y link público',
      isDone: stepsCompleted >= 2,
      icon: MessageCircle,
      tab: 'whatsapp' as ClientTab,
      btnText: 'Probar',
      isFinalAction: true
    }
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#181717] via-[#121111] to-[#121111] border border-emerald-500/30 p-4 sm:p-5 shadow-2xl space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/10">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                Flujo de Activación Rápida de tu Asistente
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {progressPercent}% Listo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sigue estos 4 pasos en orden para poner a vender a tu bot en menos de 5 minutos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleCollapse}
          className="self-end sm:self-auto flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
        >
          <span>{isCollapsed ? 'Ver Pasos de Configuración' : 'Plegar Guía'}</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full h-2 bg-[#201f1f] rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/50"
          style={{ width: `${Math.max(10, progressPercent)}%` }}
        />
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = st.isDone;

            return (
              <div
                key={st.num}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-200 group relative ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#151414] border-[#292828] hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase border ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      Paso {st.num}
                    </span>

                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1e1d1d] border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5 group-hover:text-emerald-400 transition">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition leading-snug">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight line-clamp-1">
                        {st.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${
                    isCompleted ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {isCompleted ? '✓ Completado' : 'Pendiente'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (st.isFinalAction && onOpenLiveChat) {
                        onOpenLiveChat();
                      } else {
                        onNavigateTab(st.tab);
                      }
                    }}
                    className={`text-[11px] font-bold flex items-center gap-1 transition cursor-pointer px-2 py-1 rounded-md ${
                      isCompleted
                        ? 'text-zinc-300 hover:text-white hover:bg-white/5'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <span>{st.btnText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

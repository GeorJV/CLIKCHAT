import React, { useState } from 'react';
import { Tenant } from '../../../types';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';

interface BusinessOnboardingChecklistProps {
  tenant: Tenant | null;
  onOpenLiveChat?: () => void;
}

export const BusinessOnboardingChecklist: React.FC<BusinessOnboardingChecklistProps> = ({
  tenant,
  onOpenLiveChat
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clikchat_hide_onboarding') === 'true';
    }
    return false;
  });

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clikchat_hide_onboarding', String(next));
    }
  };

  const steps = [
    {
      id: 'step1',
      title: '1. Tipo de Negocio & Nombre',
      desc: 'Define si vendes productos/comida, servicios o soporte.',
      isDone: Boolean(tenant?.name && tenant?.business_type)
    },
    {
      id: 'step2',
      title: '2. Mensaje de Bienvenida & Tono',
      desc: 'Personaliza cómo saluda y habla tu asistente comercial.',
      isDone: Boolean(tenant?.welcome_message && tenant?.tone_of_voice)
    },
    {
      id: 'step3',
      title: '3. Flujo de Venta en 4 Pasos',
      desc: 'Embudo secuencial para asesorar, hacer upsell y cerrar.',
      isDone: Boolean(tenant?.sales_flow_rules && tenant?.sales_flow_rules.includes('PASO 1'))
    },
    {
      id: 'step4',
      title: '4. Probar en Simulador en Vivo',
      desc: 'Chatea con tu propio bot y corrige respuestas en 1 clic.',
      isDone: false, // Activo como llamada a la acción
      isAction: true
    }
  ];

  const doneCount = steps.filter(s => s.isDone).length;
  const progressPercent = Math.round((doneCount / (steps.length - 1)) * 100);

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#141313] to-[#141313] border border-emerald-500/20 space-y-3 font-sans shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Guía de Activación de tu Perfil Comercial</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {progressPercent}% Completado
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Sigue estos 4 pasos guiados para tener tu bot listo y vendiendo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleCollapse}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
          title={collapsed ? 'Ver pasos' : 'Plegar guía'}
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-[#201f1f] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(15, progressPercent))}%` }}
        />
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {steps.map((st) => (
            <div
              key={st.id}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition ${
                st.isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
                  : 'bg-[#181717] border-[#2a2828] text-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {st.isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  )}
                  <span className={`text-[11px] font-bold truncate ${st.isDone ? 'text-white' : 'text-zinc-300'}`}>
                    {st.title}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug line-clamp-2">
                  {st.desc}
                </p>
              </div>

              {st.isAction && onOpenLiveChat && (
                <button
                  type="button"
                  onClick={onOpenLiveChat}
                  className="mt-2 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Probar Chat en Vivo</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

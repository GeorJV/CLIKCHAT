import React, { useState } from 'react';
import { Tenant, Product, FAQ } from '../../../types';
import { VoceroNavTab } from '../VoceroAppNav';
import {
  ListChecks, Store, ShoppingBag, UserCog, MessageSquare,
  CheckCircle2, Circle, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { VoceroAiInterviewModal } from './VoceroAiInterviewModal';

interface VoceroOnboardingViewProps {
  tenant: Tenant | null;
  products: Product[];
  faqs: FAQ[];
  onNavigateTab: (tab: VoceroNavTab, subPath?: string) => void;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
  onCreateProduct?: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroOnboardingView: React.FC<VoceroOnboardingViewProps> = ({
  tenant,
  products,
  faqs,
  onNavigateTab,
  onUpdateSettings,
  onCreateProduct,
  onCreateFaq
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const isStep1Done = Boolean(tenant?.name && tenant?.business_type);
  const isStep2Done = products.length > 0;
  const isStep3Done = Boolean(tenant?.bot_name && tenant?.welcome_message && (tenant?.system_prompt || tenant?.sales_flow_rules));
  const isStep4Done = Boolean(tenant?.phone);
  const completedCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  const STEPS = [
    {
      num: 1, title: 'Perfil & Modalidad del Negocio', isDone: isStep1Done, icon: Store,
      desc: isStep1Done ? `Configurado como "${tenant?.name}" (${tenant?.business_type})` : 'Define nombre, teléfono, horarios y si vendes productos o servicios.',
      targetTab: 'settings' as VoceroNavTab, targetSubPath: 'perfil', btnLabel: isStep1Done ? 'Revisar Perfil' : 'Configurar Perfil'
    },
    {
      num: 2, title: 'Catálogo de Productos o Menú', isDone: isStep2Done, icon: ShoppingBag,
      desc: isStep2Done ? `${products.length} productos/servicios cargados y listos.` : 'Agrega tus productos o servicios con precios y fotos para que la IA cotice.',
      targetTab: 'products' as VoceroNavTab, targetSubPath: 'productos', btnLabel: isStep2Done ? 'Gestionar Ítems' : 'Cargar Productos'
    },
    {
      num: 3, title: 'Entrenamiento del Agente (4 Pasos)', isDone: isStep3Done, icon: UserCog,
      desc: isStep3Done ? `Configurado como "${tenant?.bot_name || 'Agente'}" con identidad activa.` : 'Configura los 4 pasos: Nombre, Tono, Mensaje de bienvenida y System Prompt.',
      targetTab: 'agent' as VoceroNavTab, targetSubPath: 'agente', btnLabel: isStep3Done ? 'Afinar Agente' : 'Entrenar Agente'
    },
    {
      num: 4, title: 'Conectar Canales (WhatsApp & ClikChat)', isDone: isStep4Done, icon: MessageSquare,
      desc: isStep4Done ? 'Canales de mensajería vinculados.' : 'Conecta tu WhatsApp Cloud API o activa el Chat Agente ClikChat nativo sin API.',
      targetTab: 'settings' as VoceroNavTab, targetSubPath: 'canales', btnLabel: isStep4Done ? 'Ver Canales' : 'Conectar Canales'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Guía de Inicio Rápido</h2>
          <span className="vocero-kicker ml-2">Activación en 4 Pasos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0a1730]">{progressPercent}% Completado</span>
          <div className="w-24 h-2 bg-[#e8edf6] rounded-full overflow-hidden">
            <div className="h-full bg-[#0d5bff] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-4">
        {/* Banner Hero de Entrevista con IA */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0d5bff]/10 text-[#0d5bff] text-[10.5px] font-bold">
              <Sparkles className="w-3 h-3" /> Configuración Express Inteligente
            </div>
            <h3 className="text-base font-bold text-[#0a1730]">¿Prefieres que la IA configure todo por ti?</h3>
            <p className="text-xs text-[#62728d] max-w-xl">
              Nuestro asistente de configuración inteligente te hace 4 preguntas breves y autocompleta tu perfil, catálogo y respuestas en 2 minutos.
            </p>
          </div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Iniciar Entrevista IA</span>
          </button>
        </div>

        <div className="rounded-2xl border border-[#d8e2f0] bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-[#0a1730] mb-1">Guía Manual en 4 Pasos</h3>
          <p className="text-xs text-[#62728d]">
            O si prefieres, configura cada sección manualmente paso a paso a continuación.
          </p>
        </div>

        <div className="space-y-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`rounded-2xl border p-4 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  s.isDone ? 'border-[#d7eede] bg-white' : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
                    s.isDone ? 'bg-[#10b981]' : 'bg-[#0d5bff]'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8391aa]">PASO {s.num}</span>
                      <h4 className="text-sm font-bold text-[#0a1730]">{s.title}</h4>
                      {s.isDone && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#10b981] bg-[#eaf7ef] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Completado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#62728d] mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab(s.targetTab, s.targetSubPath)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer shrink-0 ${
                    s.isDone
                      ? 'border border-[#d8e2f0] bg-[#f8fafc] text-[#0a1730] hover:bg-[#edf2f9]'
                      : 'bg-[#0d5bff] text-white hover:bg-[#0047e1] shadow-sm'
                  }`}
                >
                  <span>{s.btnLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <VoceroAiInterviewModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        tenant={tenant}
        onUpdateSettings={onUpdateSettings}
        onCreateProduct={onCreateProduct}
        onCreateFaq={onCreateFaq}
      />
    </div>
  );
};

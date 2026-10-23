import React, { useState } from 'react';
import { Tenant, FAQ } from '../../../types';
import { TrendingUp, ShieldCheck, ShieldAlert, FileText, UserCog, Target, ArrowRight } from 'lucide-react';
import { VoceroAgentIdentitySection } from './VoceroAgentIdentitySection';
import { VoceroCommercialObjectivesSection } from './VoceroCommercialObjectivesSection';
import { SalesFlowSection } from '../../client/training/SalesFlowSection';
import { ObjectionsManagerSection } from '../../client/training/objections/ObjectionsManagerSection';
import { OperationalRulesSection } from '../../client/training/OperationalRulesSection';
import { DocumentsManagerTab } from '../../client/DocumentsManagerTab';

interface VoceroAgentViewProps {
  tenant: Tenant | null;
  tenantSlug: string;
  faqs: FAQ[];
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onDeleteFaq: (id: string) => Promise<boolean>;
  onSwitchToLab?: () => void;
}

export const VoceroAgentView: React.FC<VoceroAgentViewProps> = ({
  tenant, tenantSlug, faqs, onUpdateSettings, onCreateFaq, onUpdateFaq, onDeleteFaq
}) => {
  const [subTab, setSubTab] = useState<'identidad' | 'flujo' | 'objeciones' | 'reglas' | 'docs' | 'objetivos'>('identidad');

  const TABS = [
    { id: 'identidad' as const, label: '1. Identidad & Tono', icon: UserCog, desc: 'Nombre, saludo inicial y bienvenida del bot' },
    { id: 'flujo' as const, label: '2. Flow IQ (Venta)', icon: TrendingUp, desc: 'Estrategia comercial y flujo persuasivo en 4 pasos' },
    { id: 'objeciones' as const, label: '3. FAQ IQ (Dudas)', icon: ShieldCheck, badge: faqs.length, desc: 'Respuestas exactas a objeciones y preguntas frecuentes' },
    { id: 'reglas' as const, label: '4. Reglas de Seguridad', icon: ShieldAlert, desc: 'Restricciones estrictas para evitar alucinaciones' },
    { id: 'docs' as const, label: '5. Documentos RAG', icon: FileText, desc: 'Manuales y archivos PDF indexados para consulta' },
    { id: 'objetivos' as const, label: '6. Metas', icon: Target, desc: 'Objetivos comerciales y métricas clave' },
  ];

  const currentTabInfo = TABS.find(t => t.id === subTab) || TABS[0];
  const currentIndex = TABS.findIndex(t => t.id === subTab);

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      {/* Header Vocero con Sub-tabs Ordenadas y Numeradas */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <UserCog className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1730]">Cerebro del Asistente</h2>
          <span className="vocero-kicker ml-1 hidden md:inline">Entrenamiento en 6 Fases</span>
        </div>

        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl overflow-x-auto [scrollbar-width:none]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  active ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-0.5 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Sub-barra de Guía y Contexto del Paso Actual */}
      <div className="bg-[#ebf1ff]/80 border-b border-[#d8e2f0] px-6 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 bg-[#0d5bff] text-white rounded font-mono text-[10px] font-bold uppercase">
            Fase {currentIndex + 1} de 6
          </span>
          <p className="text-xs text-[#0a1730] truncate">
            <strong className="text-[#0d5bff] font-bold">{currentTabInfo.label}:</strong> {currentTabInfo.desc}
          </p>
        </div>

        {currentIndex < TABS.length - 1 && (
          <button
            type="button"
            onClick={() => setSubTab(TABS[currentIndex + 1].id)}
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#0d5bff] hover:underline cursor-pointer shrink-0 ml-3"
          >
            <span>Siguiente Fase: {TABS[currentIndex + 1].label.split(' ')[1]}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Contenedor Principal */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto">
        {subTab === 'identidad' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
            <VoceroAgentIdentitySection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}

        {subTab === 'flujo' && (
          <SalesFlowSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
        )}

        {subTab === 'objeciones' && (
          <ObjectionsManagerSection
            tenant={tenant} faqs={faqs} onCreateFaq={onCreateFaq}
            onUpdateFaq={onUpdateFaq} onDeleteFaq={onDeleteFaq}
          />
        )}

        {subTab === 'reglas' && (
          <OperationalRulesSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
        )}

        {subTab === 'docs' && (
          <DocumentsManagerTab tenantId={tenant?.id} />
        )}

        {subTab === 'objetivos' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
            <VoceroCommercialObjectivesSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}
      </main>
    </div>
  );
};

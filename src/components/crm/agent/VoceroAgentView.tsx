import React, { useState } from 'react';
import { Tenant, FAQ } from '../../../types';
import { TrendingUp, ShieldCheck, ShieldAlert, FileText, UserCog, Target } from 'lucide-react';
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
  tenant,
  tenantSlug,
  faqs,
  onUpdateSettings,
  onCreateFaq,
  onUpdateFaq,
  onDeleteFaq,
}) => {
  const [subTab, setSubTab] = useState<'identidad' | 'objetivos' | 'flujo' | 'objeciones' | 'reglas' | 'docs'>('identidad');

  const TABS = [
    { id: 'identidad' as const, label: 'Identidad (4 Pasos)', icon: UserCog },
    { id: 'objetivos' as const, label: 'Objetivos Comerciales', icon: Target },
    { id: 'flujo' as const, label: 'Flow IQ (Flujos)', icon: TrendingUp },
    { id: 'objeciones' as const, label: 'FAQ IQ & Objeciones', icon: ShieldCheck, badge: faqs.length },
    { id: 'reglas' as const, label: 'Reglas Operativas', icon: ShieldAlert },
    { id: 'docs' as const, label: 'Documentos RAG', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      {/* Header Vocero */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Entrenamiento del Agente</h2>
          <span className="vocero-kicker ml-2">Inteligencia Comercial</span>
        </div>

        {/* Sub-tabs tipo píldora Vocero */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-white text-[#0d5bff] shadow-xs'
                    : 'text-[#62728d] hover:text-[#0a1730]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto">
        {subTab === 'identidad' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <VoceroAgentIdentitySection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}

        {subTab === 'objetivos' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <VoceroCommercialObjectivesSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}

        {subTab === 'flujo' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <SalesFlowSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}

        {subTab === 'objeciones' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <ObjectionsManagerSection
              tenant={tenant}
              faqs={faqs}
              onCreateFaq={onCreateFaq}
              onUpdateFaq={onUpdateFaq}
              onDeleteFaq={onDeleteFaq}
            />
          </div>
        )}

        {subTab === 'reglas' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <OperationalRulesSection tenant={tenant} onUpdateSettings={onUpdateSettings} />
          </div>
        )}

        {subTab === 'docs' && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
            <DocumentsManagerTab tenantId={tenant?.id} />
          </div>
        )}
      </main>
    </div>
  );
};

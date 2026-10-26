import React, { useState } from 'react';
import { UnresolvedQueriesTab } from '../UnresolvedQueriesTab';
import { DocumentsManagerTab } from '../DocumentsManagerTab';
import { InitialGreetingSection } from './InitialGreetingSection';
import { OperationalRulesSection } from './OperationalRulesSection';
import { SalesFlowSection } from './SalesFlowSection';
import { ObjectionsManagerSection } from './objections/ObjectionsManagerSection';
import { LiveBotSimulator } from './simulator/LiveBotSimulator';
import { UnresolvedQuery, Tenant, FAQ } from '../../../types';
import { HelpCircle, FileText, MessageSquare, ShieldAlert, TrendingUp, ShieldCheck, UserCog } from 'lucide-react';

interface AITrainingTabProps {
  tenantId?: string;
  tenant?: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
  unresolved: UnresolvedQuery[];
  onResolve: (id: string, answerOrPayload: any, category?: string) => Promise<boolean>;
  faqs?: FAQ[];
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onDeleteFaq?: (id: string) => Promise<boolean>;
  tenantSlug?: string;
}

export const AITrainingTab: React.FC<AITrainingTabProps> = ({
  tenantId,
  tenant,
  onUpdateSettings,
  unresolved,
  onResolve,
  faqs = [],
  onCreateFaq = async () => false,
  onUpdateFaq,
  onDeleteFaq = async () => false,
  tenantSlug = ''
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'objections' | 'simulator' | 'unresolved' | 'documents' | 'greeting' | 'rules' | 'sales_flow'>('objections');
  const [simTrigger, setSimTrigger] = useState('');
  const pendingCount = unresolved.filter(u => u.status === 'pending').length;

  const handleTestInSimulator = (trigger: string) => {
    setSimTrigger(trigger);
    setActiveSubTab('simulator');
  };

  return (
    <div className="space-y-4 max-w-5xl text-slate-100 font-sans">
      {/* Encabezado y Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-400" />
            <span>Entrenamiento AI & Calibración</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manejador de objeciones (Nivel 2), simulador con corrección 1-clic y afinamiento comercial.
          </p>
        </div>

        {/* Sub-tabs Tipo Píldora */}
        <div className="flex items-center gap-1.5 bg-[#121111] p-1 rounded-xl border border-[#262424] shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab('objections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'objections'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>🛡️ Objeciones (Q&A)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>💬 Simulador en Vivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('unresolved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'unresolved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dudas</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'documents'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manuales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('greeting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'greeting'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Saludo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'rules'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reglas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sales_flow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'sales_flow'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>🎯 4 Pasos (Ventas)</span>
          </button>
        </div>
      </div>

      {/* Vista Dinámica */}
      {activeSubTab === 'objections' && (
        <ObjectionsManagerSection
          tenant={tenant || null}
          faqs={faqs}
          onCreateFaq={onCreateFaq}
          onUpdateFaq={onUpdateFaq}
          onDeleteFaq={onDeleteFaq}
          onTestInSimulator={handleTestInSimulator}
        />
      )}
      {activeSubTab === 'simulator' && (
        <LiveBotSimulator
          tenant={tenant || null}
          tenantSlug={tenantSlug}
          faqs={faqs}
          onCreateFaq={onCreateFaq}
          initialTrigger={simTrigger}
        />
      )}
      {activeSubTab === 'unresolved' && (
        <UnresolvedQueriesTab unresolved={unresolved} onResolve={onResolve} />
      )}
      {activeSubTab === 'documents' && (
        <DocumentsManagerTab tenantId={tenantId} />
      )}
      {activeSubTab === 'greeting' && (
        <InitialGreetingSection tenant={tenant || null} onUpdateSettings={onUpdateSettings} />
      )}
      {activeSubTab === 'rules' && (
        <OperationalRulesSection tenant={tenant || null} onUpdateSettings={onUpdateSettings} />
      )}
      {activeSubTab === 'sales_flow' && (
        <SalesFlowSection tenant={tenant || null} onUpdateSettings={onUpdateSettings} />
      )}
    </div>
  );
};

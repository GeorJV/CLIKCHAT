import React, { useState } from 'react';
import { UnresolvedQueriesTab } from '../UnresolvedQueriesTab';
import { DocumentsManagerTab } from '../DocumentsManagerTab';
import { InitialGreetingSection } from './InitialGreetingSection';
import { OperationalRulesSection } from './OperationalRulesSection';
import { UnresolvedQuery, Tenant } from '../../../types';
import { Brain, HelpCircle, FileText, Sparkles, ShieldAlert } from 'lucide-react';

interface AITrainingTabProps {
  tenantId?: string;
  tenant?: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
  unresolved: UnresolvedQuery[];
  onResolve: (id: string, payload: { answer: string; category?: string; autoInjectToFaq: boolean }) => Promise<boolean>;
}

export const AITrainingTab: React.FC<AITrainingTabProps> = ({
  tenantId,
  tenant,
  onUpdateSettings,
  unresolved,
  onResolve
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'unresolved' | 'documents' | 'greeting' | 'rules'>('unresolved');
  const pendingCount = unresolved.filter(u => u.status === 'pending').length;

  return (
    <div className="space-y-4 max-w-5xl text-slate-100 font-sans">
      {/* Encabezado y Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span>Entrenamiento AI</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Entrena el cerebro del bot respondiendo dudas reales, cargando manuales, saludo inicial y reglas estrictas.
          </p>
        </div>

        {/* Sub-tabs Tipo Píldora */}
        <div className="flex items-center gap-1.5 bg-[#121111] p-1 rounded-xl border border-[#262424] shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab('unresolved')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'unresolved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dudas Pendientes</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSubTab === 'unresolved' ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('documents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'documents'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documentos & Manuales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('greeting')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'greeting'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saludo Inicial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === 'rules'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reglas de Operación</span>
          </button>
        </div>
      </div>

      {/* Vista Dinámica */}
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
    </div>
  );
};

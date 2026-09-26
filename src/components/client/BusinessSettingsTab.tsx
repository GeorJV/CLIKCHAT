import React, { useState } from 'react';
import { Tenant, FAQ } from '../../types';
import { BusinessIdentitySubTab } from './business/BusinessIdentitySubTab';
import { ChatCadenceSettingCard } from './business/ChatCadenceSettingCard';
import { CustomAISettingsCard } from './business/CustomAISettingsCard';
import { FaqsManagerTab } from './FaqsManagerTab';
import { Store, HelpCircle, Clock, Sparkles } from 'lucide-react';

interface BusinessSettingsTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
  onOpenLiveChat?: () => void;
  faqs?: FAQ[];
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
  onDeleteFaq?: (id: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onCreateBulkFaqs?: (faqs: Array<{ question: string; answer: string; category?: string }>, source?: string) => Promise<boolean>;
  initialSubTab?: 'identity' | 'ai' | 'cadence' | 'faqs';
}

export const BusinessSettingsTab: React.FC<BusinessSettingsTabProps> = ({
  tenant,
  tenantSlug,
  onUpdateSettings,
  saveSuccess,
  onOpenLiveChat,
  faqs = [],
  onCreateFaq,
  onDeleteFaq,
  onUpdateFaq,
  onCreateBulkFaqs,
  initialSubTab = 'identity'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'identity' | 'ai' | 'cadence' | 'faqs'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clikchat_business_subtab');
      if (saved === 'identity' || saved === 'ai' || saved === 'cadence' || saved === 'faqs') {
        return saved;
      }
    }
    return initialSubTab;
  });

  const handleSelectSubTab = (tab: 'identity' | 'ai' | 'cadence' | 'faqs') => {
    setActiveSubTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clikchat_business_subtab', tab);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            <span>Mi Negocio & Configuración IA</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configura identidad, FAQs y cadencia de respuesta humana o inmediata del chatbot.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#121111] p-1 rounded-xl border border-[#262424] shrink-0 flex-wrap">
          <button
            type="button" onClick={() => handleSelectSubTab('identity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'identity' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Identidad</span>
          </button>

          <button
            type="button" onClick={() => handleSelectSubTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'ai' ? 'bg-purple-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor IA</span>
          </button>

          <button
            type="button" onClick={() => handleSelectSubTab('cadence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'cadence' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Cadencia & Velocidad</span>
          </button>

          <button
            type="button" onClick={() => handleSelectSubTab('faqs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'faqs' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs</span>
            {faqs.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSubTab === 'faqs' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {faqs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'identity' && (
        <BusinessIdentitySubTab
          tenant={tenant} tenantSlug={tenantSlug} onUpdateSettings={onUpdateSettings}
          saveSuccess={saveSuccess} onOpenLiveChat={onOpenLiveChat}
        />
      )}
      {activeSubTab === 'ai' && (
        <CustomAISettingsCard tenant={tenant} onUpdateSettings={onUpdateSettings} saveSuccess={saveSuccess} />
      )}
      {activeSubTab === 'cadence' && (
        <ChatCadenceSettingCard tenant={tenant} onUpdateSettings={onUpdateSettings} saveSuccess={saveSuccess} />
      )}
      {activeSubTab === 'faqs' && (
        <FaqsManagerTab
          faqs={faqs} onCreateFaq={onCreateFaq || (async () => false)}
          onDeleteFaq={onDeleteFaq || (async () => false)} onUpdateFaq={onUpdateFaq} onCreateBulkFaqs={onCreateBulkFaqs}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { CrmLead, CrmMessage } from '../../../types/crm';
import { Tenant } from '../../../types';
import { MessageSquareCode, Link2, Settings2, Sparkles, ExternalLink } from 'lucide-react';
import { ClikChatConversationsView } from './ClikChatConversationsView';
import { ClikChatLinksAndTemplates } from './ClikChatLinksAndTemplates';
import { ClikChatConfigPanel } from './ClikChatConfigPanel';
import { ClikChatAttributionSimulator } from './ClikChatAttributionSimulator';

interface Props {
  tenant: Tenant | null;
  tenantSlug: string;
  leads: CrmLead[];
  selectedLead: CrmLead | null;
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  messages: CrmMessage[];
  onToggleTakeover: (leadId: string, paused: boolean) => void;
  onSendMessage: (sessionId: string, text: string) => void;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroClikChatView: React.FC<Props> = ({
  tenant,
  tenantSlug,
  leads,
  selectedLead,
  selectedLeadId,
  onSelectLead,
  messages,
  onToggleTakeover,
  onSendMessage,
  onUpdateSettings
}) => {
  const [subTab, setSubTab] = useState<'chats' | 'links' | 'config' | 'simulator'>('chats');
  const liveChatUrl = `https://clikchat.pages.dev/chat/${tenantSlug}`;

  const TABS = [
    { id: 'chats' as const, label: 'Bandeja & Atribución', icon: MessageSquareCode, badge: leads.filter(l => l.channel === 'web' || l.channel === 'clikchat').length },
    { id: 'links' as const, label: 'Enlaces & Plantillas No-Code', icon: Link2 },
    { id: 'config' as const, label: 'Ajustes Web', icon: Settings2 },
    { id: 'simulator' as const, label: 'Simulador de Origen', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d5bff] text-white font-mono font-black text-xs shadow-xs">
            CK
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-[#0a1730]">Canal Propio ClikChat</h2>
            <span className="vocero-kicker">Agente Web con Atribución de Tráfico</span>
          </div>
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
                  active ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
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

        <a
          href={liveChatUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] text-xs font-semibold text-[#0a1730] hover:bg-[#edf2f9] transition"
        >
          <span>Abrir Chat Web</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#8391aa]" />
        </a>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-5 max-w-6xl w-full mx-auto">
        {subTab === 'chats' && (
          <ClikChatConversationsView
            leads={leads}
            selectedLead={selectedLead}
            selectedLeadId={selectedLeadId}
            onSelectLead={onSelectLead}
            messages={messages}
            onToggleTakeover={onToggleTakeover}
            onSendMessage={onSendMessage}
          />
        )}

        {subTab === 'links' && (
          <ClikChatLinksAndTemplates tenantSlug={tenantSlug} storeName={tenant?.name} />
        )}

        {subTab === 'config' && (
          <ClikChatConfigPanel tenant={tenant} onUpdateSettings={onUpdateSettings} />
        )}

        {subTab === 'simulator' && (
          <ClikChatAttributionSimulator tenantSlug={tenantSlug} storeName={tenant?.name} />
        )}
      </main>
    </div>
  );
};

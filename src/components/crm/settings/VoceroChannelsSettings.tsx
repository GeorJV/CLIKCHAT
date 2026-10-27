import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { WhatsAppCredentialsModal } from '../../client/whatsapp/WhatsAppCredentialsModal';
import { WhatsAppTestChatModal } from '../../client/whatsapp/WhatsAppTestChatModal';
import { VoceroClikChatChannelCard } from './VoceroClikChatChannelCard';
import { VoceroMetaChannelsGrid } from './VoceroMetaChannelsGrid';
import { MessageSquare, Copy, Check, KeyRound, Play } from 'lucide-react';

interface VoceroChannelsSettingsProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroChannelsSettings: React.FC<VoceroChannelsSettingsProps> = ({
  tenant,
  tenantSlug,
  onUpdateSettings
}) => {
  const effectiveSlug = tenantSlug || tenant?.slug || 'mi-negocio';

  const host = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://clikchatcrm.pages.dev';

  const [config, setConfig] = useState<WhatsAppConfig>({
    phone_number_id: '',
    business_phone: '',
    verify_token: `clikchat_wa_${effectiveSlug}`,
    access_token: '',
    status: 'disconnected',
    webhook_url: `${host}/api/whatsapp/webhook?tenant=${effectiveSlug}`
  });
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/whatsapp/config?tenantSlug=${effectiveSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.config) {
            setConfig(prev => ({
              ...prev,
              ...data.config,
              webhook_url: `${host}/api/whatsapp/webhook?tenant=${effectiveSlug}`
            }));
          }
        }
      } catch (e) {
        console.warn('Error loading whatsapp config:', e);
      }
    }
    load();
  }, [effectiveSlug, host]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = async (newConfig: Partial<WhatsAppConfig>) => {
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug: effectiveSlug, ...newConfig })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(prev => ({ ...prev, ...newConfig }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Chat Agente ClikChat (Nativo Interno • Sin API) */}
      <VoceroClikChatChannelCard
        tenantSlug={effectiveSlug}
        tenant={tenant}
        onUpdateSettings={onUpdateSettings}
      />

      {/* 2. WhatsApp Cloud API Oficial */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0a1730]">WhatsApp Business Cloud API (Meta Oficial)</h3>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-2xs ${
                  config.status === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${config.status === 'connected' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  {config.status === 'connected' ? 'Conectado en Vivo' : 'Pendiente de Credenciales'}
                </span>
              </div>
              <p className="text-xs text-[#62728d] mt-0.5">Recibe y responde mensajes de WhatsApp automáticamente con IA 24/7 en tu propio número.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCredsOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#0a1730] hover:text-[#0d5bff] px-3.5 py-2 text-xs font-bold shadow-2xs hover:shadow-xs transition cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#0d5bff]" />
              <span>Configurar Credenciales</span>
            </button>
            <button
              onClick={() => setIsTestOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:shadow transition cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Probar en Vivo</span>
            </button>
          </div>
        </div>

        {/* Webhook & Verify Token */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="rounded-2xl bg-[#f8fafc] p-3.5 shadow-2xs">
            <span className="font-bold text-[#62728d] block mb-1.5 text-[11px]">URL de Webhook para Meta</span>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730] bg-white p-2.5 rounded-xl shadow-2xs">
              <span className="truncate">{config.webhook_url}</span>
              <button onClick={() => handleCopy(config.webhook_url, 'wa_url')} className="text-[#0d5bff] hover:text-[#0047e1] cursor-pointer shrink-0">
                {copiedKey === 'wa_url' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-3.5 shadow-2xs">
            <span className="font-bold text-[#62728d] block mb-1.5 text-[11px]">Token de Verificación Meta</span>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730] bg-white p-2.5 rounded-xl shadow-2xs">
              <span className="truncate">{config.verify_token}</span>
              <button onClick={() => handleCopy(config.verify_token, 'wa_tok')} className="text-[#0d5bff] hover:text-[#0047e1] cursor-pointer shrink-0">
                {copiedKey === 'wa_tok' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Canales Meta: Instagram Direct & Facebook Messenger */}
      <VoceroMetaChannelsGrid tenantSlug={effectiveSlug} />

      <WhatsAppCredentialsModal isOpen={isCredsOpen} onClose={() => setIsCredsOpen(false)} config={config} onSave={handleSaveConfig} />
      <WhatsAppTestChatModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} tenantSlug={effectiveSlug} defaultPhone={config.business_phone} />
    </div>
  );
};

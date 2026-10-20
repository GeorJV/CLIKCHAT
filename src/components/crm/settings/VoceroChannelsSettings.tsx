import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { WhatsAppCredentialsModal } from '../../client/whatsapp/WhatsAppCredentialsModal';
import { WhatsAppTestChatModal } from '../../client/whatsapp/WhatsAppTestChatModal';
import { MessageSquare, Instagram, Facebook, Copy, Check, ShieldCheck, KeyRound, Play } from 'lucide-react';

interface VoceroChannelsSettingsProps {
  tenant: Tenant | null;
  tenantSlug: string;
}

export const VoceroChannelsSettings: React.FC<VoceroChannelsSettingsProps> = ({ tenantSlug }) => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    phone_number_id: '',
    business_phone: '',
    verify_token: `clikchat_wa_${tenantSlug}`,
    access_token: '',
    status: 'disconnected',
    webhook_url: `https://clikchat.pages.dev/api/whatsapp/webhook?tenant=${tenantSlug}`
  });
  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/whatsapp/config?tenantSlug=${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.config) {
            setConfig(prev => ({
              ...prev,
              ...data.config,
              webhook_url: `https://clikchat.pages.dev/api/whatsapp/webhook?tenant=${tenantSlug}`
            }));
          }
        }
      } catch (e) {
        console.warn('Error loading whatsapp config:', e);
      }
    }
    load();
  }, [tenantSlug]);

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
        body: JSON.stringify({ tenantSlug, ...newConfig })
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
      {/* WhatsApp Cloud API Oficial */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0a1730]">WhatsApp Business Cloud API (Meta Oficial)</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  config.status === 'connected' ? 'bg-[#eaf7ef] text-[#0f8b44]' : 'bg-[#fff5e6] text-[#b36b00]'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${config.status === 'connected' ? 'bg-[#0f8b44]' : 'bg-[#b36b00]'}`} />
                  {config.status === 'connected' ? 'Conectado en Vivo' : 'Pendiente de Credenciales'}
                </span>
              </div>
              <p className="text-xs text-[#62728d]">Recibe y responde mensajes de WhatsApp automáticamente con IA 24/7 en tu propio número.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCredsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[#d8e2f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0a1730] hover:bg-[#f6f8fc] cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#0d5bff]" />
              <span>Configurar Credenciales</span>
            </button>
            <button
              onClick={() => setIsTestOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0d5bff] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0047e1] cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Probar en Vivo</span>
            </button>
          </div>
        </div>

        {/* Webhook & Verify Token */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-[#e8edf6] bg-[#f8fafc] p-3">
            <span className="font-semibold text-[#42506b] block mb-1">URL de Webhook para Meta Developers</span>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730] bg-white p-2 rounded-lg border border-[#e2e8f0]">
              <span className="truncate">{config.webhook_url}</span>
              <button onClick={() => handleCopy(config.webhook_url, 'wa_url')} className="text-[#0d5bff] hover:text-[#0047e1] cursor-pointer shrink-0">
                {copiedKey === 'wa_url' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[#e8edf6] bg-[#f8fafc] p-3">
            <span className="font-semibold text-[#42506b] block mb-1">Token de Verificación (hub.verify_token)</span>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730] bg-white p-2 rounded-lg border border-[#e2e8f0]">
              <span className="truncate">{config.verify_token}</span>
              <button onClick={() => handleCopy(config.verify_token, 'wa_tok')} className="text-[#0d5bff] hover:text-[#0047e1] cursor-pointer shrink-0">
                {copiedKey === 'wa_tok' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Canales Meta: Instagram & Facebook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram Direct */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
              <Instagram className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0a1730]">Instagram Direct (Meta Graph)</h4>
              <span className="text-[11px] font-semibold text-[#0d5bff] bg-[#ebf1ff] px-2 py-0.5 rounded-full">Listo para Webhook</span>
            </div>
          </div>
          <p className="text-xs text-[#62728d] mb-3">Conecta tu cuenta profesional de Instagram para responder DMs automáticamente con el bot.</p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0]">
              <span className="truncate">https://clikchat.pages.dev/api/whatsapp/webhook?channel=instagram&tenant={tenantSlug}</span>
              <button onClick={() => handleCopy(`https://clikchat.pages.dev/api/whatsapp/webhook?channel=instagram&tenant=${tenantSlug}`, 'ig_url')} className="text-[#0d5bff] cursor-pointer">
                {copiedKey === 'ig_url' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Facebook Messenger */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0084ff] text-white">
              <Facebook className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0a1730]">Facebook Messenger (Meta Graph)</h4>
              <span className="text-[11px] font-semibold text-[#0d5bff] bg-[#ebf1ff] px-2 py-0.5 rounded-full">Listo para Webhook</span>
            </div>
          </div>
          <p className="text-xs text-[#62728d] mb-3">Atiende chats de tu página de Facebook con el mismo flujo comercial en 4 pasos.</p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0]">
              <span className="truncate">https://clikchat.pages.dev/api/whatsapp/webhook?channel=messenger&tenant={tenantSlug}</span>
              <button onClick={() => handleCopy(`https://clikchat.pages.dev/api/whatsapp/webhook?channel=messenger&tenant=${tenantSlug}`, 'fb_url')} className="text-[#0d5bff] cursor-pointer">
                {copiedKey === 'fb_url' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppCredentialsModal isOpen={isCredsOpen} onClose={() => setIsCredsOpen(false)} config={config} onSave={handleSaveConfig} />
      <WhatsAppTestChatModal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} tenantSlug={tenantSlug} defaultPhone={config.business_phone} />
    </div>
  );
};

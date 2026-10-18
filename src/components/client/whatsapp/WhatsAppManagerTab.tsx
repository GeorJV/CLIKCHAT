import React, { useState, useEffect } from 'react';
import { Tenant } from '../../../types';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { WhatsAppConnectCard } from './WhatsAppConnectCard';
import { WhatsAppCredentialsModal } from './WhatsAppCredentialsModal';
import { WhatsAppTestChatModal } from './WhatsAppTestChatModal';
import { WhatsAppSetupGuide } from './WhatsAppSetupGuide';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';

interface WhatsAppManagerTabProps {
  tenant: Tenant | null;
  tenantSlug: string;
}

export const WhatsAppManagerTab: React.FC<WhatsAppManagerTabProps> = ({
  tenant,
  tenantSlug
}) => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    phone_number_id: '',
    business_phone: '',
    verify_token: 'clikchat_wa_' + tenantSlug,
    access_token: '',
    status: 'disconnected',
    webhook_url: `https://clikchat.pages.dev/api/whatsapp/webhook?tenant=${tenantSlug}`
  });

  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/whatsapp/config?tenantSlug=${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.config) {
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
    loadConfig();
  }, [tenantSlug]);

  const handleSaveConfig = async (newConfig: Partial<WhatsAppConfig>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          ...newConfig
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(prev => ({ ...prev, ...newConfig }));
        showToast('¡Credenciales de WhatsApp guardadas con éxito!');
        return true;
      }
      showToast(data.error || 'Error al guardar credenciales');
      return false;
    } catch {
      showToast('Error de conexión al guardar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl text-slate-100 font-sans animate-fade-in">
      {/* Toast Notifier */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#25D366] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tarjeta de Conexión y Webhook */}
      <WhatsAppConnectCard
        config={config}
        tenantSlug={tenantSlug}
        onOpenSettings={() => setIsCredsOpen(true)}
        onOpenTest={() => setIsTestOpen(true)}
      />

      {/* Guía Visual de Integración en 3 Pasos */}
      <WhatsAppSetupGuide />

      {/* Modales */}
      <WhatsAppCredentialsModal
        isOpen={isCredsOpen}
        onClose={() => setIsCredsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      <WhatsAppTestChatModal
        isOpen={isTestOpen}
        onClose={() => setIsTestOpen(false)}
        tenantSlug={tenantSlug}
        defaultPhone={config.business_phone}
      />
    </div>
  );
};

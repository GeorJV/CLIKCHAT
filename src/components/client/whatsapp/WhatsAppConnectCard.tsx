import React, { useState } from 'react';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { MessageSquare, Check, Copy, Settings, Send, ExternalLink } from 'lucide-react';

interface WhatsAppConnectCardProps {
  config: WhatsAppConfig;
  tenantSlug: string;
  onOpenSettings: () => void;
  onOpenTest: () => void;
}

export const WhatsAppConnectCard: React.FC<WhatsAppConnectCardProps> = ({
  config,
  tenantSlug,
  onOpenSettings,
  onOpenTest
}) => {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const isConnected = config.status === 'connected';
  const webhookUrl = config.webhook_url || `https://clikchat.pages.dev/api/whatsapp/webhook?tenant=${tenantSlug}`;
  const verifyToken = config.verify_token || 'clikchat_wa_' + tenantSlug;

  const copyToClipboard = (text: string, type: 'webhook' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'webhook') {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 text-[#0a1730] font-sans">
      {/* Encabezado con Estado de Conexión */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#0a1730]">Canal WhatsApp Business Oficial</h3>
              {isConnected ? (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Bot Activo 24/7
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#62728d]">
                  Pendiente de Credenciales
                </span>
              )}
            </div>
            <p className="text-xs text-[#62728d] mt-0.5">
              Tus niveles de RAG responden directamente desde la línea oficial de WhatsApp de tu negocio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#0a1730] hover:text-[#0d5bff] shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#0d5bff]" />
            <span>Configurar Credenciales</span>
          </button>
          <button
            type="button"
            onClick={onOpenTest}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0d5bff] hover:bg-[#0047e1] text-white shadow-sm hover:shadow transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Probar en Vivo</span>
          </button>
        </div>
      </div>

      {/* Datos del Webhook para Meta Cloud API */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#f8fafc] p-3.5 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#62728d] text-[11px] font-semibold">
            <span>URL de Webhook (Callback URL en Meta):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className="text-[#0d5bff] hover:text-[#0047e1] flex items-center gap-1 cursor-pointer font-bold"
            >
              {copiedWebhook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedWebhook ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className="font-mono text-[#0a1730] text-[11px] truncate bg-white p-2 rounded-xl shadow-2xs">
            {webhookUrl}
          </div>
        </div>

        <div className="bg-[#f8fafc] p-3.5 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#62728d] text-[11px] font-semibold">
            <span>Token de Verificación (Verify Token):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(verifyToken, 'token')}
              className="text-[#0d5bff] hover:text-[#0047e1] flex items-center gap-1 cursor-pointer font-bold"
            >
              {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedToken ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className="font-mono text-[#0a1730] text-[11px] truncate bg-white p-2 rounded-xl shadow-2xs">
            {verifyToken}
          </div>
        </div>
      </div>

      {/* Pie con detalles del número vinculado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#62728d]">
        <div className="flex items-center gap-4">
          <span><strong className="text-[#0a1730]">Número:</strong> {config.business_phone || 'Sin registrar'}</span>
          <span><strong className="text-[#0a1730]">Phone Number ID:</strong> {config.phone_number_id ? config.phone_number_id.slice(0, 8) + '...' : 'Pendiente'}</span>
        </div>
        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0d5bff] hover:underline flex items-center gap-1 font-bold"
        >
          <span>Ir a Meta for Developers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { MessageSquare, Check, Copy, Settings, Send, ExternalLink, Zap } from 'lucide-react';

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
    <div className="bg-[#181717] border border-[#282626] rounded-2xl p-5 shadow-xl space-y-4 text-zinc-100">
      {/* Encabezado con Estado de Conexión */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252323] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 shadow-lg shadow-[#25D366]/5">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white">Canal WhatsApp Business Oficial</h3>
              {isConnected ? (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  Bot Activo 24/7
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                  No Vinculado
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tus niveles de RAG responden directamente desde la línea oficial de WhatsApp de tu negocio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#201e1e] hover:bg-[#2b2828] text-zinc-200 border border-[#353232] transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurar Credenciales</span>
          </button>
          <button
            type="button"
            onClick={onOpenTest}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 shadow-md shadow-[#25D366]/20 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Probar en Vivo</span>
          </button>
        </div>
      </div>

      {/* Datos del Webhook para Meta Cloud API */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#121111] border border-[#262424] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] font-semibold">
            <span>URL de Webhook (Callback URL en Meta):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              {copiedWebhook ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedWebhook ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className="font-mono text-zinc-300 truncate bg-[#171616] p-1.5 rounded-lg border border-[#2a2828]">
            {webhookUrl}
          </div>
        </div>

        <div className="bg-[#121111] border border-[#262424] p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] font-semibold">
            <span>Token de Verificación (Verify Token):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(verifyToken, 'token')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              {copiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedToken ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className="font-mono text-zinc-300 truncate bg-[#171616] p-1.5 rounded-lg border border-[#2a2828]">
            {verifyToken}
          </div>
        </div>
      </div>

      {/* Pie con detalles del número vinculado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-4">
          <span><strong>Número:</strong> {config.business_phone || 'Sin registrar'}</span>
          <span><strong>Phone Number ID:</strong> {config.phone_number_id ? config.phone_number_id.slice(0, 6) + '...' : 'Pendiente'}</span>
        </div>
        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Ir a Meta for Developers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

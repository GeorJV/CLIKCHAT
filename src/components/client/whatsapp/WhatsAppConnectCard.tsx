import React, { useState } from 'react';
import { WhatsAppConfig } from '../../../types/whatsapp';
import { MessageSquare, Check, Copy, Settings, Send, ExternalLink } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

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
  const { isVoceroMode } = useVoceroMode();
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
    <div className={`rounded-2xl p-5 sm:p-6 space-y-4 font-sans ${
      isVoceroMode ? 'bg-white shadow-sm text-[#0a1730]' : 'bg-[#181717] border border-[#282626] shadow-lg text-white'
    }`}>
      {/* Encabezado con Estado de Conexión */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        isVoceroMode ? 'border-[#f1f5f9]' : 'border-[#262424]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
            isVoceroMode ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-bold ${isVoceroMode ? 'text-[#0a1730]' : 'text-white'}`}>Canal WhatsApp Business Oficial</h3>
              {isConnected ? (
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
                  isVoceroMode ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Bot Activo 24/7
                </span>
              ) : (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isVoceroMode ? 'bg-[#f1f5f9] text-[#62728d]' : 'bg-[#141313] text-zinc-400 border border-[#262424]'
                }`}>
                  Pendiente de Credenciales
                </span>
              )}
            </div>
            <p className={`text-xs ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'} mt-0.5`}>
              Tus niveles de RAG responden directamente desde la línea oficial de WhatsApp de tu negocio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer ${
              isVoceroMode ? 'bg-[#f8fafc] hover:bg-[#ebf1ff] text-[#0a1730] hover:text-[#0d5bff]' : 'bg-[#222020] hover:bg-[#282626] text-zinc-300 hover:text-white border border-[#383535]'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 ${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'}`} />
            <span>Configurar Credenciales</span>
          </button>
          <button
            type="button"
            onClick={onOpenTest}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition cursor-pointer ${
              isVoceroMode ? 'bg-[#0d5bff] hover:bg-[#0047e1]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Probar en Vivo</span>
          </button>
        </div>
      </div>

      {/* Datos del Webhook para Meta Cloud API */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className={`p-3.5 rounded-2xl space-y-1 shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <div className={`flex items-center justify-between text-[11px] font-semibold ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            <span>URL de Webhook (Callback URL en Meta):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className={`${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'} flex items-center gap-1 cursor-pointer font-bold`}
            >
              {copiedWebhook ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedWebhook ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className={`font-mono text-[11px] truncate p-2 rounded-xl shadow-2xs ${isVoceroMode ? 'bg-white text-[#0a1730]' : 'bg-[#100f0f] text-zinc-200 border border-[#222]'}`}>
            {webhookUrl}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl space-y-1 shadow-2xs ${isVoceroMode ? 'bg-[#f8fafc]' : 'bg-[#141313] border border-[#262424]'}`}>
          <div className={`flex items-center justify-between text-[11px] font-semibold ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
            <span>Token de Verificación (Verify Token):</span>
            <button
              type="button"
              onClick={() => copyToClipboard(verifyToken, 'token')}
              className={`${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'} flex items-center gap-1 cursor-pointer font-bold`}
            >
              {copiedToken ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedToken ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className={`font-mono text-[11px] truncate p-2 rounded-xl shadow-2xs ${isVoceroMode ? 'bg-white text-[#0a1730]' : 'bg-[#100f0f] text-zinc-200 border border-[#222]'}`}>
            {verifyToken}
          </div>
        </div>
      </div>

      {/* Pie con detalles del número vinculado */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
        <div className="flex items-center gap-4">
          <span><strong className={isVoceroMode ? 'text-[#0a1730]' : 'text-white'}>Número:</strong> {config.business_phone || 'Sin registrar'}</span>
          <span><strong className={isVoceroMode ? 'text-[#0a1730]' : 'text-white'}>Phone Number ID:</strong> {config.phone_number_id ? config.phone_number_id.slice(0, 8) + '...' : 'Pendiente'}</span>
        </div>
        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className={`${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'} hover:underline flex items-center gap-1 font-bold`}
        >
          <span>Ir a Meta for Developers</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
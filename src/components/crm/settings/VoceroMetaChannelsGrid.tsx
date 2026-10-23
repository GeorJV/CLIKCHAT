import React, { useState } from 'react';
import { Instagram, Facebook, Copy, Check } from 'lucide-react';

interface VoceroMetaChannelsGridProps {
  tenantSlug: string;
}

export const VoceroMetaChannelsGrid: React.FC<VoceroMetaChannelsGridProps> = ({ tenantSlug }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const igWebhook = `https://clikchat.pages.dev/api/whatsapp/webhook?channel=instagram&tenant=${tenantSlug}`;
  const fbWebhook = `https://clikchat.pages.dev/api/whatsapp/webhook?channel=messenger&tenant=${tenantSlug}`;

  return (
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
        <p className="text-xs text-[#62728d] mb-2">Responde DMs de Instagram automáticamente con la IA.</p>
        <div className="flex items-center justify-between bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0] font-mono text-[11px]">
          <span className="truncate">{igWebhook}</span>
          <button onClick={() => handleCopy(igWebhook, 'ig_url')} className="text-[#0d5bff] cursor-pointer shrink-0 ml-1">
            {copiedKey === 'ig_url' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
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
        <p className="text-xs text-[#62728d] mb-2">Atiende chats de Messenger con el embudo comercial.</p>
        <div className="flex items-center justify-between bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0] font-mono text-[11px]">
          <span className="truncate">{fbWebhook}</span>
          <button onClick={() => handleCopy(fbWebhook, 'fb_url')} className="text-[#0d5bff] cursor-pointer shrink-0 ml-1">
            {copiedKey === 'fb_url' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

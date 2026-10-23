import React, { useState, useEffect } from 'react';
import { Bot, Check, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { Tenant } from '../../../types';

interface VoceroClikChatChannelCardProps {
  tenantSlug: string;
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const VoceroClikChatChannelCard: React.FC<VoceroClikChatChannelCardProps> = ({
  tenantSlug,
  tenant,
  onUpdateSettings,
}) => {
  const effectiveSlug = tenantSlug || tenant?.slug || 'mi-negocio';
  const storageKey = `clikchat_channel_default_${effectiveSlug}`;

  const [isSelected, setIsSelected] = useState<boolean>(() => {
    if (tenant?.clikchat_channel_active !== undefined) {
      return Boolean(tenant.clikchat_channel_active);
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) return stored === 'true';
    }
    return true; // Predeterminado activo por ser canal nativo sin API
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tenant?.clikchat_channel_active !== undefined) {
      setIsSelected(Boolean(tenant.clikchat_channel_active));
    }
  }, [tenant?.clikchat_channel_active]);

  const handleToggle = async () => {
    const next = !isSelected;
    setIsSelected(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(next));
    }
    if (onUpdateSettings) {
      await onUpdateSettings({ clikchat_channel_active: next });
    }
  };

  const crmHost = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://clikchatcrm.pages.dev';
  const chatUrl = `${crmHost}/user/mi-negocio/${effectiveSlug}/clikchat`;
  const publicWebChatUrl = `https://clikchat.pages.dev/${effectiveSlug}`;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all duration-200 shadow-xs ${
        isSelected
          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 ring-2 ring-emerald-500/20'
          : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#f1f5f9] text-[#62728d]'
            }`}
          >
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#0a1730]">Chat Agente ClikChat</h3>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0d5bff] border border-blue-200">
                Canal Nativo Interno • Sin API
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
                  isSelected ? 'bg-[#eaf7ef] text-[#0f8b44]' : 'bg-[#f1f5f9] text-[#62728d]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#0f8b44]' : 'bg-[#94a3b8]'}`}
                />
                {isSelected ? 'Activo por Defecto' : 'Inactivo'}
              </span>
            </div>
            <p className="text-xs text-[#62728d] mt-0.5">
              Chat web conversacional directo e integrado. No requiere credenciales de Meta ni APIs externas; atiende y cotiza de inmediato.
            </p>
          </div>
        </div>

        {/* Checkbox selector de canal por defecto */}
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer shrink-0 border select-none ${
            isSelected
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
              : 'border-[#cbd5e1] bg-white text-[#42506b] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
          }`}
          title="Marcar o desmarcar Chat Agente ClikChat como canal activo por defecto"
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center transition ${
              isSelected ? 'bg-white text-emerald-600' : 'border border-slate-400 bg-white'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>{isSelected ? 'Canal Activo por Defecto' : 'Elegir como Canal por Defecto'}</span>
        </button>
      </div>

      {/* Enlaces y Acceso Rápido */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 rounded-xl border border-[#e8edf6] bg-[#f8fafc] p-2.5">
          <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#0a1730]">
            <span className="truncate">{publicWebChatUrl}</span>
            <button
              type="button"
              onClick={() => handleCopy(publicWebChatUrl)}
              className="flex items-center gap-1 text-[#0d5bff] hover:text-[#0047e1] font-sans font-bold cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar Enlace Web</span>
                </>
              )}
            </button>
          </div>
        </div>

        <a
          href={chatUrl}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d8e2f0] bg-white px-3.5 py-2 text-xs font-bold text-[#0a1730] hover:bg-[#f6f8fc] cursor-pointer shrink-0 shadow-2xs"
        >
          <MessageSquare className="h-3.5 w-3.5 text-[#0d5bff]" />
          <span>Abrir Chat Agente</span>
          <ExternalLink className="h-3 w-3 text-[#8391aa]" />
        </a>
      </div>
    </div>
  );
};

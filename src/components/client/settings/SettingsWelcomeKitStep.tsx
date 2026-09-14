import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface SettingsWelcomeKitStepProps {
  slug: string;
  onOpenLiveChat?: () => void;
  onOpenWizard?: () => void;
}

export const SettingsWelcomeKitStep: React.FC<SettingsWelcomeKitStepProps> = ({
  slug,
  onOpenLiveChat,
  onOpenWizard
}) => {
  const [copied, setCopied] = useState(false);
  const qlinkUrl = `https://clikchat.pages.dev?t=${slug || 'mi-tienda'}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(qlinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span>3. Identidad Digital QLink & Kit de Bienvenida</span>
        </h3>
        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">
          Paso 3 de 3
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Tu identificador digital para tus clientes. Compártelo en WhatsApp, redes sociales o imprímelo en el mostrador físico de tu tienda.
      </p>

      {/* URL Display */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-emerald-400">
          <span className="truncate">{qlinkUrl}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            ⚡ En Vivo 24/7
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '¡Copiado!' : 'Copiar QLink'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {onOpenLiveChat && (
          <button
            type="button"
            onClick={onOpenLiveChat}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Chatbot en Pantalla Completa</span>
          </button>
        )}

        {onOpenWizard && (
          <button
            type="button"
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ejecutar Asistente Guiado Paso a Paso</span>
          </button>
        )}
      </div>
    </div>
  );
};

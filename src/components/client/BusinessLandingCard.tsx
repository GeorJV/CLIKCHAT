import React, { useState } from 'react';
import { Globe, Copy, Check, QrCode, X } from 'lucide-react';

interface BusinessLandingCardProps {
  slug: string;
}

export const BusinessLandingCard: React.FC<BusinessLandingCardProps> = ({ slug }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const publicUrl = `https://clikchat.pages.dev/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="onyx-card rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3 h-3" /> Landingbot Público Activo
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Listo para compartir
          </span>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white">Enlace General de tu Tienda</h3>
          <p className="text-[11px] text-zinc-400">
            Comparte esta URL en tu biografía de Instagram, campañas generales o tarjetas de presentación.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 bg-[#111010] border border-[#262424] rounded-lg p-1.5 pl-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] font-black uppercase text-zinc-500 shrink-0">URL:</span>
            <span className="text-xs font-mono text-emerald-400 truncate">{publicUrl}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar Enlace'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md keycap hover:bg-[#252424] text-zinc-300 hover:text-white text-xs font-semibold transition border-[#2e2b2b] cursor-pointer"
            >
              <QrCode className="w-3 h-3" />
              <span>Código QR</span>
            </button>
          </div>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="onyx-card rounded-xl p-4 max-w-xs w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="text-xs font-bold text-white mb-2">Código QR de tu Tienda</h4>
            <div className="bg-white p-2 rounded-lg inline-block shadow-inner mb-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(publicUrl)}`}
                alt="QR Code"
                className="w-36 h-36"
              />
            </div>
            <p className="text-[10px] text-zinc-400 break-all font-mono mb-2">{publicUrl}</p>
            <button
              onClick={handleCopy}
              className="w-full py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
            >
              {copied ? '¡Copiado!' : 'Copiar URL'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

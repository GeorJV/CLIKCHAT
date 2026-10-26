import React, { useState } from 'react';
import { Sparkles, Copy, Check, ExternalLink, Megaphone, Tag, Globe, MessageSquare } from 'lucide-react';

interface Props {
  tenantSlug: string;
  storeName?: string;
}

const SOURCE_OPTIONS = [
  { value: 'instagram_ads', label: 'Instagram Ads (Publicidad Pagada)' },
  { value: 'facebook_ads', label: 'Facebook Ads (Publicidad Pagada)' },
  { value: 'instagram_post', label: 'Instagram Post / Enlace en Bio' },
  { value: 'facebook_post', label: 'Facebook Post / Publicación Orgánica' },
  { value: 'tiktok', label: 'TikTok (Bio o Video Anuncio)' },
  { value: 'google_ads', label: 'Google Ads (Búsqueda o Display)' },
  { value: 'web', label: 'Página Web Oficial (Botón o Banner)' },
  { value: 'whatsapp', label: 'WhatsApp (Estado o Campaña)' },
  { value: 'otro', label: 'Otro Canal Personalizado...' },
];

export const CampaignLinkGeneratorCard: React.FC<Props> = ({ tenantSlug, storeName = 'Mi Negocio' }) => {
  const [source, setSource] = useState('instagram_ads');
  const [customSource, setCustomSource] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [offer, setOffer] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanSlug = tenantSlug || 'mi-negocio';
  const crmHost = typeof window !== 'undefined' && (window.location.hostname.includes('clikchatcrm') || window.location.hostname.includes('localhost'))
    ? window.location.origin
    : 'https://clikchatcrm.pages.dev';

  const activeSource = source === 'otro' ? (customSource.trim() || 'campaña_personalizada') : source;

  const queryParams = new URLSearchParams();
  if (activeSource) queryParams.set('src', activeSource);
  if (campaignName.trim()) queryParams.set('camp', campaignName.trim());
  if (offer.trim()) queryParams.set('offer', offer.trim());
  if (description.trim()) queryParams.set('desc', description.trim());
  if (adUrl.trim()) queryParams.set('ad_url', adUrl.trim());

  const generatedUrl = `${crmHost}/chat/${cleanSlug}?${queryParams.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/20 to-white p-5 shadow-xs font-sans space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d5bff] text-white shadow-xs">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0a1730]">
              Generador de Enlaces de Anuncios & Ofertas con Contexto IA
            </h3>
            <p className="text-[11.5px] text-[#62728d]">
              Crea links para tus anuncios. El bot sabrá de qué publicidad viene el cliente y qué oferta prometiste.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="h-3 w-3" /> Memoria Contextual
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1 flex items-center gap-1">
            <Globe className="h-3 w-3 text-[#0d5bff]" /> Origen o Canal del Tráfico:
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {source === 'otro' && (
            <input
              type="text"
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              placeholder="Nombre del canal (ej: volante_feria, email_octubre)"
              className="mt-1.5 w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
            />
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1 flex items-center gap-1">
            <Megaphone className="h-3 w-3 text-[#0d5bff]" /> Nombre del Anuncio o Campaña:
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Ej: Anuncio 1 - Promo Web 24h"
            className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1 flex items-center gap-1">
            <Tag className="h-3 w-3 text-emerald-600" /> Oferta o Gancho Específico (Opcional):
          </label>
          <input
            type="text"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Ej: 20% de descuento o Asesoría gratis"
            className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#42506b] mb-1 flex items-center gap-1">
            <ExternalLink className="h-3 w-3 text-[#62728d]" /> URL del Post o Anuncio (Opcional):
          </label>
          <input
            type="url"
            value={adUrl}
            onChange={(e) => setAdUrl(e.target.value)}
            placeholder="https://instagram.com/p/... o link del anuncio"
            className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-[#42506b] mb-1 flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-[#0d5bff]" /> ¿De qué trata el anuncio? (Instrucción interna para la IA):
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Video en Instagram mostrando cómo automatizamos la atención y multiplicamos ventas en 24h. Si el cliente pregunta, háblale de este caso de éxito."
            className="w-full rounded-xl border border-[#d8e2f0] bg-white p-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#d8e2f0] bg-white p-3.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#62728d]">
            Enlace Generado Listo para Anuncios / Botones:
          </span>
          <div className="flex items-center gap-2">
            <a
              href={generatedUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#d8e2f0] text-xs font-semibold text-[#0a1730] hover:bg-[#edf2f9] transition"
            >
              <ExternalLink className="h-3 w-3" /> <span>Probar Chat</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d5bff] text-white text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer shadow-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>
        <p className="font-mono text-[11px] text-[#0d5bff] break-all bg-[#f8fafc] p-2 rounded-lg border border-[#e8edf6]">
          {generatedUrl}
        </p>
      </div>

      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2 text-xs text-[#42506b]">
        <Sparkles className="h-4 w-4 text-[#0d5bff] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#0a1730]">Comportamiento de la IA:</strong> Cuando un visitante abra este enlace, la IA sabrá automáticamente que proviene de <strong className="text-[#0d5bff]">{activeSource}</strong>{campaignName ? ` (Campaña: "${campaignName}")` : ''}{offer ? ` con la oferta: "${offer}"` : ''}. Atenderá con total conocimiento sin que el cliente tenga que explicárselo.
        </p>
      </div>
    </div>
  );
};

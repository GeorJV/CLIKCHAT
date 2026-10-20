import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Instagram, Facebook, Smartphone, QrCode, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  tenantSlug: string;
  storeName?: string;
}

export const ClikChatLinksAndTemplates: React.FC<Props> = ({ tenantSlug, storeName = 'Mi Negocio' }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const baseUrl = `https://clikchat.pages.dev/chat/${tenantSlug}`;

  const LINKS = [
    { id: 'ad', label: 'Anuncios de Meta & Google', param: 'anuncio', icon: Sparkles, desc: 'Para botones de "Más Información" en campañas de anuncios pagados.' },
    { id: 'dm', label: 'Auto-respuesta de Instagram (DM)', param: 'dm', icon: Instagram, desc: 'Para el mensaje automático cuando te escriben por privado en Instagram.' },
    { id: 'post', label: 'Enlace en Bio o Publicaciones', param: 'post', icon: ExternalLink, desc: 'Para poner en el enlace de tu perfil de Instagram o TikTok.' },
    { id: 'sms', label: 'WhatsApp Business / Mensaje de Texto', param: 'sms', icon: Smartphone, desc: 'Para respuestas automáticas de WhatsApp Business o campañas SMS.' },
    { id: 'qr', label: 'Código QR para Mesas o Volantes', param: 'qr', icon: QrCode, desc: 'Para que los clientes escaneen en físico y abran el bot.' },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const TEMPLATES = [
    {
      id: 'tpl-ig',
      channel: 'Instagram DM (Mensaje Automático)',
      icon: Instagram,
      text: `¡Hola! 👋 Gracias por escribirnos a ${storeName}. Para consultar nuestro catálogo completo, ver precios oficiales y hacer tu pedido en 1 minuto con atención inmediata 24/7, toca aquí: 👉 ${baseUrl}?src=dm`
    },
    {
      id: 'tpl-wa',
      channel: 'WhatsApp Business (Mensaje de Bienvenida)',
      icon: MessageSquare,
      text: `¡Hola! 👋 Con mucho gusto te asesoramos. Puedes consultar el menú, armar tu orden y pagar con SINPE Móvil o tarjeta al instante aquí: 👉 ${baseUrl}?src=sms`
    },
    {
      id: 'tpl-fb',
      channel: 'Facebook Messenger (Respuesta Instantánea)',
      icon: Facebook,
      text: `¡Hola! 👋 Bienvenido a ${storeName}. Toca nuestro enlace oficial para cotizar y ordenar directamente con nuestro asistente virtual: 👉 ${baseUrl}?src=dm`
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Explicación No-Code */}
      <div className="rounded-2xl border border-[#d8e2f0] bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#0a1730] mb-1">
          Atribución de Tráfico & Respuestas Automáticas (Cero Código)
        </h3>
        <p className="text-xs text-[#62728d] leading-relaxed">
          Si no deseas conectar webhooks complejos en Meta o tus redes sociales, simplemente copia estos enlaces rastreados y pégalos en los mensajes automáticos de tus redes. Cuando el cliente haga clic, el bot sabrá exactamente de dónde provino y te lo mostrará en el CRM.
        </p>
      </div>

      {/* Generador de Enlaces con Atribución */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-[#0a1730] uppercase tracking-wider">
          Enlaces con Rastreo de Origen (UTM)
        </h4>
        <div className="space-y-2.5">
          {LINKS.map((item) => {
            const Icon = item.icon;
            const fullUrl = `${baseUrl}?src=${item.param}`;
            return (
              <div key={item.id} className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#0a1730]">
                    <Icon className="h-3.5 w-3.5 text-[#0d5bff]" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-[#8391aa] truncate mt-0.5">{item.desc}</p>
                  <span className="font-mono text-[10.5px] text-[#0d5bff] block truncate mt-1">{fullUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(fullUrl, item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d8e2f0] text-xs font-bold text-[#0a1730] hover:bg-[#edf2f9] transition cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  {copiedKey === item.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === item.id ? '¡Copiado!' : 'Copiar Enlace'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plantillas de Auto-respuesta Listas para Copiar */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-[#0a1730] uppercase tracking-wider">
          Plantillas de Mensajes Automáticos (Copia y Pega en tus Apps)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div key={tpl.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#0a1730] mb-2">
                    <Icon className="h-3.5 w-3.5 text-[#0d5bff]" />
                    <span>{tpl.channel}</span>
                  </div>
                  <p className="text-[11px] text-[#42506b] bg-white p-2.5 rounded-lg border border-[#e2e8f0] leading-relaxed">
                    {tpl.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tpl.text, tpl.id)}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#0d5bff] text-white text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer"
                >
                  {copiedKey === tpl.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === tpl.id ? '¡Plantilla Copiada!' : 'Copiar Texto'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

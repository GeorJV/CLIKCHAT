import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const LandingFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Tengo que pagarle a Meta o configurar la costosa WhatsApp Business API?',
      a: 'No. Con ClikChat no pagas ni un solo centavo por mensaje a Meta ni necesitas pasar por engorrosos procesos de verificación de empresa. El cliente interactúa en tu web o enlace social y, cuando decide comprar, se le genera el mensaje completo directo a tu número de WhatsApp.'
    },
    {
      q: '¿Cómo aprende el bot sobre mis productos, horarios y precios?',
      a: 'Solo debes arrastrar tus archivos en Excel, Word, PDF o texto plano a la sección de entrenamiento, o escribir tus preguntas frecuentes directamente. En menos de 60 segundos, la IA procesa todo y queda lista para responder de forma precisa.'
    },
    {
      q: '¿Qué pasa si un cliente hace una pregunta que el bot no sabe?',
      a: 'El bot nunca inventará datos falsos ni dejará al cliente en ridículo. La consulta se clasifica como pendiente y te aparece en tu panel. Tú escribes la respuesta una sola vez y, en segundos, el bot la memoriza para responderla en automático a todos los próximos clientes.'
    },
    {
      q: '¿Puedo supervisar las conversaciones e intervenir cuando yo quiera?',
      a: 'Absolutamente. Cuentas con un panel de conversaciones en tiempo real para leer cada charla del bot. Si detectas una negociación importante o un cliente VIP, puedes tomar el control e intervenir tú mismo.'
    },
    {
      q: '¿Puedo instalar ClikChat en mi tienda web o usarlo solo con un enlace?',
      a: 'Puedes usar ambas opciones. Puedes incrustar el widget flotante en cualquier sitio web (Shopify, WordPress, HTML) o compartir tu enlace exclusivo en la biografía de Instagram, TikTok o campañas publicitarias.'
    }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center space-y-3 mb-10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Dudas Resueltas
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Todo lo que necesitas saber antes de activar tu asesor comercial con IA.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'bg-zinc-900 border-indigo-500/40 shadow-lg' : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-white">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-fadeIn">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

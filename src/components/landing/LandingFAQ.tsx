import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const LandingFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Es obligatorio pagar a Meta o tramitar la WhatsApp Business API oficial?',
      a: 'De ninguna manera. ClikChat no grava comisiones por conversación ni exige procesos burocráticos de homologación ante Meta. El cliente interactúa en su entorno web o red social y, al momento de cerrar, se le genera el mensaje íntegro directamente a su línea de WhatsApp corporativa o personal.'
    },
    {
      q: '¿Cómo se instruye al bot sobre inventarios, políticas y tablas de tarifas?',
      a: 'Basta con arrastrar sus documentos en Excel, Word, PDF o texto plano al panel de conocimiento. En menos de 60 segundos, el motor semántico estructura y vectoriza cada dato, garantizando un dominio absoluto de su oferta.'
    },
    {
      q: '¿Qué protocolo sigue el sistema ante una consulta no documentada?',
      a: 'ClikChat rechaza cualquier alucinación o dato inventado. Si se plantea una duda inédita, el sistema la deriva a su bandeja de consultas pendientes. Usted asienta la respuesta una sola vez y, en segundos, el bot la incorpora a su conocimiento permanente para futuros clientes.'
    },
    {
      q: '¿Es factible supervisar las conversaciones e intervenir en vivo?',
      a: 'Completamente. Usted dispone de una consola de auditoría en tiempo real para examinar cada intercambio. Ante una negociación estratégica o una cuenta corporativa, puede tomar el mando del chat en cualquier momento.'
    },
    {
      q: '¿Puedo integrar ClikChat en mi tienda web o utilizarlo de forma autónoma?',
      a: 'Ambas modalidades están plenamente habilitadas. Puede incrustar el widget flotante en cualquier sitio web (Shopify, WordPress, Webflow o código a medida) o emplear el enlace exclusivo para la biografía de sus canales sociales.'
    }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-18">
      <div className="text-center space-y-3 mb-12">
        <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#8c6b38] font-bold bg-[#f4efe4] px-4 py-1.5 rounded-full border border-[#ded4be]">
          Certidumbre & Políticas
        </span>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#181716] tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-xs sm:text-sm text-[#615a4f] font-light">
          Aspectos clave sobre la implementación, costos e infraestructura de su asesor virtual.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((f, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white border-[#caa461] shadow-[0_4px_24px_rgba(20,18,15,0.04)] ring-1 ring-[#dfc18b]/30' : 'bg-white border-[#e5dfd5] shadow-sm hover:border-[#c9c1b3]'}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#181716]">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#9c783c] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#524c42] leading-relaxed border-t border-[#f0ece5] animate-fadeIn font-light">
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

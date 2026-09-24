import React from 'react';
import { ShieldAlert, Moon, Store, Calendar, Check } from 'lucide-react';

export const LandingTargetAudience: React.FC = () => {
  const audiences = [
    {
      index: '01',
      icon: ShieldAlert,
      badge: 'Independencia Total',
      badgeColor: 'bg-[#faf4ed] text-[#8c5a2c] border-[#edd9c5]',
      title: 'Quienes huyen de la costosa y engorrosa API de Meta',
      pain: '¿Cansado de que Meta cobre por cada mensaje enviado, demore semanas verificando tu empresa o amenace con bloquear tu línea?',
      solution: 'ClikChat opera de inmediato, sin aranceles por mensaje a Meta, y canaliza al cliente con su pedido estructurado directamente a tu WhatsApp.'
    },
    {
      index: '02',
      icon: Moon,
      badge: 'Venta Nocturna',
      badgeColor: 'bg-[#f4efe4] text-[#785929] border-[#e0d3be]',
      title: 'Dueños de negocio que quieren vender mientras duermen',
      pain: 'Tus clientes cotizan a las 11 PM o 2 AM. Si no obtienen respuesta instantánea, buscan en Google y compran a tu competidor.',
      solution: 'Tu asesor virtual atiende sin interrupciones: argumenta beneficios, cotiza productos, agenda citas y deja la venta lista para cobrar.'
    },
    {
      index: '03',
      icon: Store,
      badge: 'Catálogo Visual',
      badgeColor: 'bg-[#f3f1ec] text-[#4d463d] border-[#ded8cc]',
      title: 'Tiendas físicas y E-commerce con catálogo de productos',
      pain: 'Consumir horas enviando las mismas fotos, precios y tallas por chat privado a decenas de personas que luego no compran.',
      solution: 'El asesor despliega carruseles fotográficos de alta resolución, fichas técnicas y precios verificados, guiando al usuario al pago.'
    },
    {
      index: '04',
      icon: Calendar,
      badge: 'Citas & Asesoría',
      badgeColor: 'bg-[#f0f4f2] text-[#1b533d] border-[#cbe3d6]',
      title: 'Servicios, Clínicas, Asesorías y Profesionales',
      pain: 'Explicar repetidamente qué incluye tu servicio, aclarar dudas técnicas y lidiar con curiosos que solo regatean el precio.',
      solution: 'Filtra prospectos calificados, resuelve objeciones complejas con IA de razonamiento y agenda citas con personas decididas a contratar.'
    }
  ];

  return (
    <section id="para-quien" className="max-w-6xl mx-auto px-4 sm:px-6 py-18">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
        <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#8c6b38] font-bold bg-[#f4efe4] px-4 py-1.5 rounded-full border border-[#ded4be]">
          Segmentación Estratégica
        </span>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#181716] tracking-tight">
          ¿Para quién está concebido ClikChat?
        </h2>
        <p className="text-xs sm:text-sm text-[#615a4f] font-light">
          Para empresas y marcas que exigen atención comercial inmediata, refinada y sin intermediarios abusivos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {audiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl bg-white border border-[#e5ded4] shadow-[0_4px_24px_rgba(20,18,15,0.03)] hover:border-[#caa461]/80 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between border-b border-[#f0ece5] pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-xs font-bold text-[#9e7d47] tracking-wider">{item.index}</span>
                  <div className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#e5dfd4] flex items-center justify-center text-[#2e2a23]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <span className={`text-[9px] font-sans font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wider ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-base font-bold text-[#181716] tracking-tight mb-2.5">
                  {item.title}
                </h3>
                <div className="p-3.5 rounded-2xl bg-[#fbf7f4] border border-[#eee0d6] mb-3.5">
                  <p className="text-xs text-[#6e4133] leading-relaxed font-normal">
                    <span className="font-bold text-[#542d22]">El obstáculo:</span> {item.pain}
                  </p>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#403a31] leading-relaxed">
                  <div className="mt-0.5 p-0.5 rounded-full bg-[#edf5f0] text-[#194c37] border border-[#cae2d4] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <p><span className="font-bold text-[#181716]">Solución ClikChat:</span> {item.solution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

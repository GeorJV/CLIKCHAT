import React from 'react';
import { ShieldAlert, Moon, Store, Calendar, Check } from 'lucide-react';

export const LandingTargetAudience: React.FC = () => {
  const audiences = [
    {
      icon: ShieldAlert,
      badge: 'Cero Complicaciones',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Quienes huyen de la costosa y engorrosa API de Meta',
      pain: '¿Cansado de que Meta te cobre por cada mensaje enviado, te pida semanas para verificar tu empresa o te bloquee el número?',
      solution: 'ClikChat funciona de inmediato, sin pagos por mensaje a Meta, y conecta directo al WhatsApp de tu negocio con el pedido listo con un solo clic.'
    },
    {
      icon: Moon,
      badge: 'Ventas 24/7',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Dueños de negocio que quieren vender mientras duermen',
      pain: 'Tus clientes navegan a las 11 PM o 2 AM. Si no reciben respuesta en minutos, buscan en Google y le compran a tu competidor.',
      solution: 'Tu asesor virtual atiende a cualquier hora: explica beneficios, cotiza productos, agenda citas y deja la venta lista para que cobres por la mañana.'
    },
    {
      icon: Store,
      badge: 'Catálogo Visual',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: 'Tiendas físicas y E-commerce con catálogo de productos',
      pain: 'Perder horas enviando las mismas fotos, precios y tallas por mensaje privado a 30 personas que luego no compran.',
      solution: 'El bot muestra carruseles de fotos de alta resolución, fichas técnicas y precios actualizados, guiando al usuario hasta el botón de compra.'
    },
    {
      icon: Calendar,
      badge: 'Agendamiento & Citas',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      title: 'Servicios, Clínicas, Asesorías y Profesionales',
      pain: 'Explicar una y otra vez qué incluye tu servicio, resolver dudas técnicas y filtrar a curiosos que solo preguntan por el precio más bajo.',
      solution: 'Filtra prospectos calificados, resuelve objeciones complejas con IA de razonamiento y agenda citas con personas realmente interesadas.'
    }
  ];

  return (
    <section id="para-quien" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Segmentación Estratégica
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ¿Para quién está diseñado ClikChat?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Diseñado para negocios que quieren vender más sin contratar más personal ni pagar comisiones sorpresa a intermediarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {audiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                  {item.title}
                </h3>
                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 mb-3">
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    <span className="font-bold text-rose-900">El problema:</span> {item.pain}
                  </p>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <p><span className="font-bold text-slate-900">Solución ClikChat:</span> {item.solution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

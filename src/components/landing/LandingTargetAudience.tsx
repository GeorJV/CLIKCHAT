import React from 'react';
import { ShieldAlert, Moon, Store, Calendar, Users2, Check } from 'lucide-react';

export const LandingTargetAudience: React.FC = () => {
  const audiences = [
    {
      icon: ShieldAlert,
      badge: 'Cero Complicaciones',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      title: 'Quienes huyen de la costosa y engorrosa API de Meta',
      pain: '¿Cansado de que Meta te cobre por cada mensaje enviado, te pida semanas para verificar tu empresa o te bloquee el número?',
      solution: 'ClikChat funciona de inmediato, sin pagos por mensaje a Meta, y conecta directo al WhatsApp de tu negocio con el pedido listo con un solo clic.'
    },
    {
      icon: Moon,
      badge: 'Ventas 24/7',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      title: 'Dueños de negocio que quieren vender mientras duermen',
      pain: 'Tus clientes navegan a las 11 PM o 2 AM. Si no reciben respuesta en minutos, buscan en Google y le compran a tu competidor.',
      solution: 'Tu asesor virtual atiende a cualquier hora: explica beneficios, cotiza productos, agenda citas y deja la venta lista para que cobres por la mañana.'
    },
    {
      icon: Store,
      badge: 'Catálogo Visual',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      title: 'Tiendas físicas y E-commerce con catálogo de productos',
      pain: 'Perder horas enviando las mismas fotos, precios y tallas por mensaje privado a 30 personas que luego no compran.',
      solution: 'El bot muestra carruseles de fotos de alta resolución, fichas técnicas y precios actualizados, guiando al usuario hasta el botón de compra.'
    },
    {
      icon: Calendar,
      badge: 'Agendamiento & Citas',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      title: 'Servicios, Clínicas, Asesorías y Profesionales',
      pain: 'Explicar una y otra vez qué incluye tu servicio, resolver dudas técnicas y filtrar a curiosos que solo preguntan por el precio más bajo.',
      solution: 'Filtra prospectos calificados, resuelve objeciones complejas con IA de razonamiento y agenda citas con personas realmente interesadas.'
    }
  ];

  return (
    <section id="para-quien" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Segmentación Estratégica
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          ¿Para quién está diseñado ClikChat?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Diseñado para negocios que quieren vender más sin contratar más personal ni pagar comisiones sorpresa a intermediarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {audiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-zinc-900/70 border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white group-hover:scale-105 transition">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-3">
                  <p className="text-xs text-rose-300/90 leading-relaxed font-medium">
                    <span className="font-bold text-rose-400">El problema:</span> {item.pain}
                  </p>
                </div>
                <div className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <p><span className="font-bold text-white">Solución ClikChat:</span> {item.solution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { BrainCircuit, BarChart3, Eye, FileSpreadsheet, MessageCircle, CheckCircle2 } from 'lucide-react';

export const LandingCapabilitiesBento: React.FC = () => {
  return (
    <section id="capacidades" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Tecnología de Élite
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Poder comercial que ninguna respuesta automática puede igualar
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Supervisión humana, métricas de conversión y aprendizaje dinámico diseñados para vender.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* BENTO 1: Auto-aprendizaje HITL (Feature destacada, 2 columnas) */}
        <div id="autoaprendizaje" className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-200/90 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Auto-Aprendizaje Continuo (HITL)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Cero Inventos</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            ¿El bot no sabe una respuesta? Te pregunta a ti, la guardas una vez y la usa para siempre.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nunca dejará a un cliente con una respuesta inventada o falsa. Si un comprador hace una pregunta muy específica que no está en tu catálogo, el bot te notifica la duda pendiente. Escribes la solución en segundos y, desde ese instante, el bot ya sabe responderle a todos los futuros clientes en automático.
          </p>

          <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Duda no resuelta detectada</span>
            </div>
            <span className="text-indigo-700 font-mono text-[11px] font-bold">➔ Tu respuesta guardada en D1 ➔ Aprendido en 1.5s</span>
          </div>
        </div>

        {/* BENTO 2: Métricas Reales por Clic */}
        <div id="metricas" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Reportes Reales por Clic y Rendimiento
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mide qué productos generan interés real. Visualiza cuántos clientes vieron fotos, cuántos dieron clic en &quot;Comprar&quot; y clasifícalos en prospectos fríos, tibios o calientes.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Métricas sin cookies invasivas
          </div>
        </div>

        {/* BENTO 3: Monitoreo en Vivo e Intervención */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Espía y Supervisa las Charlas en Tiempo Real
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Puedes leer el historial completo de cada conversación entre el bot y tus clientes. Si detectas un cliente de alto valor y quieres intervenir personalmente, puedes tomar el control al instante.
          </p>
        </div>

        {/* BENTO 4: Carga de Documentos Drag & Drop */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 w-fit">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Entrena tu IA con Excel, Word o Texto
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Solo arrastra y suelta tus listas de precios, inventarios o políticas de garantía. El sistema procesa las tablas y párrafos automáticamente en fragmentos inteligentes de conocimiento.
          </p>
        </div>

        {/* BENTO 5: WhatsApp Directo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Cierre sin Fricción a tu WhatsApp
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            El cliente no tiene que volver a explicarte lo que quiere. Con un solo clic se genera el mensaje con el producto exacto, precio y confirmación listo para cerrar el pago por Sinpe, transferencia o tarjeta.
          </p>
        </div>

      </div>
    </section>
  );
};

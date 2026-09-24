import React from 'react';
import { BrainCircuit, BarChart3, Eye, FileSpreadsheet, MessageCircle, CheckCircle2 } from 'lucide-react';

export const LandingCapabilitiesBento: React.FC = () => {
  return (
    <section id="capacidades" className="max-w-6xl mx-auto px-4 sm:px-6 py-18">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
        <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#8c6b38] font-bold bg-[#f4efe4] px-4 py-1.5 rounded-full border border-[#ded4be]">
          Ingeniería Comercial
        </span>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#181716] tracking-tight">
          Poder de venta que ninguna respuesta genérica puede igualar
        </h2>
        <p className="text-xs sm:text-sm text-[#615a4f] font-light">
          Supervisión en tiempo real, métricas analíticas por clic y aprendizaje dinámico sin alucinaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BENTO 1: Auto-aprendizaje HITL (Feature destacada, 2 columnas) */}
        <div id="autoaprendizaje" className="md:col-span-2 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#faf7f0] via-[#ffffff] to-[#f6f2e8] border border-[#e2d7c2] shadow-[0_4px_24px_rgba(25,23,20,0.03)] space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#f0e7d6] text-[#785929] border border-[#dfd1b8]">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#3d3220] uppercase tracking-wider">Aprendizaje Continuo Supervisado (HITL)</span>
            </div>
            <span className="text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#f4ece0] text-[#70562e] border border-[#dfd1b8]">
              CERO INVENTOS
            </span>
          </div>

          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#181716]">
            ¿El bot no conoce una respuesta? Te consulta a ti, la guardas una vez y la usa para siempre.
          </h3>
          <p className="text-xs sm:text-sm text-[#575146] leading-relaxed font-light">
            Tu marca nunca quedará comprometida con respuestas falsas. Si un cliente formula una pregunta hiperespecífica que no está en tu catálogo, el bot la registra como consulta pendiente en tu panel. Escribes la aclaración en segundos y, desde ese instante, el bot la adopta en su memoria para responder a futuros compradores.
          </p>

          <div className="p-4 rounded-2xl bg-white/90 border border-[#dfd4c0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#474136]">
              <span className="w-2 h-2 rounded-full bg-[#b58c42] animate-ping" />
              <span>Duda no resuelta canalizada</span>
            </div>
            <span className="text-[#8c6b38] font-mono text-[11px] font-bold">➔ Guardada en Base de Datos ➔ Asimilada en 1.5s</span>
          </div>
        </div>

        {/* BENTO 2: Métricas Reales por Clic */}
        <div id="metricas" className="p-7 sm:p-8 rounded-3xl bg-white border border-[#e5dfd5] shadow-[0_4px_24px_rgba(25,23,20,0.03)] space-y-4">
          <div className="p-2.5 rounded-xl bg-[#edf5f0] text-[#194c37] border border-[#cae2d4] w-fit">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#181716]">
            Reportes Reales por Clic y Rendimiento
          </h3>
          <p className="text-xs text-[#575146] leading-relaxed font-light">
            Mide qué productos generan interés real. Visualiza cuántos clientes examinaron fotos, cuántos dieron clic en &quot;Comprar&quot; y clasifícalos en prospectos fríos, tibios o calientes.
          </p>
          <div className="pt-2 border-t border-[#f0ece5] text-[11px] font-mono text-[#194c37] flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Métricas sin cookies invasivas
          </div>
        </div>

        {/* BENTO 3: Monitoreo en Vivo e Intervención */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#e5dfd5] shadow-[0_4px_24px_rgba(25,23,20,0.03)] space-y-4">
          <div className="p-2.5 rounded-xl bg-[#f5f1eb] text-[#54483a] border border-[#ded4c6] w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#181716]">
            Supervisión de Charlas en Tiempo Real
          </h3>
          <p className="text-xs text-[#575146] leading-relaxed font-light">
            Puedes leer el historial íntegro de cada interacción. Si detectas una negociación de alto calibre o una cuenta institucional, puedes intervenir y tomar el control de la conversación.
          </p>
        </div>

        {/* BENTO 4: Carga de Documentos Drag & Drop */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#e5dfd5] shadow-[0_4px_24px_rgba(25,23,20,0.03)] space-y-4">
          <div className="p-2.5 rounded-xl bg-[#f8f5ee] text-[#8c6b38] border border-[#e3d7c1] w-fit">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#181716]">
            Entrena tu IA con Excel, Word o Texto
          </h3>
          <p className="text-xs text-[#575146] leading-relaxed font-light">
            Arrastra y suelta tus listas de precios, inventarios o manuales de políticas. El motor procesa tablas y párrafos de forma autónoma en fragmentos vectoriales de alta precisión.
          </p>
        </div>

        {/* BENTO 5: WhatsApp Directo */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#e5dfd5] shadow-[0_4px_24px_rgba(25,23,20,0.03)] space-y-4">
          <div className="p-2.5 rounded-xl bg-[#edf5f0] text-[#194c37] border border-[#cae2d4] w-fit">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#181716]">
            Cierre sin Fricción hacia tu WhatsApp
          </h3>
          <p className="text-xs text-[#575146] leading-relaxed font-light">
            El comprador no tiene que repetir lo que desea. Un clic genera el mensaje estructurado con el producto seleccionado, precio y confirmación para recibir el pago inmediatamente.
          </p>
        </div>

      </div>
    </section>
  );
};

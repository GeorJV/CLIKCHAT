import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingCTAProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({
  onOpenDemo,
  onGoToDashboard
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="relative rounded-3xl bg-gradient-to-tr from-indigo-950 via-zinc-900 to-purple-950 border border-indigo-500/30 p-8 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Implementación en 5 minutos</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Cada minuto que tardas en responder un chat es una venta que se lleva tu competencia.
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Activa hoy a tu vendedor virtual con IA. Responde dudas al instante, muestra tu catálogo en carrusel y recibe pedidos cerrados directamente en tu WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 group"
          >
            <span>Comenzar Ahora</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-black/50 hover:bg-black/80 text-zinc-200 font-bold text-sm border border-white/10 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Probar Asesor en Vivo</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-6 text-[11px] text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sin tarjeta requerida</span>
          <span>•</span>
          <span>Sin contratos forzosos</span>
        </div>
      </div>
    </section>
  );
};

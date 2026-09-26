import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingCTAProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
  onOpenLogin?: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({
  onOpenDemo,
  onGoToDashboard,
  onOpenLogin
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-18">
      <div className="relative rounded-3xl bg-[#181716] border border-[#3d372e] text-[#fbfaf8] shadow-[0_24px_64px_rgba(20,18,15,0.15)] p-9 sm:p-16 text-center space-y-7 overflow-hidden">
        {/* Ambient champagne glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a365]/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a2620] text-[#dfc18b] border border-[#4a4233] text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-[#dfc18b]" />
          <span>Implementación en menos de 5 minutos</span>
        </div>

        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#fbfaf8] tracking-tight leading-tight max-w-3xl mx-auto">
          Cada minuto de demora en responder un chat es una venta que capitaliza la competencia.
        </h2>

        <p className="text-xs sm:text-sm text-[#b8b0a2] max-w-2xl mx-auto leading-relaxed font-light">
          Active hoy mismo su asesor comercial autónomo con IA. Despache dudas con precisión, exhiba su catálogo con elegancia y reciba órdenes cerradas en su WhatsApp oficial.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={onOpenLogin || onGoToDashboard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#dfc18b] hover:bg-[#caa461] text-[#161514] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 group"
          >
            <span>Iniciar Ahora</span>
            <ArrowRight className="w-4 h-4 text-[#161514] group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-[#e8e4dc] font-semibold text-xs uppercase tracking-wider border border-[#4a443a] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#dfc18b]" />
            <span>Probar Demostración</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-6 text-[11px] text-[#8f8677] font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#194c37]" /> Sin tarjeta de crédito requerida</span>
          <span>•</span>
          <span>Sin contratos forzosos</span>
        </div>
      </div>
    </section>
  );
};

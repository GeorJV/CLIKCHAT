import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Moon, MessageSquare, ShoppingBag } from 'lucide-react';

interface LandingHeroProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenDemo,
  onGoToDashboard,
  onOpenLogin,
  onOpenRegister
}) => {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 md:pt-22 md:pb-26 px-4 sm:px-6">
      {/* Subtle warm champagne radial illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[#e8dac1]/30 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
        
        {/* Prestige Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#f4efe4] border border-[#dfd3bc] text-[#6d532a] text-xs shadow-sm">
          <Moon className="w-3.5 h-3.5 text-[#b58c42] fill-[#b58c42]/20" />
          <span className="font-bold text-[#2e261a]">Atención Nocturna 24/7</span>
          <span className="text-[#c2b49c]">•</span>
          <span className="text-[#194c37] font-extrabold">$0 Comisiones a Meta</span>
          <span className="text-[#c2b49c]">•</span>
          <span className="text-[#7d7363] hidden sm:inline">Sin costo por mensaje</span>
        </div>

        {/* Headline with Cinzel Typography */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-[#181716] tracking-tight leading-[1.15]">
          Tu mejor vendedor trabaja 24/7 y <br className="hidden sm:inline" />
          <span className="text-[#99763d] font-bold">
            cierra ventas mientras duermes.
          </span>
        </h1>

        {/* Subtitle with refined editorial cadence */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#5a544a] leading-relaxed font-light">
          Convierte visitantes indecisos en compradores leales. Asesor comercial con Inteligencia Artificial que despliega tu catálogo visual, agenda citas, resuelve dudas con datos verificados y envía pedidos calificados directo a tu WhatsApp.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#181716] hover:bg-[#2c2824] font-semibold text-xs tracking-wider uppercase text-[#fbfaf8] shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2.5 cursor-pointer transition active:scale-95 group border border-[#2b2722]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Probar Asesor en Vivo</span>
            <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={onOpenRegister || onGoToDashboard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f6f2e9] text-[#2c2720] font-semibold text-xs tracking-wider uppercase border border-[#d6cfc2] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Comenzar Gratis / Crear Cuenta</span>
          </button>
        </div>

        {/* Micro-trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-9 pt-4 text-xs font-medium text-[#635c52]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1b533d]" />
            <span>Sin configuraciones engorrosas de Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#9c783c]" />
            <span>Respuestas precisas en &lt;2 segundos</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2e2b26]" />
            <span>Cierre directo a tu teléfono</span>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Moon, MessageSquare, ShoppingBag } from 'lucide-react';

interface LandingHeroProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenDemo,
  onGoToDashboard
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Anti-Meta API & 24/7 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs shadow-sm">
          <Moon className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span className="font-bold text-slate-900">Vende a las 2 AM</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">$0 API de Meta</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 hidden sm:inline">Sin cobro por mensaje</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
          Tu mejor vendedor ahora trabaja 24/7 y <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
            cierra ventas mientras duermes.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
          Convierte visitantes indecisos en compradores listos para pagar. Muestra tu catálogo visual con fotos interactivas, agenda citas, responde dudas al instante y envía clientes calificados directo a tu WhatsApp, sin intermediarios ni tarifas abusivas de Meta.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Probar Asesor en Vivo Ahora</span>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <span>Entrar al Panel de Tienda</span>
          </button>
        </div>

        {/* Trust bullets */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cero enredos con WhatsApp Business API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Respuestas en &lt;2 segundos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Cierre directo a tu teléfono</span>
          </div>
        </div>

      </div>
    </section>
  );
};

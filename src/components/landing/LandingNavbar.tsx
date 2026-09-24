import React, { useState } from 'react';
import { Bot, Sparkles, Menu, X } from 'lucide-react';

interface LandingNavbarProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
  onGoToAdmin: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenDemo,
  onGoToDashboard,
  onGoToAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              ClikChat
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                AI Sales
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">Asesor Comercial 24/7</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
          <button onClick={() => scrollTo('para-quien')} className="hover:text-indigo-600 transition cursor-pointer">¿Para quién es?</button>
          <button onClick={() => scrollTo('capacidades')} className="hover:text-indigo-600 transition cursor-pointer">Capacidades</button>
          <button onClick={() => scrollTo('autoaprendizaje')} className="hover:text-indigo-600 transition cursor-pointer">Auto-Aprendizaje</button>
          <button onClick={() => scrollTo('metricas')} className="hover:text-indigo-600 transition cursor-pointer">Métricas por Clic</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-indigo-600 transition cursor-pointer">Preguntas</button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onGoToDashboard}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            Panel de Tienda
          </button>
          <button
            onClick={onOpenDemo}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Probar Demo</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <button onClick={() => scrollTo('para-quien')} className="block w-full text-left text-sm font-semibold text-slate-700 py-1.5">¿Para quién es?</button>
          <button onClick={() => scrollTo('capacidades')} className="block w-full text-left text-sm font-semibold text-slate-700 py-1.5">Capacidades</button>
          <button onClick={() => scrollTo('autoaprendizaje')} className="block w-full text-left text-sm font-semibold text-slate-700 py-1.5">Auto-Aprendizaje</button>
          <button onClick={() => scrollTo('metricas')} className="block w-full text-left text-sm font-semibold text-slate-700 py-1.5">Métricas por Clic</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm font-semibold text-slate-700 py-1.5">Preguntas Frecuentes</button>
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-200">
            <button onClick={onGoToDashboard} className="w-full py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl text-center">Panel de Tienda</button>
            <button onClick={onOpenDemo} className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl text-center shadow-md">Probar Demo en Vivo</button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { Sparkles, Menu, X, Gem, LogIn } from 'lucide-react';

interface LandingNavbarProps {
  onOpenDemo: () => void;
  onGoToDashboard: () => void;
  onGoToAdmin: () => void;
  onOpenLogin?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenDemo,
  onGoToDashboard,
  onGoToAdmin,
  onOpenLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbfaf8]/90 backdrop-blur-xl border-b border-[#e9e5dc] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Monogram */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-[#181716] flex items-center justify-center text-[#dfc18b] shadow-md border border-[#38332c] ring-1 ring-black/5">
            <Gem className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-bold text-base tracking-[0.06em] text-[#181716] flex items-center gap-2">
              CLIKCHAT
              <span className="text-[8px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#f4efe4] text-[#8c6b38] border border-[#e2d5bd] tracking-widest">
                CONCIERGE
              </span>
            </span>
            <span className="text-[10px] text-[#7d756b] font-normal tracking-wide">Arquitectura Comercial con IA</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-[#5c564e] tracking-wide">
          <button onClick={() => scrollTo('para-quien')} className="hover:text-[#181716] transition cursor-pointer">Propuesta</button>
          <button onClick={() => scrollTo('capacidades')} className="hover:text-[#181716] transition cursor-pointer">Capacidades</button>
          <button onClick={() => scrollTo('autoaprendizaje')} className="hover:text-[#181716] transition cursor-pointer">Auto-Aprendizaje</button>
          <button onClick={() => scrollTo('metricas')} className="hover:text-[#181716] transition cursor-pointer">Métricas por Clic</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-[#181716] transition cursor-pointer">Preguntas</button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            onClick={onOpenLogin || onGoToDashboard}
            className="px-4 py-2.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition rounded-xl border border-emerald-300/80 bg-emerald-50/80 hover:bg-emerald-100/90 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-700" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            onClick={onGoToDashboard}
            className="px-3.5 py-2.5 text-xs font-semibold text-[#2c2824] hover:text-black transition rounded-xl border border-[#dcd6cb] hover:bg-[#f2eee5] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            Mi Negocio
          </button>
          <button
            onClick={onOpenDemo}
            className="px-4 py-2.5 text-xs font-bold text-[#fbfaf8] bg-[#181716] hover:bg-[#2c2925] border border-[#2e2a25] transition rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Probar Demostración</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#5c564e] hover:text-[#181716] rounded-xl border border-[#e2ddd4] cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fbfaf8] border-b border-[#e9e5dc] px-5 py-5 space-y-3.5 shadow-xl animate-fadeIn">
          <button onClick={() => scrollTo('para-quien')} className="block w-full text-left text-sm font-medium text-[#2c2824] py-1">Propuesta</button>
          <button onClick={() => scrollTo('capacidades')} className="block w-full text-left text-sm font-medium text-[#2c2824] py-1">Capacidades</button>
          <button onClick={() => scrollTo('autoaprendizaje')} className="block w-full text-left text-sm font-medium text-[#2c2824] py-1">Auto-Aprendizaje</button>
          <button onClick={() => scrollTo('metricas')} className="block w-full text-left text-sm font-medium text-[#2c2824] py-1">Métricas por Clic</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm font-medium text-[#2c2824] py-1">Preguntas Frecuentes</button>
          <div className="pt-3 flex flex-col gap-2 border-t border-[#e2ddd4]">
            <button
              onClick={() => { setMobileMenuOpen(false); (onOpenLogin || onGoToDashboard)(); }}
              className="w-full py-2.5 text-xs font-bold text-emerald-900 border border-emerald-300 rounded-xl text-center bg-emerald-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-700" />
              <span>Iniciar Sesión</span>
            </button>
            <button onClick={onGoToDashboard} className="w-full py-2.5 text-xs font-semibold text-[#2c2824] border border-[#dcd6cb] rounded-xl text-center bg-white cursor-pointer">Mi Negocio</button>
            <button onClick={onOpenDemo} className="w-full py-2.5 text-xs font-bold text-white bg-[#181716] rounded-xl text-center shadow-md cursor-pointer">Probar Demostración</button>
          </div>
        </div>
      )}
    </header>
  );
};

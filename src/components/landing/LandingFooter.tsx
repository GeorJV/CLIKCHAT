import React from 'react';
import { ShieldCheck, Gem } from 'lucide-react';

interface LandingFooterProps {
  onGoToDashboard: () => void;
  onGoToAdmin: () => void;
  onOpenDemo: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onGoToDashboard,
  onGoToAdmin,
  onOpenDemo
}) => {
  return (
    <footer className="w-full bg-[#f4efe6] border-t border-[#e2dacf] py-14 px-4 sm:px-6 text-[#635c52] text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#181716] border border-[#38332c] flex items-center justify-center text-[#dfc18b] shadow-sm">
            <Gem className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-sm text-[#181716] tracking-wider">CLIKCHAT</span>
            <p className="text-[11px] text-[#787166]">Infraestructura de Conversión Comercial con Inteligencia Artificial</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-7 font-medium tracking-wide">
          <button onClick={onOpenDemo} className="hover:text-[#181716] transition cursor-pointer">Demostración</button>
          <button onClick={onGoToDashboard} className="hover:text-[#181716] transition cursor-pointer">Panel de Tienda</button>
          <button onClick={onGoToAdmin} className="hover:text-[#181716] transition cursor-pointer">Super Admin</button>
          <a href="https://wa.me/50688888888?text=Hola,%20deseo%20informacion%20de%20ClikChat" target="_blank" rel="noreferrer" className="text-[#194c37] hover:underline transition font-semibold">
            Canal WhatsApp
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#7d7568] text-center md:text-right">
          <p>© {new Date().getFullYear()} ClikChat Concierge. Diseñado por GeoSoft.</p>
          <p className="flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#194c37]" /> Arquitectura Cloudflare Edge & D1
          </p>
        </div>

      </div>
    </footer>
  );
};

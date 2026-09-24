import React from 'react';
import { Bot, ShieldCheck, Heart } from 'lucide-react';

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
    <footer className="w-full bg-[#070709] border-t border-white/[0.06] py-12 px-4 sm:px-6 text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">ClikChat</span>
            <p className="text-[11px] text-zinc-500">Plataforma SaaS de Asistencia Comercial con IA</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
          <button onClick={onOpenDemo} className="hover:text-white transition cursor-pointer">Demo en Vivo</button>
          <button onClick={onGoToDashboard} className="hover:text-white transition cursor-pointer">Panel de Tienda</button>
          <button onClick={onGoToAdmin} className="hover:text-white transition cursor-pointer">Super Admin</button>
          <a href="https://wa.me/50688888888?text=Hola,%20deseo%20informacion%20de%20ClikChat" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition">
            Contacto WhatsApp
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-zinc-500 text-center md:text-right">
          <p>© {new Date().getFullYear()} ClikChat. Desarrollado por GeoSoft.</p>
          <p className="flex items-center justify-center md:justify-end gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Infraestructura Cloudflare Edge & D1
          </p>
        </div>

      </div>
    </footer>
  );
};

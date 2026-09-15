import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Calendar, ChevronLeft, ChevronRight, Maximize2, Star, Clock, Globe } from 'lucide-react';
import { ServiceItem } from '../../../types/serviceChat';

interface Props {
  service: ServiceItem;
  onOpenIncludes: () => void;
  onOpenRequirements: () => void;
  onOpenFullscreen: () => void;
  onBookNow: () => void;
}

export const ServiceShowcase: React.FC<Props> = ({
  service, onOpenIncludes, onOpenRequirements, onOpenFullscreen, onBookNow,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = (service.images && service.images.length > 0 ? service.images : [service.image]).filter(Boolean);

  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="flex flex-col h-full bg-[#131212] overflow-hidden relative min-h-0 select-none">
      <div className="flex-1 flex flex-col px-3 pt-3 pb-3 overflow-hidden min-h-0">
        {/* Showcase Image Container */}
        <div className="flex-1 w-full relative rounded-2xl overflow-hidden border border-[#262424] bg-[#111010] shadow-2xl group min-h-0">
          <img
            src={images[currentImageIndex] || service.image}
            alt={service.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          />

          {/* Photo Top Overlay (Cobertura Superior) */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent h-24 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
              Sesión 1 a 1 VIP
            </span>
            <span className="bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              {service.serviceModality === 'presencial' ? 'En Cabina' : 'Meet / Zoom'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenFullscreen}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition active:scale-95 shadow-md cursor-pointer z-10"
            title="Ampliar vista del servicio"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {images.length > 1 && (
            <>
              <button type="button" onClick={handlePrev} className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleNext} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition active:scale-90 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Overlay on Image */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight truncate drop-shadow-sm">{service.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" />{service.rating || 4.9} (Reseñas)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-300"><Clock className="w-3.5 h-3.5 text-emerald-400" />{service.duration || '45 min'}</span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-1 shrink-0 bg-black/50 px-2 py-1 rounded-full border border-white/10">
                  {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setCurrentImageIndex(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === currentImageIndex ? 'bg-emerald-400 w-3' : 'bg-zinc-600 w-1.5'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Inquiry Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 shrink-0">
          <button type="button" onClick={onOpenIncludes} className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold transition text-zinc-300 hover:text-white hover:bg-white/[0.04] cursor-pointer active:scale-98">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /><span className="truncate">¿Qué incluye?</span>
          </button>
          <button type="button" onClick={onOpenRequirements} className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold transition text-zinc-300 hover:text-white hover:bg-white/[0.04] cursor-pointer active:scale-98">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /><span className="truncate">Garantía</span>
          </button>
        </div>

        {/* Primary Booking Button: Difuminado verde */}
        <div className="mt-2.5 shrink-0">
          <button
            type="button"
            onClick={onBookNow}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 border border-emerald-400/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';

export interface ToneOption {
  id: string;
  label: string;
  desc: string;
  emoji: string;
}

export const TOP_COMMUNICATION_TONES: ToneOption[] = [
  { id: 'cercano_empatico', label: 'Cercano y Empático', desc: 'Calidez humana, cercanía y trato amigable estilo WhatsApp', emoji: '🤝' },
  { id: 'vendedor_persuasivo', label: 'Vendedor Persuasivo', desc: 'Enfocado en resaltar beneficios y cerrar ventas', emoji: '🎯' },
  { id: 'profesional_cortes', label: 'Profesional y Cortés', desc: 'Formalidad corporativa, seriedad y máximo respeto', emoji: '👔' },
  { id: 'directo_eficiente', label: 'Directo y Eficiente', desc: 'Respuestas breves, precisas y al grano sin rodeos', emoji: '⚡' },
  { id: 'entusiasta_dinamico', label: 'Entusiasta y Alegre', desc: 'Energía alta, buena vibra y emojis entusiastas', emoji: '🌟' },
  { id: 'resolutivo_servicial', label: 'Resolutivo y Servicial', desc: 'Paciencia, soporte al cliente y solución de objeciones', emoji: '🛡️' },
  { id: 'sugestivo_gastronomico', label: 'Gastronómico y Sugestivo', desc: 'Descripciones apetitosas de comida y venta cruzada', emoji: '🍽️' },
];

interface ToneMultiSelectDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

export const ToneMultiSelectDropdown: React.FC<ToneMultiSelectDropdownProps> = ({
  value,
  onChange,
  label = 'Tono de Comunicación'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determinar qué tonos están seleccionados basados en el string de texto
  const isSelected = (toneLabel: string) => {
    if (!value) return false;
    const normVal = value.toLowerCase();
    const normLabel = toneLabel.toLowerCase();
    return normVal.includes(normLabel);
  };

  const selectedCount = TOP_COMMUNICATION_TONES.filter(t => isSelected(t.label)).length;

  const toggleTone = (toneLabel: string) => {
    const activeTones = TOP_COMMUNICATION_TONES.filter(t => isSelected(t.label)).map(t => t.label);
    let nextTones: string[];

    if (activeTones.includes(toneLabel)) {
      nextTones = activeTones.filter(t => t !== toneLabel);
    } else {
      nextTones = [...activeTones, toneLabel];
    }

    if (nextTones.length === 0) {
      onChange('Cercano y Empático');
    } else {
      onChange(nextTones.join(' + '));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#42506b] mb-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#0d5bff]" /> {label}
          <span className="text-[10px] text-[#8391aa] font-normal">(Combina 2 o más)</span>
        </label>
      )}

      {/* Botón Disparador del Desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2.5 text-xs text-[#0a1730] hover:bg-white hover:border-[#0d5bff] focus:border-[#0d5bff] focus:bg-white transition cursor-pointer text-left shadow-xs"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-[#0d5bff]">
            {selectedCount > 0 ? `(${selectedCount})` : ''}
          </span>
          <span className="truncate font-medium">
            {value || 'Selecciona uno o combina varios tonos...'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#62728d] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel Desplegable con Checkboxes */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border border-[#d8e2f0] bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          <div className="px-2 pb-2 mb-1 border-b border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8391aa]">
              Los 7 Mejores Modos de Comunicación
            </span>
            <span className="text-[10.5px] text-[#0d5bff] font-bold">
              {selectedCount} seleccionados
            </span>
          </div>

          <div className="space-y-1">
            {TOP_COMMUNICATION_TONES.map((t) => {
              const active = isSelected(t.label);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTone(t.label)}
                  className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition select-none ${
                    active ? 'bg-[#ebf1ff]/80 text-[#0a1730]' : 'hover:bg-[#f8fafc] text-[#42506b]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {}} // Manejado por onClick del div
                    className="mt-0.5 h-4 w-4 rounded border-[#d8e2f0] text-[#0d5bff] focus:ring-[#0d5bff] cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{t.emoji}</span>
                      <h4 className="text-xs font-bold leading-tight">{t.label}</h4>
                      {active && <Check className="h-3 w-3 text-[#0d5bff] ml-auto shrink-0" />}
                    </div>
                    <p className="text-[10.5px] text-[#8391aa] leading-tight mt-0.5">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-[#f1f5f9] flex items-center justify-between px-1">
            <span className="text-[10px] text-[#8391aa]">
              💡 Tip: Combinar 2 tonos (ej: Empático + Ventas) optimiza la conversión.
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-[#0d5bff] text-white rounded-lg text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

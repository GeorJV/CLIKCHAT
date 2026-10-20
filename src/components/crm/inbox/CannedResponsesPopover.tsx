import React from 'react';
import { Sparkles, CreditCard, Clock, ShoppingBag, Truck, CheckCircle } from 'lucide-react';

export interface CannedResponse {
  shortcut: string;
  label: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DEFAULT_CANNED_RESPONSES: CannedResponse[] = [
  {
    shortcut: '/sinpe',
    label: 'Pago SINPE Móvil',
    text: 'Puedes realizar tu pago vía SINPE Móvil a nuestro número oficial. Envíanos el comprobante por aquí para despachar tu pedido al instante.',
    icon: CreditCard
  },
  {
    shortcut: '/horario',
    label: 'Horario Comercial',
    text: 'Nuestro horario de atención es de Lunes a Sábado de 8:00 AM a 7:00 PM. ¡Con gusto te atendemos!',
    icon: Clock
  },
  {
    shortcut: '/catalogo',
    label: 'Catálogo Oficial',
    text: 'Puedes explorar nuestro catálogo oficial con fotos, opciones y precios en tiempo real desde nuestro chat.',
    icon: ShoppingBag
  },
  {
    shortcut: '/express',
    label: 'Envío Express / Despacho',
    text: 'Contamos con servicio de entrega express a tu ubicación. Te confirmamos el costo al enviarnos tu dirección o ubicación.',
    icon: Truck
  },
  {
    shortcut: '/comanda',
    label: 'Comanda en Preparación',
    text: '¡Tu orden está confirmada! Ya entró a preparación en cocina y te avisaremos tan pronto el repartidor vaya en camino.',
    icon: CheckCircle
  }
];

interface Props {
  filter: string;
  onSelect: (text: string) => void;
  onClose: () => void;
}

export const CannedResponsesPopover: React.FC<Props> = ({ filter, onSelect, onClose }) => {
  const query = filter.toLowerCase().replace('/', '');
  const items = DEFAULT_CANNED_RESPONSES.filter(
    (c) => c.shortcut.includes(query) || c.label.toLowerCase().includes(query)
  );

  if (items.length === 0) return null;

  return (
    <div className="absolute bottom-full left-4 mb-2 w-80 rounded-2xl border border-[#d8e2f0] bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#f1f5f9] mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8391aa] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#0d5bff]" /> Atajos Rápidos (Tidio / Zolutium)
        </span>
        <button type="button" onClick={onClose} className="text-[10px] text-[#8391aa] hover:text-[#0a1730]">✕</button>
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.shortcut}
              type="button"
              onClick={() => onSelect(item.text)}
              className="w-full text-left p-2 rounded-xl hover:bg-[#f6f8fc] transition flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#0d5bff] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0d5bff] group-hover:text-white transition">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0a1730] truncate">{item.label}</span>
                  <span className="font-mono text-[10px] font-bold text-[#0d5bff] bg-blue-50 px-1.5 py-0.2 rounded-md">{item.shortcut}</span>
                </div>
                <p className="text-[11px] text-[#62728d] truncate mt-0.5">{item.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

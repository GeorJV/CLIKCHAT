import React from 'react';
import { Tenant, Product } from '../../types';

interface ChatQuickPillsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
  tenant?: Tenant | null;
  products?: Product[];
}

export const ChatQuickPills: React.FC<ChatQuickPillsProps> = ({
  onSelectPrompt,
  disabled = false,
  tenant,
  products = []
}) => {
  const isRestaurant = tenant?.business_type === 'restaurante';
  const isService = tenant?.business_type === 'servicios';

  const prompts = React.useMemo(() => {
    const list: Array<{ label: string; text: string }> = [];

    if (isRestaurant) {
      list.push({ label: '📋 Ver Menú', text: '¿Cuáles son las opciones del menú que tienen hoy?' });
      if (products.length > 0 && products[0]?.name) {
        list.push({ label: `⭐ ${products[0].name}`, text: `¿Qué precio y detalles tiene ${products[0].name}?` });
      }
      list.push({ label: '🛵 Pedir a Domicilio', text: '¿Hacen entregas a domicilio y cuál es el tiempo estimado?' });
      list.push({ label: '💳 Métodos de Pago', text: '¿Cuáles son los métodos de pago aceptados?' });
      list.push({ label: '📍 Horario de Atención', text: '¿Cuál es el horario de atención del restaurante?' });
    } else if (isService) {
      list.push({ label: '📅 Agendar Cita', text: 'Deseo consultar disponibilidad para agendar una cita' });
      list.push({ label: '💼 Servicios y Tarifas', text: '¿Cuáles son los servicios disponibles y sus precios?' });
      list.push({ label: '💳 Formas de Pago', text: '¿Cuáles son las formas de pago aceptadas?' });
      list.push({ label: '📍 Horario y Ubicación', text: '¿Dónde están ubicados y cuál es el horario de atención?' });
    } else {
      list.push({ label: '🛍️ Ver Catálogo', text: '¿Cuáles son los productos principales del catálogo?' });
      if (products.length > 0 && products[0]?.name) {
        list.push({ label: `⭐ ${products[0].name}`, text: `Háblame de ${products[0].name}` });
      }
      list.push({ label: '🚚 Envíos y Costos', text: '¿Cuánto tarda el envío y cuál es el costo?' });
      list.push({ label: '💳 Métodos de Pago', text: '¿Cuáles son los métodos de pago aceptados?' });
      list.push({ label: '🛡️ Garantía Oficial', text: '¿Qué garantía tienen los productos?' });
    }

    return list;
  }, [isRestaurant, isService, products]);
  return (
    <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto flex space-x-2 scrollbar-none">
      {prompts.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(p.text)}
          disabled={disabled}
          className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-40"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

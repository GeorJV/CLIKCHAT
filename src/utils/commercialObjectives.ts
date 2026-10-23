export interface CommercialObjective {
  id: string;
  title: string;
  description: string;
  tag: string;
  iconName: 'support' | 'sales' | 'leads' | 'bookings' | 'quotes' | 'retention';
  defaultEnabled: boolean;
  promptInstruction: string;
}

export const COMMERCIAL_OBJECTIVES: CommercialObjective[] = [
  {
    id: 'support',
    title: 'Atención al Cliente & FAQs',
    description: 'Resuelve dudas 24/7 sobre horarios, ubicación, métodos de pago y políticas de servicio con RAG Nivel 2.',
    tag: 'Soporte 24/7',
    iconName: 'support',
    defaultEnabled: true,
    promptInstruction: 'OBJETIVO ATENCIÓN: Responde preguntas sobre horarios, políticas y servicios basándote en la base de conocimiento oficial.',
  },
  {
    id: 'sales',
    title: 'Venta Activa & Recomendación de Catálogo',
    description: 'Recomienda productos, destaca beneficios, muestra precios y acompaña al cliente hasta armar su comanda o carrito.',
    tag: 'Conversión',
    iconName: 'sales',
    defaultEnabled: true,
    promptInstruction: 'OBJETIVO VENTAS: Recomienda activamente productos del catálogo, explica sus beneficios y guía al cliente hacia la compra.',
  },
  {
    id: 'leads',
    title: 'Calificación de Prospectos (Lead Scoring)',
    description: 'Pregunta sutilmente necesidades, presupuesto y nivel de urgencia para clasificar leads fríos, tibios o calientes.',
    tag: 'Scoring',
    iconName: 'leads',
    defaultEnabled: true,
    promptInstruction: 'OBJETIVO CALIFICACIÓN: Identifica qué busca el cliente, su presupuesto estimado y urgencia para perfilar su interés comercial.',
  },
  {
    id: 'bookings',
    title: 'Agendamiento de Citas & Reservas',
    description: 'Consulta disponibilidad, horarios, solicita datos del interesado y agenda turnos o citas sin duplicidades.',
    tag: 'Agenda',
    iconName: 'bookings',
    defaultEnabled: false,
    promptInstruction: 'OBJETIVO CITAS: Cuando el cliente quiera agendar o reservar, recopila nombre, día y hora deseada para registrar la cita.',
  },
  {
    id: 'quotes',
    title: 'Cotizaciones Personalizadas',
    description: 'Recopila requerimientos específicos (medidas, cantidades, modelos) para preparar una cotización precisa.',
    tag: 'B2B & Servicios',
    iconName: 'quotes',
    defaultEnabled: false,
    promptInstruction: 'OBJETIVO COTIZACIONES: Solicita los requerimientos específicos antes de cotizar y desglosa precios autorizados.',
  },
  {
    id: 'retention',
    title: 'Seguimiento & Cierre Directo',
    description: 'Resuelve objeciones, recupera interesados indecisos y transfiere la comanda terminada al canal de WhatsApp.',
    tag: 'Cierre',
    iconName: 'retention',
    defaultEnabled: true,
    promptInstruction: 'OBJETIVO CIERRE: Supera dudas finales con empatía y facilita el enlace o transferencia a WhatsApp para concluir el pago.',
  },
];

export function parseCommercialObjectives(raw?: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'string') {
    return COMMERCIAL_OBJECTIVES.filter((o) => o.defaultEnabled).map((o) => o.id);
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // CSV fallback
    const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (items.length > 0) return items;
  }
  return COMMERCIAL_OBJECTIVES.filter((o) => o.defaultEnabled).map((o) => o.id);
}

export function buildObjectivesPromptSnippet(selectedIds: string[]): string {
  const active = COMMERCIAL_OBJECTIVES.filter((o) => selectedIds.includes(o.id));
  if (active.length === 0) return '';
  return `### DIRECTIVAS COMERCIALES ACTIVAS:\n${active.map((o) => `- ${o.promptInstruction}`).join('\n')}`;
}

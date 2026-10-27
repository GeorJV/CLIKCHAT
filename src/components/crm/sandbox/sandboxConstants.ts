export interface SandboxMsg {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  rag?: string;
  score?: number;
  isGolden?: boolean;
  modelUsed?: string;
  fallbackUsed?: boolean;
}

export const PERSONAS = [
  { label: '🛍️ Decidido', text: 'Hola, quiero comprar ya mismo. Cómo puedo pagar y cuándo me lo envían?' },
  { label: '🏷️ Precios', text: 'Hola, cuánto cuesta lo más vendido y qué ofertas tienen hoy?' },
  { label: '😡 Molesto', text: 'Llevo esperando mi pedido y nadie me contesta, exijo una solución.' },
  { label: '🙋 Pide Humano', text: 'Hola, no quiero hablar con un bot, pásame con un asesor real por favor.' },
  { label: '❓ Fuera de Menú', text: 'Ustedes también venden repuestos de autos y hacen envíos a México?' },
  { label: '📱 Informal', text: 'ke onda bro si benden comida todavia o ya cerraron?' },
];

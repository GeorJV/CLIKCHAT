import { UtensilsCrossed, ShoppingBag, Calendar, Sparkles, TrendingUp, Zap, Receipt, LucideIcon } from 'lucide-react';

export interface BusinessSkill {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface BusinessEngineConfig {
  badge: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  skills: BusinessSkill[];
}

export const PROVIDER_MODELS: Record<string, string[]> = {
  openrouter: ['deepseek/deepseek-chat', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct', 'google/gemini-2.0-flash-001', 'custom'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'custom'],
  google: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'custom'],
  groq: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'custom'],
};

export const getBusinessEngineConfig = (businessType?: string): BusinessEngineConfig => {
  const isRestaurant = !businessType || businessType === 'restaurante';
  const isServices = businessType === 'servicios';

  if (isRestaurant) {
    return {
      badge: 'Motor Gastronómico de Ventas: ACTIVO',
      icon: UtensilsCrossed,
      title: 'Especialista Gastronómico, Mesera Pro & Copywriting',
      desc: 'Calibrado para hospitalidad, venta sugestiva (upselling), cálculo de comanda y atención rápida de comensales.',
      skills: [
        { icon: Sparkles, title: 'Copywriting Apetitoso', text: 'Describe platillos, combos e ingredientes con lenguaje persuasivo y tentador.' },
        { icon: TrendingUp, title: 'Venta Cruzada Proactiva', text: 'Sugiere acompañamientos y bebidas para elevar el ticket promedio.' },
        { icon: Receipt, title: 'Gestor de Comandas & Cuenta', text: 'Suma y calcula dinámicamente la cuenta del cliente en tiempo real.' },
        { icon: Zap, title: 'Velocidad en Hora Pico (<1s)', text: 'Respuestas instantáneas y naturales sin saturaciones.' }
      ]
    };
  }

  if (isServices) {
    return {
      badge: 'Motor de Agendamiento & Servicios: ACTIVO',
      icon: Calendar,
      title: 'Especialista en Agendamiento, Citas & Calificación',
      desc: 'Calibrado para filtrado de prospectos, resolución de dudas y reserva guiada de citas.',
      skills: [
        { icon: Sparkles, title: 'Calificación de Prospectos', text: 'Identifica necesidades y perfila clientes potenciales para tu consulta.' },
        { icon: TrendingUp, title: 'Explicación de Procedimientos', text: 'Resuelve dudas sobre sesiones, duración, requisitos y valor del servicio.' },
        { icon: Receipt, title: 'Agendamiento Asistido', text: 'Coordina horarios y captura datos de contacto directamente al WhatsApp.' },
        { icon: Zap, title: 'Disponibilidad Continua', text: 'Atención 24/7 sin perder solicitudes fuera de horario de oficina.' }
      ]
    };
  }

  return {
    badge: 'Motor Retail & Catálogo: ACTIVO',
    icon: ShoppingBag,
    title: 'Especialista en Ventas de Catálogo & Comercio',
    desc: 'Calibrado para recomendación de inventario, resolución de dudas y cierre ágil de ventas.',
    skills: [
      { icon: Sparkles, title: 'Recomendación Inteligente', text: 'Sugiere productos basados en preferencias, talla o presupuesto del cliente.' },
      { icon: TrendingUp, title: 'Manejo de Objeciones', text: 'Resuelve dudas de envíos, métodos de pago y garantías con seguridad.' },
      { icon: Receipt, title: 'Cierre Directo de Compra', text: 'Guía al cliente al botón de compra o enlace de checkout directo.' },
      { icon: Zap, title: 'Atención Simultánea 24/7', text: 'Capaz de atender cientos de clientes al mismo tiempo sin esperas.' }
    ]
  };
};

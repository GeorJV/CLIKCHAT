import { Product } from '../../../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_1789447247688',
    tenant_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Vendedor Online',
    slug: 'vendedor-online',
    price: 49.00,
    currency: 'USD',
    short_description: 'Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio con un asistente virtual impulsado por Inteligencia Artificial.',
    full_description: 'Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio con un asistente virtual impulsado por Inteligencia Artificial. Este chatbot está diseñado para entender el contexto, responder consultas frecuentes al instante (24/7) y guiar a tus clientes hacia la compra o reserva.',
    images: ['https://ai.cornell.edu/wp-content/uploads/robot-1280x720_0.jpg'],
    benefits: [
      'Atención al cliente inmediata y disponible 24/7',
      'Reducción de hasta un 80% en los tiempos de respuesta',
      'Captación y calificación de clientes potenciales en piloto automático'
    ],
    details: { category: 'General', sku: 'SKU-093089' },
    cta_label: 'Comprar Ahora',
    cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20Vendedor%20Online',
    is_active: true
  }
];

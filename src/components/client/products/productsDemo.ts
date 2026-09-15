import { Product } from '../../../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_vendedor_ai',
    tenant_id: 'tenant-demo',
    name: 'Vendedor de AI Online',
    slug: 'vendedor-de-ai-online',
    price: 25.00,
    currency: 'USD',
    short_description: 'Transforma tu negocio con un chatbot inteligente y vendedor de IA online disponible 24/7.',
    full_description: 'Transforma tu negocio con un chatbot inteligente y vendedor de IA online. Automatiza la atención al cliente, califica leads y aumenta las ventas con un asistente virtual 24/7.',
    images: ['/images/vendedor-ai-robot.jpeg'],
    benefits: ['Disponibilidad 24/7', 'Respuestas Instantáneas', 'Reduce Costos Operativos'],
    details: { category: 'Software & Inteligencia Artificial', sku: 'SKU-BOT-01' },
    cta_label: 'Comprar Ahora',
    cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20el%20Vendedor%20de%20AI%20Online',
    is_active: true
  },
  {
    id: 'prod_1788982904609',
    tenant_id: 'tenant-demo',
    name: 'ZAPATO FORMAL',
    slug: 'zapato-formal',
    price: 19.00,
    currency: 'USD',
    short_description: 'Cuero genuino de alta durabilidad con suela antideslizante para eventos formales y oficina.',
    full_description: 'Producto registrado durante la configuración de la tienda ZAPATOS 21.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'],
    benefits: ['100% Cuero Genuino', 'Suela Confort', 'Elegancia Clásica'],
    details: { category: 'Calzado', sku: 'SKU-ZAP-02' },
    cta_label: 'Comprar Ahora',
    cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20el%20Zapato%20Formal',
    is_active: true
  }
];

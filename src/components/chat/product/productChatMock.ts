import { ProductItem } from '../../../types/productChat';

export const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod_1789447247688',
  title: 'Vendedor Online',
  slug: 'vendedor-online',
  category: 'General',
  price: 49.00,
  currency: 'USD',
  stock: 25,
  inStock: true,
  image: 'https://ai.cornell.edu/wp-content/uploads/robot-1280x720_0.jpg',
  images: [
    'https://ai.cornell.edu/wp-content/uploads/robot-1280x720_0.jpg'
  ],
  benefits: [
    'Atención al cliente inmediata y disponible 24/7',
    'Reducción de hasta un 80% en los tiempos de respuesta',
    'Captación y calificación de clientes potenciales en piloto automático'
  ],
  description: 'Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio con un asistente virtual impulsado por Inteligencia Artificial. Respuestas precisas, naturales y disponibles 24/7.',
  specifications: {
    sku: 'SKU-093089',
    category: 'General',
    tecnologia: 'IA Generativa Avanzada & NLP',
    canales: 'Sitio Web, WhatsApp, Instagram'
  }
};

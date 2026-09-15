import { ProductItem } from '../../../types/productChat';

export const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod_vendedor_ai',
  title: 'Vendedor de AI Online',
  category: 'Software & Inteligencia Artificial',
  price: 25.00,
  originalPrice: 49.00,
  currency: 'USD',
  stock: 50,
  image: '/images/vendedor-ai-robot.jpeg',
  images: [
    '/images/vendedor-ai-robot.jpeg'
  ],
  benefits: [
    'Disponibilidad 24/7: Atención siempre activa, incluso fuera de horario.',
    'Respuestas instantáneas: Reduce el tiempo de espera para tus clientes.',
    'Mejora la satisfacción con experiencias personalizadas y reduce costos operativos.'
  ],
  description: 'Transforma tu negocio con un chatbot inteligente y vendedor de IA online disponible 24/7. Automatiza atención al cliente, califica leads y cierra ventas en piloto automático.'
};

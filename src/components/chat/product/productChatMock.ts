import { ProductItem } from '../../../types/productChat';

export const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod_default',
  title: 'Sérum Facial Rejuvenecedor con Ácido Hialurónico',
  category: 'Cuidado Facial',
  price: 29.99,
  originalPrice: 48.00,
  currency: 'USD',
  stock: 15,
  image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
  images: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597359-00f074a3f3b4?w=800&auto=format&fit=crop&q=80'
  ],
  benefits: [
    'Hidratación profunda 24h y restauración de la barrera cutánea.',
    'Fórmula hipoalergénica con triple peso molecular de ácido hialurónico.',
    'Resultados visibles de firmeza y luminosidad en 7 días.'
  ],
  description: 'Fórmula dermatológica concentrada diseñada para nutrir, rejuvenecer y proteger la piel.'
};

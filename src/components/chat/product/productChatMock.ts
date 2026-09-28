import { ProductItem } from '../../../types/productChat';

export const DEFAULT_PRODUCT: ProductItem = {
  id: 'prod_default_catalog',
  title: 'Catálogo Oficial',
  slug: 'catalogo-oficial',
  category: 'General',
  price: 0,
  currency: 'CRC',
  stock: 50,
  inStock: true,
  image: '',
  images: [],
  benefits: [
    'Atención al cliente inmediata y disponible 24/7',
    'Calidad garantizada y entregas directas',
    'Asesoría personalizada en tus pedidos'
  ],
  description: 'Explora nuestro catálogo oficial con asesoría virtual en tiempo real.',
  specifications: {
    sku: 'SKU-001',
    category: 'Catálogo General',
    atencion: 'Asesoría Virtual 24/7'
  }
};

import React, { useState } from 'react';
import { Product, Tenant } from '../../types';
import { ProductsHeader } from './products/ProductsHeader';
import { ProductsGlobalMetrics } from './products/ProductsGlobalMetrics';
import { ProductCard } from './products/ProductCard';
import { ProductModal } from './products/ProductModal';

interface ProductsManagerTabProps {
  products: Product[];
  tenantSlug?: string;
  tenant?: Tenant | null;
  onCreateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onUpdateProduct?: (id: string, updates: Partial<Product>) => Promise<boolean>;
  onDeleteProduct?: (id: string) => Promise<boolean>;
}

// Fallback demo products matching reference design if list is empty
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_demo_bot_49',
    tenant_id: 'tenant-demo',
    name: 'Chatbot con IA para Negocios',
    slug: 'chatbot-con-ia-para-negocios',
    price: 25.00,
    currency: 'USD',
    short_description: 'Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio con un asistente virtual impulsado por Inteligencia Artificial. Este asistente responde preguntas 24/7 sin descanso.',
    full_description: 'Automatiza la atención al cliente, califica leads y aumenta las ventas de tu negocio con un asistente virtual impulsado por Inteligencia Artificial.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
    benefits: ['Atención 24/7', 'Calificación de Leads', 'RAG Multi-Nivel'],
    details: { category: 'General', sku: '49' },
    cta_label: 'Comprar Ahora',
    cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20el%20Chatbot%20con%20IA',
    is_active: true
  },
  {
    id: 'prod_1788982904609',
    tenant_id: 'tenant-demo',
    name: 'ZAPATO FORMAL',
    slug: 'zapato-formal',
    price: 19.00,
    currency: 'USD',
    short_description: 'Producto registrado durante la configuración de la tienda ZAPATOS 21. Cuero genuino de alta durabilidad con suela antideslizante para eventos formales y oficina.',
    full_description: 'Producto registrado durante la configuración de la tienda ZAPATOS 21.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'],
    benefits: ['100% Cuero Genuino', 'Suela Confort Antideslizante', 'Elegancia Clásica'],
    details: { category: 'General', sku: 'SKU-prod_1788982904609' },
    cta_label: 'Comprar Ahora',
    cta_url: 'https://wa.me/50688888888?text=Hola,%20deseo%20el%20Zapato%20Formal',
    is_active: true
  }
];

export const ProductsManagerTab: React.FC<ProductsManagerTabProps> = ({
  products,
  tenantSlug = 'acme-store',
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const displayProducts = products && products.length > 0 ? products : DEMO_PRODUCTS;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto del catálogo?')) return;
    if (onDeleteProduct) {
      await onDeleteProduct(id);
    }
  };

  const handleModalSubmit = async (data: Partial<Product> & { name: string; price: number }) => {
    if (editingProduct && onUpdateProduct) {
      return await onUpdateProduct(editingProduct.id, data);
    } else {
      return await onCreateProduct(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Encabezado con Botón Verde '+ + Nuevo producto' */}
      <ProductsHeader onOpenCreate={handleOpenCreate} />

      {/* 2. Banner de Analítica Global & Temperatura de Venta */}
      <ProductsGlobalMetrics />

      {/* 3. Grid de Tarjetas de Productos & QLinks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            tenantSlug={tenantSlug}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 4. Modal para Crear / Editar Producto */}
      <ProductModal
        isOpen={modalOpen}
        productToEdit={editingProduct}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

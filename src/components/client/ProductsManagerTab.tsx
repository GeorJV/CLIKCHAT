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

import { DEMO_PRODUCTS } from './products/productsDemo';

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
    <div className="space-y-2.5">
      {/* 1. Encabezado con Botón Verde '+ Nuevo producto' al lado */}
      <ProductsHeader onOpenCreate={handleOpenCreate} tenantSlug={tenantSlug} />

      {/* 2. Banner de Analítica Global Compacto */}
      <ProductsGlobalMetrics />

      {/* 3. Grid de Tarjetas de Productos & QLinks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

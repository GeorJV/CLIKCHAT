import React, { useState } from 'react';
import { Product, Tenant } from '../../types';
import { ProductsHeader } from './products/ProductsHeader';
import { ShoppingBag } from 'lucide-react';
import { ProductCard } from './products/ProductCard';
import { ProductModal } from './products/ProductModal';

interface ProductsManagerTabProps {
  products: Product[];
  tenantSlug?: string;
  tenant?: Tenant | null;
  onRefresh?: () => void;
  onCreateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onUpdateProduct?: (id: string, updates: Partial<Product>) => Promise<boolean>;
  onDeleteProduct?: (id: string) => Promise<boolean>;
}

export const ProductsManagerTab: React.FC<ProductsManagerTabProps> = ({
  products,
  tenantSlug = 'acme-store',
  onRefresh,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const displayProducts = products || [];

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

      {/* 2. Grid de Tarjetas de Productos & QLinks */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      ) : (
        <div className="p-8 border border-white/[0.08] bg-[#181B1D] rounded-2xl text-center flex flex-col items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-zinc-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No hay productos en este catálogo</h3>
          <p className="text-xs text-zinc-400 mb-4 max-w-sm">
            Tu catálogo no tiene productos activos en este momento. Puedes crear uno nuevo para empezar a vender con IA.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
          >
            + Crear Primer Producto
          </button>
        </div>
      )}

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

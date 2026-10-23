import React from 'react';
import { Product, Tenant } from '../../../types';
import { ShoppingBag } from 'lucide-react';
import { VoceroCatalogSettings } from '../settings/VoceroCatalogSettings';

interface VoceroProductsViewProps {
  products: Product[];
  tenant: Tenant | null;
  onCreateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
}

export const VoceroProductsView: React.FC<VoceroProductsViewProps> = ({
  products,
  tenant,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const isServices = tenant?.business_type === 'servicios';

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ShoppingBag className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1730] truncate">
            {isServices ? 'Catálogo de Servicios' : 'Catálogo de Productos y Menú'}
          </h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">
            {products.length} {products.length === 1 ? 'Ítem' : 'Ítems'}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto">
        <VoceroCatalogSettings
          products={products}
          currency={tenant?.currency}
          businessType={tenant?.business_type}
          onCreateProduct={onCreateProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </main>
    </div>
  );
};

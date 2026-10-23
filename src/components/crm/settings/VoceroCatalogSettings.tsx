import React, { useState } from 'react';
import { Product } from '../../../types';
import { Plus, Search, Trash2, Edit2, ShoppingBag, Tag, BarChart2 } from 'lucide-react';
import { ProductModal } from '../../client/products/ProductModal';
import { VoceroProductMetricsModal } from '../products/VoceroProductMetricsModal';

interface VoceroCatalogSettingsProps {
  products: Product[];
  onCreateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  currency?: string;
  businessType?: string;
  tenantSlug?: string;
}

export const VoceroCatalogSettings: React.FC<VoceroCatalogSettingsProps> = ({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  currency = 'CRC',
  businessType = 'tienda',
  tenantSlug = 'comida-callejera-xl'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [metricsProduct, setMetricsProduct] = useState<Product | null>(null);

  const activeMetricsProduct = metricsProduct
    ? (products.find(p => p.id === metricsProduct.id) || metricsProduct)
    : null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.details?.category && p.details.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenEdit = (p: Product) => { setEditingProduct(p); setIsModalOpen(true); };
  const handleSubmit = async (data: Partial<Product> & { name: string; price: number }) => {
    return editingProduct ? await onUpdateProduct(editingProduct.id, data) : await onCreateProduct(data);
  };

  return (
    <div className="space-y-4 max-w-5xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a1730]">
            {businessType === 'servicios' ? 'Catálogo de Servicios' : 'Catálogo de Productos y Menú'}
          </h3>
          <p className="text-xs text-[#62728d]">La IA consultará estos precios y descripciones oficiales en cada conversación.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-[#8391aa] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ítem..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0047e1] transition cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{businessType === 'servicios' ? 'Nuevo Servicio' : 'Nuevo Producto'}</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8e2f0] bg-white p-12 text-center">
          <ShoppingBag className="h-8 w-8 text-[#8391aa] mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold text-[#0a1730]">No hay productos o servicios registrados</p>
          <p className="text-[11px] text-[#8391aa] max-w-sm mx-auto mt-1 mb-3">
            Agrega tus productos o servicios para que el bot pueda recomendarlos, asesorar clientes y cotizar automáticamente.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d5bff] px-4 py-2 text-xs font-bold text-white hover:bg-[#0047e1] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Primer Ítem</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs flex flex-col justify-between hover:border-[#b8cced] transition">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-xl object-cover border border-[#e2e8f0]" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-[#f0f4fd] flex items-center justify-center text-[#0d5bff]">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-[#0a1730] line-clamp-1">{item.name}</h4>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#0d5bff] bg-[#ebf1ff] px-2 py-0.5 rounded-full">
                        <Tag className="h-2.5 w-2.5" /> {item.details?.category || 'General'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0f8b44]">
                    {item.currency || currency} {Number(item.price).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#62728d] line-clamp-2 mt-1">
                  {item.short_description || item.full_description || 'Sin descripción adicional.'}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setMetricsProduct(item)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ebf1ff] text-[#0d5bff] hover:bg-[#d8e4fe] transition cursor-pointer text-[10px] font-bold"
                  title="Ver métricas y telemetría de este ítem"
                >
                  <BarChart2 className="h-3 w-3" />
                  <span>Métricas</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-[#62728d] hover:bg-[#f1f5f9] hover:text-[#0d5bff] cursor-pointer"
                    title="Editar ítem"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${item.name}?`)) onDeleteProduct(item.id);
                    }}
                    className="p-1.5 rounded-lg text-[#62728d] hover:bg-[#fff0f0] hover:text-[#e11d48] cursor-pointer"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        productToEdit={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        defaultCurrency={currency}
        businessType={businessType}
      />

      <VoceroProductMetricsModal
        isOpen={Boolean(activeMetricsProduct)}
        product={activeMetricsProduct}
        tenantSlug={tenantSlug}
        currency={currency}
        onClose={() => setMetricsProduct(null)}
      />
    </div>
  );
};

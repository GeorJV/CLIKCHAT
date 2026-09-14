import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Product } from '../../../types';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSubmit: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(productToEdit?.name || '');
  const [price, setPrice] = useState(productToEdit?.price ? String(productToEdit.price) : '');
  const [currency, setCurrency] = useState(productToEdit?.currency || 'USD');
  const [category, setCategory] = useState(productToEdit?.details?.category || 'General');
  const [sku, setSku] = useState(productToEdit?.details?.sku || `SKU-${Date.now().toString().slice(-6)}`);
  const [imageUrl, setImageUrl] = useState(productToEdit?.images?.[0] || '');
  const [shortDesc, setShortDesc] = useState(productToEdit?.short_description || '');
  const [benefits, setBenefits] = useState(productToEdit?.benefits?.join(', ') || '');
  const [ctaUrl, setCtaUrl] = useState(productToEdit?.cta_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isSubmitting) return;
    setIsSubmitting(true);
    const benefitsList = benefits.split(',').map(b => b.trim()).filter(Boolean);
    const success = await onSubmit({
      name: name.trim(),
      price: parseFloat(price),
      currency,
      short_description: shortDesc.trim(),
      full_description: shortDesc.trim(),
      images: imageUrl ? [imageUrl.trim()] : [],
      benefits: benefitsList,
      cta_url: ctaUrl.trim(),
      details: { category: category.trim(), sku: sku.trim() },
      is_active: true
    });
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#09151c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{productToEdit ? 'Editar Producto & QLink' : 'Nuevo Producto & QLink Directo'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nombre</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Chatbot con IA" className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Precio & Moneda</label>
              <div className="flex gap-2">
                <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="25.00" className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                <input type="text" value={currency} onChange={e => setCurrency(e.target.value)} className="w-16 bg-[#050e14] border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white text-center" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Categoría</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="General" className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">SKU</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU-49" className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">URL Imagen</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
            <div className="flex gap-2 mt-1.5">
              <button type="button" onClick={() => setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800')} className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded hover:text-white">Preset Robot 3D</button>
              <button type="button" onClick={() => setImageUrl('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800')} className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded hover:text-white">Preset Zapato Formal</button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Descripción Corta / Ficha Técnica</label>
            <textarea rows={2} value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Automatiza la atención al cliente..." className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Beneficios (separados por comas)</label>
            <input type="text" value={benefits} onChange={e => setBenefits(e.target.value)} placeholder="Atención 24/7, Calificación de leads" className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Enlace de Compra Directa (WhatsApp o Checkout)</label>
            <input type="text" value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} placeholder="https://wa.me/..." className="w-full bg-[#050e14] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting || !name.trim() || !price} className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : (productToEdit ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../../types';
import { Package, Plus, Sparkles } from 'lucide-react';

interface ProductsManagerTabProps {
  products: Product[];
  onCreateProduct: (data: { name: string; price: number; short_description?: string; benefits?: string[]; cta_url?: string }) => Promise<boolean>;
}

export const ProductsManagerTab: React.FC<ProductsManagerTabProps> = ({ products, onCreateProduct }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [benefitsStr, setBenefitsStr] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isSubmitting) return;
    setIsSubmitting(true);
    const benefits = benefitsStr.split(',').map(b => b.trim()).filter(Boolean);
    const ok = await onCreateProduct({
      name: name.trim(), price: parseFloat(price),
      short_description: shortDesc.trim(), benefits, cta_url: ctaUrl.trim()
    });
    if (ok) {
      setName(''); setPrice(''); setShortDesc(''); setBenefitsStr(''); setCtaUrl('');
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            <span>Catálogo Oficial de Productos / Servicios (RAG Nivel 3)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Datos reales (precio, specs, beneficios) que el bot usa para recomendar sin inventar.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cerrar' : 'Nuevo Producto'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-3.5 shadow-xl">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Agregar Producto al Catálogo D1
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Auriculares Pro Max" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Precio ($ USD)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ej: 89.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Descripción Corta / Ficha Técnica</label>
            <input type="text" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Specs principales..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Beneficios (separados por coma)</label>
            <input type="text" value={benefitsStr} onChange={(e) => setBenefitsStr(e.target.value)} placeholder="Ej: Batería 40h, Carga rápida" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <input type="text" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="URL de Compra / WhatsApp" className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white w-60" />
            <button type="submit" disabled={!name.trim() || !price || isSubmitting} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-white">{prod.name}</h4>
                <p className="text-xs text-indigo-400 font-extrabold mt-0.5">${prod.price} {prod.currency || 'USD'}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">RAG Nivel 3</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{prod.short_description || prod.full_description}</p>
            {prod.benefits && prod.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {prod.benefits.map((b, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">{b}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

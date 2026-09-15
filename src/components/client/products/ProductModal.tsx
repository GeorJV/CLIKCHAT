import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { Product } from '../../../types';
import { ProductModalFieldsLeft } from './ProductModalFieldsLeft';
import { ProductModalFieldsRight } from './ProductModalFieldsRight';

interface Props {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSubmit: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
}

export const ProductModal: React.FC<Props> = ({ isOpen, productToEdit, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [benefits, setBenefits] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.details?.category || 'General');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setCurrency(productToEdit.currency || 'USD');
      setSku(productToEdit.details?.sku || `SKU-${Date.now().toString().slice(-6)}`);
      setDescription(productToEdit.short_description || productToEdit.full_description || '');
      setImageUrl(productToEdit.images?.[0] || '');
      setExternalUrl(productToEdit.cta_url || '');
      setIsActive(productToEdit.is_active ?? true);
      setBenefits(productToEdit.benefits?.map(b => b.startsWith('•') ? b : `• ${b}`).join('\n') || '');
      setDetails(productToEdit.details?.specifications || '');
    } else {
      setName(''); setCategory('General'); setPrice(''); setCurrency('USD');
      setSku(`SKU-${Date.now().toString().slice(-6)}`);
      setDescription(''); setImageUrl(''); setExternalUrl(''); setIsActive(true);
      setBenefits('• Atención al cliente inmediata y disponible 24/7\n• Reducción de hasta un 80% en los tiempos de respuesta\n• Captación y calificación de clientes potenciales en piloto automático');
      setDetails('Tecnología: IA generativa avanzada y Procesamiento de Lenguaje Natural (NLP)\n• Canales: Integrable en sitios web, WhatsApp, Facebook Messenger o Instagram\n• Idiomas: Soporte multilingüe (Español, Inglés, etc.)');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isSubmitting) return;
    setIsSubmitting(true);
    const parsedBenefits = benefits.split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    try {
      const success = await onSubmit({
        name: name.trim(), price: parseFloat(price) || 0, currency,
        short_description: description.trim(), full_description: description.trim(),
        images: imageUrl ? [imageUrl.trim()] : [], benefits: parsedBenefits,
        cta_label: 'Comprar Ahora', cta_url: externalUrl.trim(),
        details: { category: category.trim(), sku: sku.trim(), specifications: details.trim() },
        is_active: isActive
      });
      setIsSubmitting(false);
      if (success !== false) onClose();
    } catch {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#131b26] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/90 bg-[#101721]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {productToEdit ? 'Editar producto' : 'Crear producto'}
              </h3>
              <p className="text-xs text-slate-400">Configura datos comerciales, foto, beneficios y especificaciones para tu tienda.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del formulario con 2 columnas */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
            <div className="lg:col-span-7">
              <ProductModalFieldsLeft
                name={name} setName={setName} category={category} setCategory={setCategory}
                price={price} setPrice={setPrice} currency={currency} setCurrency={setCurrency}
                sku={sku} setSku={setSku} description={description} setDescription={setDescription}
                imageUrl={imageUrl} setImageUrl={setImageUrl} externalUrl={externalUrl} setExternalUrl={setExternalUrl}
                isActive={isActive} setIsActive={setIsActive}
              />
            </div>
            <div className="lg:col-span-5">
              <ProductModalFieldsRight benefits={benefits} setBenefits={setBenefits} details={details} setDetails={setDetails} />
            </div>
          </div>

          {/* Botones de acción Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/90 bg-[#0e141d]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || !name.trim() || !price} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer">
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

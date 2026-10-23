import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { Product } from '../../../types';
import { parsePriceNumber } from '../../../utils/orderPriceExtractor';
import { ProductModalFieldsLeft } from './ProductModalFieldsLeft';
import { ProductModalFieldsRight } from './ProductModalFieldsRight';

interface Props {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSubmit: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  defaultCurrency?: string;
  businessType?: string;
}

export const ProductModal: React.FC<Props> = ({
  isOpen,
  productToEdit,
  onClose,
  onSubmit,
  defaultCurrency = 'CRC',
  businessType = 'tienda'
}) => {
  if (!isOpen) return null;

  const resolvedCurrency = productToEdit?.currency || defaultCurrency || 'CRC';
  const isRestaurant = businessType === 'restaurante';
  const isServices = businessType === 'servicios';

  const [name, setName] = useState('');
  const [category, setCategory] = useState(isRestaurant ? 'Platos Fuertes' : 'General');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState(resolvedCurrency);
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
      setCategory(productToEdit.details?.category || (isRestaurant ? 'Platos Fuertes' : 'General'));
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setCurrency(productToEdit.currency || defaultCurrency || 'CRC');
      setSku(productToEdit.details?.sku || `SKU-${Date.now().toString().slice(-6)}`);
      setDescription(productToEdit.short_description || productToEdit.full_description || '');
      setImageUrl(productToEdit.images?.[0] || '');
      setExternalUrl(productToEdit.cta_url || '');
      setIsActive(productToEdit.is_active ?? true);
      setBenefits(productToEdit.benefits?.map(b => b.startsWith('•') ? b : `• ${b}`).join('\n') || '');
      setDetails(productToEdit.details?.specifications || '');
    } else {
      setName('');
      setCategory(isRestaurant ? 'Platos Fuertes' : 'General');
      setPrice('');
      setCurrency(defaultCurrency || 'CRC');
      setSku(`SKU-${Date.now().toString().slice(-6)}`);
      setDescription('');
      setImageUrl('');
      setExternalUrl('');
      setIsActive(true);
      setBenefits(isRestaurant
        ? '• 100% Carne fresca y jugosa de primera calidad\n• Pan artesanal tostado al momento\n• Queso fundido y aderezo exclusivo de la casa'
        : '• Garantía oficial y envío inmediato\n• Materiales de alta resistencia\n• Soporte prioritario'
      );
      setDetails(isRestaurant
        ? '• Tiempo de cocina estimado: 15-20 min\n• Acompañamiento: Incluye papas o ensalada\n• Alérgenos: Contiene lácteos y gluten'
        : '• Especificaciones técnicas completas\n• Contenido del paquete original\n• Compatible con estándares universales'
      );
    }
  }, [productToEdit, isOpen, defaultCurrency, isRestaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const parsedBenefits = benefits.split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
    try {
      const parsedPrice = price.trim() === '' ? 0 : parsePriceNumber(price, currency.trim().toUpperCase() === 'CRC');
      const success = await onSubmit({
        name: name.trim(), price: parsedPrice, currency,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Encabezado Tema Web Vocero */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#e8edf6] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ebf1ff] border border-[#d3e2ff] flex items-center justify-center text-[#0d5bff] shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0a1730] tracking-tight leading-none">
                {productToEdit
                  ? (isServices ? 'Editar servicio' : 'Editar producto')
                  : (isServices ? 'Crear nuevo servicio' : 'Crear nuevo producto')}
              </h3>
              <p className="text-[11px] text-[#62728d] mt-1 leading-none">
                Configura datos comerciales, foto, beneficios y especificaciones oficiales para tu catálogo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8391aa] hover:text-[#0a1730] p-1.5 rounded-lg hover:bg-[#f6f8fc] transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del formulario con 2 columnas bien distribuidas */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-5 overflow-y-auto flex-1 bg-white">
            <div className="lg:col-span-7">
              <ProductModalFieldsLeft
                name={name} setName={setName} category={category} setCategory={setCategory}
                price={price} setPrice={setPrice} currency={currency} setCurrency={setCurrency}
                sku={sku} setSku={setSku} description={description} setDescription={setDescription}
                imageUrl={imageUrl} setImageUrl={setImageUrl} externalUrl={externalUrl} setExternalUrl={setExternalUrl}
                isActive={isActive} setIsActive={setIsActive}
                businessType={businessType}
              />
            </div>
            <div className="lg:col-span-5">
              <ProductModalFieldsRight
                benefits={benefits}
                setBenefits={setBenefits}
                details={details}
                setDetails={setDetails}
                businessType={businessType}
              />
            </div>
          </div>

          {/* Botones de acción Footer Vocero */}
          <div className="flex items-center justify-end gap-2.5 px-4 py-3 sm:px-6 sm:py-3 border-t border-[#e8edf6] bg-[#f8fafc]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#f6f8fc] border border-[#dde5f1] text-[#42506b] font-semibold text-xs transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-xl bg-[#0d5bff] hover:bg-[#0047e1] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : (isServices ? 'Guardar servicio' : 'Guardar producto')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

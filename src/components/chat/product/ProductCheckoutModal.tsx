import React, { useState } from 'react';
import { X, ShoppingBag, Truck, CreditCard, Banknote, Smartphone, Plus, Minus, User, Phone, MapPin, Lock } from 'lucide-react';
import { ProductItem, ProductCheckoutData } from '../../../types/productChat';

interface Props {
  product: ProductItem | null;
  storeName: string;
  onClose: () => void;
  onConfirmCheckout: (data: ProductCheckoutData) => void;
}

export const ProductCheckoutModal: React.FC<Props> = ({
  product,
  storeName,
  onClose,
  onConfirmCheckout,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash_on_delivery' | 'transfer'>('cash_on_delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;
  const totalAmount = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCheckout({
        product,
        quantity,
        paymentMethod,
        customerName,
        customerPhone,
        shippingAddress,
        totalAmount,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#181717] border border-[#282626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#282626] bg-[#141313] shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Finalizar Pedido Express</h3>
              <span className="text-[10px] text-zinc-400">{storeName}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-[#252424] transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Item Preview */}
          <div className="p-3 rounded-xl bg-[#141313] border border-[#242222] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={product.images?.[0] || product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-[#2e2b2b]" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
                <span className="text-xs font-black text-emerald-400">${product.price.toFixed(2)} {product.currency}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#1c1b1b] rounded-lg p-1 border border-[#2c2a2a] shrink-0">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-1 text-zinc-400 hover:text-white rounded transition cursor-pointer">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-white px-1">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="p-1 text-zinc-400 hover:text-white rounded transition cursor-pointer">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Payment Method */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1.5">Método de Pago:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button type="button" onClick={() => setPaymentMethod('cash_on_delivery')} className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'cash_on_delivery' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-[#141313] border-[#262424] text-zinc-400 hover:border-[#383535]'}`}>
                  <Banknote className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Contra Entrega</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('card')} className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'card' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-[#141313] border-[#262424] text-zinc-400 hover:border-[#383535]'}`}>
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Tarjeta</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('transfer')} className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${paymentMethod === 'transfer' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-[#141313] border-[#262424] text-zinc-400 hover:border-[#383535]'}`}>
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Transferencia</span>
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-2 pt-1 border-t border-[#262424]">
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="text" required placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="tel" required placeholder="WhatsApp de entrega" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input type="text" required placeholder="Dirección completa de entrega" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full bg-[#131212] border border-[#282626] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold"><Truck className="w-3.5 h-3.5" /><span>Envío Express 24/48h</span></div>
              <span className="font-extrabold text-emerald-400 uppercase">Gratis</span>
            </div>

            <button type="submit" disabled={isSubmitting || !customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()} className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer">
              <ShoppingBag className="w-4 h-4" /><span>Confirmar Compra — ${totalAmount.toFixed(2)} {product.currency}</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-400">
              <Lock className="w-3 h-3 text-emerald-400" /><span>Garantía 30 días • Pago Seguro SSL</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

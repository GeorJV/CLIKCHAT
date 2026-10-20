import React, { useState } from 'react';
import { X, ShoppingBag, Truck, Smartphone, CreditCard, Banknote, User, ArrowRight } from 'lucide-react';
import { ProductItem, ProductCheckoutData } from '../../../types/productChat';
import { SinpePaymentSection } from './checkout/SinpePaymentSection';
import { CashPaymentSection } from './checkout/CashPaymentSection';
import { ElpPaymentSection } from './checkout/ElpPaymentSection';
import { CustomerInfoSection } from './checkout/CustomerInfoSection';

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
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine_in'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'sinpe_movil' | 'elp_card' | 'cash_on_delivery'>('sinpe_movil');
  const [customerName, setCustomerName] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('clikchat_cust_name') || '' : ''));
  const [customerPhone, setCustomerPhone] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('clikchat_cust_phone') || '' : ''));
  const [shippingAddress, setShippingAddress] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('clikchat_cust_addr') || '' : ''));
  const [sinpeRef, setSinpeRef] = useState('');
  const [cashAmount, setCashAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;
  const totalAmount = product.price;
  const isCRC = product.currency?.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || (orderType === 'delivery' && !shippingAddress.trim())) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('clikchat_cust_name', customerName);
      localStorage.setItem('clikchat_cust_phone', customerPhone);
      localStorage.setItem('clikchat_cust_addr', shippingAddress);
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCheckout({
        product,
        quantity: 1,
        paymentMethod: paymentMethod === 'sinpe_movil' ? 'transfer' : (paymentMethod === 'elp_card' ? 'card' : 'cash_on_delivery'),
        customerName,
        customerPhone,
        shippingAddress: orderType === 'delivery' ? shippingAddress : `[${orderType === 'takeaway' ? 'Retiro en Local' : 'Consumo en Mesa'}]`,
        totalAmount,
      });
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-sans select-none">
      <div className="relative w-full max-w-lg bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#18181c] shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#ff5416]/15 text-[#ff5416] border border-[#ff5416]/30">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Confirmar Pedido & Pago</h3>
              <span className="text-[10px] text-zinc-400">{storeName}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'delivery' as const, label: 'Express / Moto', icon: Truck },
              { id: 'takeaway' as const, label: 'Para Llevar', icon: ShoppingBag },
              { id: 'dine_in' as const, label: 'En Mesa', icon: User },
            ].map((m) => {
              const Icon = m.icon;
              const active = orderType === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setOrderType(m.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition cursor-pointer ${
                    active ? 'border-[#ff5416] bg-[#ff5416]/10 text-white' : 'border-zinc-800 bg-[#18181c] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10.5px]">{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-300">Forma de Pago:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('sinpe_movil')}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition cursor-pointer ${
                  paymentMethod === 'sinpe_movil' ? 'border-amber-500 bg-amber-500/15 text-amber-300' : 'border-zinc-800 bg-[#18181c] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px]">SINPE Móvil</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('elp_card')}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition cursor-pointer ${
                  paymentMethod === 'elp_card' ? 'border-[#ff5416] bg-[#ff5416]/15 text-orange-300' : 'border-zinc-800 bg-[#18181c] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#ff5416]" />
                <span className="text-[10px]">Enlace (ELP)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition cursor-pointer ${
                  paymentMethod === 'cash_on_delivery' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300' : 'border-zinc-800 bg-[#18181c] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px]">Efectivo</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'sinpe_movil' && (
            <SinpePaymentSection totalAmount={totalAmount} currency={product.currency} storeName={storeName} sinpeReference={sinpeRef} onReferenceChange={setSinpeRef} />
          )}
          {paymentMethod === 'elp_card' && (
            <ElpPaymentSection totalAmount={totalAmount} currency={product.currency} />
          )}
          {paymentMethod === 'cash_on_delivery' && (
            <CashPaymentSection totalAmount={totalAmount} currency={product.currency} cashAmount={cashAmount} onCashAmountChange={setCashAmount} />
          )}

          <CustomerInfoSection
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            customerPhone={customerPhone}
            onCustomerPhoneChange={setCustomerPhone}
            shippingAddress={shippingAddress}
            onShippingAddressChange={setShippingAddress}
            isDelivery={orderType === 'delivery'}
          />

          <button
            type="submit"
            disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()}
            className="w-full py-3 px-4 rounded-xl bg-[#ff5416] hover:bg-[#e0450d] disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-[#ff5416]/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>{isSubmitting ? 'Procesando comanda...' : `Enviar a Cocina — ${sym}${isCRC ? Math.round(totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : totalAmount.toFixed(2)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

interface Props {
  customerName: string;
  onCustomerNameChange: (val: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (val: string) => void;
  shippingAddress: string;
  onShippingAddressChange: (val: string) => void;
  isDelivery: boolean;
}

export const CustomerInfoSection: React.FC<Props> = ({
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  shippingAddress,
  onShippingAddressChange,
  isDelivery
}) => {
  return (
    <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="relative">
          <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            required
            placeholder="Tu nombre completo"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="w-full bg-[#18181c] border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#ff5416] focus:outline-none"
          />
        </div>
        <div className="relative">
          <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="tel"
            required
            placeholder="WhatsApp de contacto"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            className="w-full bg-[#18181c] border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#ff5416] focus:outline-none"
          />
        </div>
      </div>

      {isDelivery && (
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            required
            placeholder="Dirección exacta de entrega (señas y referencias)"
            value={shippingAddress}
            onChange={(e) => onShippingAddressChange(e.target.value)}
            className="w-full bg-[#18181c] border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#ff5416] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};

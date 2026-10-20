export type KdsTicketStatus = 'queued' | 'cooking' | 'ready' | 'dispatched';
export type FastFoodOrderType = 'dine_in' | 'takeaway' | 'delivery';
export type HybridPaymentMethod = 'sinpe_movil' | 'elp_card' | 'cash_on_delivery';

export interface KdsTicketItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  isPrepared?: boolean;
}

export interface KdsTicket {
  id: string;
  orderNumber: string;
  orderType: FastFoodOrderType;
  tableNumber?: string;
  items: KdsTicketItem[];
  status: KdsTicketStatus;
  createdAt: string;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  paymentMethod: HybridPaymentMethod;
  paymentStatus: 'paid' | 'pending_verification' | 'cash_pending';
  sinpeReference?: string;
  riderName?: string;
}

export interface RiderDelivery {
  id: string;
  ticketId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  itemsSummary: string;
  totalAmount: number;
  currency: string;
  paymentStatus: 'paid' | 'collect_cash';
  status: 'assigned' | 'in_transit' | 'delivered';
  pickedUpAt?: string;
  deliveredAt?: string;
}

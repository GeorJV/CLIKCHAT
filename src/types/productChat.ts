export interface ProductItem {
  id: string;
  tenantId?: string;
  title: string;
  slug?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images?: string[];
  stock: number;
  inStock?: boolean;
  benefits?: string[];
  description?: string;
  specifications?: Record<string, any>;
  rating?: number;
}

export interface ProductRAGTrace {
  levelUsed?: number | string;
  confidence?: number;
  sourcesMatched?: string[];
  executionTimeMs?: number;
  modelUsed?: string;
  reasoning?: string;
}

export interface ProductChatMessage {
  id: string;
  sessionId: string;
  tenantId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  ragTrace?: ProductRAGTrace;
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

export interface ProductCheckoutData {
  product: ProductItem;
  quantity: number;
  paymentMethod: 'card' | 'cash_on_delivery' | 'transfer';
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
}

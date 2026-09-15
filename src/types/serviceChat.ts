export interface ServiceItem {
  id: string;
  tenantId?: string;
  title: string;
  slug?: string;
  category?: string;
  price?: number;
  currency?: string;
  duration?: string;
  serviceModality?: 'online' | 'presencial' | 'hibrido';
  image: string;
  images?: string[];
  benefits?: string[];
  requirements?: string[];
  description?: string;
  rating?: number;
}

export interface ServiceBookingData {
  service: ServiceItem;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

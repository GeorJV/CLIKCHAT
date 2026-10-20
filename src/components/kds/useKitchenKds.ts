import { useState, useEffect } from 'react';
import { KdsTicket, KdsTicketStatus } from '../../types/fastfood';

const INITIAL_TICKETS: KdsTicket[] = [
  {
    id: 'kds-101',
    orderNumber: '#101',
    orderType: 'delivery',
    items: [
      { id: 'it-1', name: 'Burger Artesanal Doble Carne', quantity: 2, price: 5500, notes: 'Sin pepinillos' },
      { id: 'it-2', name: 'Papas Rústicas con Queso Cheddar', quantity: 1, price: 2800 },
      { id: 'it-3', name: 'Gaseosa Cola 600ml', quantity: 2, price: 1200 },
    ],
    status: 'cooking',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    totalAmount: 16200,
    currency: 'CRC',
    customerName: 'Carlos Morales',
    customerPhone: '+506 8888-8888',
    deliveryAddress: 'San Pedro, 100m norte del parque, casa blanca portón negro',
    paymentMethod: 'sinpe_movil',
    paymentStatus: 'paid',
    sinpeReference: 'REF-789456',
  },
  {
    id: 'kds-102',
    orderNumber: '#102',
    orderType: 'takeaway',
    items: [
      { id: 'it-4', name: 'Pizza Mediana Pepperoni & Champiñones', quantity: 1, price: 8500 },
      { id: 'it-5', name: 'Alitas BBQ x12 Piezas', quantity: 1, price: 6200, notes: 'Salsa aparte' },
    ],
    status: 'queued',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    totalAmount: 14700,
    currency: 'CRC',
    customerName: 'María Fernanda Ruiz',
    customerPhone: '+506 7777-7777',
    paymentMethod: 'elp_card',
    paymentStatus: 'paid',
  },
  {
    id: 'kds-103',
    orderNumber: '#103',
    orderType: 'delivery',
    items: [
      { id: 'it-6', name: 'Combo Parrillero para 2 personas', quantity: 1, price: 19500, notes: 'Término 3/4' },
      { id: 'it-7', name: 'Té Frío Melocotón 1L', quantity: 1, price: 1800 },
    ],
    status: 'ready',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    totalAmount: 21300,
    currency: 'CRC',
    customerName: 'Alejandro Castro',
    customerPhone: '+506 6666-6666',
    deliveryAddress: 'Curridabat, Condominio El Roble, Casa 42',
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'cash_pending',
    riderName: 'Andrés (Moto #4)',
  },
];

export const useKitchenKds = (tenantSlug: string) => {
  const storageKey = `clikchat_kds_tickets_${tenantSlug || 'default'}`;

  const [tickets, setTickets] = useState<KdsTicket[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TICKETS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tickets));
      } catch {}
    }
  }, [tickets, storageKey]);

  const updateTicketStatus = (id: string, newStatus: KdsTicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const toggleItemPrepared = (ticketId: string, itemId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const nextItems = t.items.map((it) =>
          it.id === itemId ? { ...it, isPrepared: !it.isPrepared } : it
        );
        return { ...t, items: nextItems };
      })
    );
  };

  const addTicket = (ticket: KdsTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  return {
    tickets,
    updateTicketStatus,
    toggleItemPrepared,
    addTicket,
  };
};

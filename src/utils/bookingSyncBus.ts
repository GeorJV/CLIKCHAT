export interface BookingDetail {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  price?: number;
}

export interface BookingSyncEvent {
  type: 'BOOKING_SYNC';
  tenant?: string;
  timestamp: number;
  booking?: BookingDetail;
}

let sharedBc: BroadcastChannel | null = null;
function getSharedChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!sharedBc) {
    try { sharedBc = new BroadcastChannel('clikchat_bookings_bus'); } catch { sharedBc = null; }
  }
  return sharedBc;
}

export function broadcastBookingCreated(tenantSlug?: string, booking?: BookingDetail) {
  if (typeof window === 'undefined') return;
  try {
    const payload: BookingSyncEvent = { type: 'BOOKING_SYNC', tenant: tenantSlug, timestamp: Date.now(), booking };
    const bc = getSharedChannel();
    if (bc) bc.postMessage(payload);
    window.dispatchEvent(new CustomEvent('clikchat_booking_sync', { detail: payload }));
    localStorage.setItem('clikchat_booking_ping', `${tenantSlug || 'all'}_${Date.now()}`);
    if (booking) {
      localStorage.setItem('clikchat_latest_new_booking', JSON.stringify({ ...booking, tenant: tenantSlug, timestamp: Date.now() }));
    }
  } catch (e) {}
}

export function subscribeBookingSync(onSync: (event?: BookingSyncEvent) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const bc = getSharedChannel();
  const handleBc = (e: MessageEvent) => onSync(e.data);
  if (bc) bc.addEventListener('message', handleBc);
  const handleCustom = (e: any) => onSync(e.detail);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'clikchat_booking_ping' || e.key === 'clikchat_latest_new_booking') {
      try {
        const saved = localStorage.getItem('clikchat_latest_new_booking');
        const b = saved ? JSON.parse(saved) : undefined;
        onSync({ type: 'BOOKING_SYNC', timestamp: Date.now(), booking: b });
      } catch { onSync(); }
    }
  };
  window.addEventListener('clikchat_booking_sync', handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    if (bc) bc.removeEventListener('message', handleBc);
    window.removeEventListener('clikchat_booking_sync', handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

if (typeof window !== 'undefined' && !(window as any).__clikchat_booking_sync_hooked) {
  (window as any).__clikchat_booking_sync_hooked = true;
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && (args[0] as Request).url) || '';
      const method = (args[1]?.method || (args[0] && (args[0] as Request).method) || 'GET').toUpperCase();
      // Solo interceptar chats con tarjetas de reserva o POST explícitos de creación de citas
      if (typeof url === 'string' && (url.includes('/api/chat/message') || (url.includes('/api/bookings') && method === 'POST'))) {
        const cloned = res.clone();
        cloned.text().then(txt => {
          if (txt.includes('[BOOKING_CARD:') || txt.includes('"bookingCard"') || (method === 'POST' && txt.includes('"success":true'))) {
            try {
              const data = JSON.parse(txt);
              if (data?.booking) {
                const b = data.booking;
                broadcastBookingCreated(b.tenant_id, {
                  id: b.id,
                  clientName: b.customer_name || 'Cliente',
                  serviceName: b.service_name || 'Servicio Profesional',
                  date: b.booking_date,
                  time: b.booking_time,
                  price: b.price
                });
                return;
              }
            } catch (e) {}
            broadcastBookingCreated();
          }
        }).catch(() => {});
      }
    } catch (e) {}
    return res;
  };
}

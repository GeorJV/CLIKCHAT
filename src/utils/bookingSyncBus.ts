export interface BookingSyncEvent {
  type: 'BOOKING_SYNC';
  tenant?: string;
  timestamp: number;
}

let sharedBc: BroadcastChannel | null = null;
function getSharedChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!sharedBc) {
    try { sharedBc = new BroadcastChannel('clikchat_bookings_bus'); } catch { sharedBc = null; }
  }
  return sharedBc;
}

export function broadcastBookingCreated(tenantSlug?: string) {
  if (typeof window === 'undefined') return;
  try {
    const payload: BookingSyncEvent = { type: 'BOOKING_SYNC', tenant: tenantSlug, timestamp: Date.now() };
    const bc = getSharedChannel();
    if (bc) bc.postMessage(payload);
    window.dispatchEvent(new CustomEvent('clikchat_booking_sync', { detail: payload }));
    localStorage.setItem('clikchat_booking_ping', `${tenantSlug || 'all'}_${Date.now()}`);
  } catch (e) {}
}

export function subscribeBookingSync(onSync: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const bc = getSharedChannel();
  const handleBc = () => onSync();
  if (bc) bc.addEventListener('message', handleBc);
  const handleCustom = () => onSync();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'clikchat_booking_ping') onSync();
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
      if (typeof url === 'string' && (url.includes('/api/chat/message') || url.includes('/api/bookings'))) {
        const cloned = res.clone();
        cloned.text().then(txt => {
          if (txt.includes('[BOOKING_CARD:') || txt.includes('"bookingCard"') || (url.includes('/api/bookings') && txt.includes('"success":true'))) {
            broadcastBookingCreated();
          }
        }).catch(() => {});
      }
    } catch (e) {}
    return res;
  };
}

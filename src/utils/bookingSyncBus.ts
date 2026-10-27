export interface BookingSyncEvent {
  type: 'BOOKING_SYNC';
  tenant?: string;
  timestamp: number;
}

export function broadcastBookingCreated(tenantSlug?: string) {
  if (typeof window === 'undefined') return;
  try {
    const payload: BookingSyncEvent = { type: 'BOOKING_SYNC', tenant: tenantSlug, timestamp: Date.now() };
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('clikchat_bookings_bus');
      bc.postMessage(payload);
      bc.close();
    }
    window.dispatchEvent(new CustomEvent('clikchat_booking_sync', { detail: payload }));
    localStorage.setItem('clikchat_booking_ping', `${tenantSlug || 'all'}_${Date.now()}`);
  } catch (e) {}
}

export function subscribeBookingSync(onSync: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  let bc: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    try {
      bc = new BroadcastChannel('clikchat_bookings_bus');
      bc.onmessage = () => onSync();
    } catch (e) {}
  }
  const handleCustom = () => onSync();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'clikchat_booking_ping') onSync();
  };
  window.addEventListener('clikchat_booking_sync', handleCustom);
  window.addEventListener('storage', handleStorage);
  return () => {
    if (bc) bc.close();
    window.removeEventListener('clikchat_booking_sync', handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

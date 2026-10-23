import { Product } from '../types';

export interface MetricEventPayload {
  productId: string;
  event: string;
  timestamp: number;
  metrics?: Partial<NonNullable<Product['metrics']>>;
}

const CHANNEL_NAME = 'clikchat_metrics_bus';
const STORAGE_KEY = 'clikchat_metrics_pulse';
const CUSTOM_EVENT = 'clikchat_metrics_updated';

let broadcastChan: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChan = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  broadcastChan = null;
}

export function broadcastProductMetric(
  productId: string,
  event: string,
  metrics?: Partial<NonNullable<Product['metrics']>>
): void {
  if (typeof window === 'undefined' || !productId) return;
  const payload: MetricEventPayload = {
    productId,
    event,
    timestamp: Date.now(),
    metrics
  };

  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT, { detail: payload }));
  } catch (e) {}

  try {
    broadcastChan?.postMessage(payload);
  } catch (e) {}

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

export function subscribeToProductMetrics(
  callback: (payload: MetricEventPayload) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const ce = e as CustomEvent<MetricEventPayload>;
    if (ce.detail) callback(ce.detail);
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.productId) callback(e.data);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && parsed.productId) callback(parsed);
      } catch (err) {}
    }
  };

  window.addEventListener(CUSTOM_EVENT, handleCustomEvent);
  broadcastChan?.addEventListener('message', handleBroadcast);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(CUSTOM_EVENT, handleCustomEvent);
    broadcastChan?.removeEventListener('message', handleBroadcast);
    window.removeEventListener('storage', handleStorage);
  };
}

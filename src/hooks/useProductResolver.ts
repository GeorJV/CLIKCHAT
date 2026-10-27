import { useState, useEffect } from 'react';
import { ProductItem } from '../types/productChat';
import { Product } from '../types';
import { ServiceItem } from '../types/serviceChat';
import { DEFAULT_PRODUCT } from '../components/chat/product/productChatMock';
import { getCachedTenant, saveCachedTenant } from '../utils/fallbackTenant';
import { DeliveryMode } from '../utils/messageSplitter';

export function toProductItem(p: Partial<Product> & { id: string; name: string; price: number }): ProductItem {
  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  return {
    id: p.id, tenantId: p.tenant_id, title: p.name, slug: p.slug, category: p.details?.category || 'Catálogo Oficial',
    price: Number(p.price) || 0, originalPrice: p.price ? Math.round(Number(p.price) * 1.35) : undefined,
    currency: p.currency || 'CRC', image: images[0] || '', images, stock: 25, inStock: true,
    benefits: Array.isArray(p.benefits) && p.benefits.length > 0 ? p.benefits : ['Atención personalizada 24/7.', 'Garantía y calidad asegurada.'],
    description: p.full_description || p.short_description || '', specifications: p.details || {}
  };
}

export function toServiceItem(p: any): ServiceItem {
  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : (p.image ? [p.image] : []);
  const details = p.details || p.specifications || {};
  return {
    id: p.id, tenantId: p.tenant_id || p.tenantId, title: p.name || p.title || 'Servicio Profesional',
    slug: p.slug, category: details.category || p.category || 'Servicios Especializados',
    price: Number(p.price) || 0, currency: p.currency || 'USD', duration: details.duration || '45 min',
    serviceModality: (details.modality || 'online') as any, image: images[0] || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    images, benefits: Array.isArray(p.benefits) && p.benefits.length > 0 ? p.benefits : ['Atención personalizada', 'Garantía y soporte'],
    requirements: Array.isArray(details.requirements) ? details.requirements : ['Dispositivo con navegador web'],
    description: p.full_description || p.short_description || p.description || '', rating: 5.0
  };
}

export function useProductResolver(productId: string | null, tenantSlug: string = 'comida-callejera-xl') {
  const cached = getCachedTenant(tenantSlug);
  const isRestaurant = cached.business_type === 'restaurante' || /comida|callejera|restaurante/i.test(tenantSlug);
  const initialStoreName = cached.name ? cached.name : (tenantSlug === 'comida-callejera-xl' ? 'COMIDA CALLEJERA XL' : '');
  const initialBotName = tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : (cached.bot_name || '');

  const [productItem, setProductItem] = useState<ProductItem | null>(() => {
    if (!productId || typeof window !== 'undefined') return null;
    try {
      const keys = tenantSlug === 'comida-callejera-xl' ? [`clikchat_products_${tenantSlug}`, 'clikchat_products'] : [`clikchat_products_${tenantSlug}`];
      for (const k of keys) {
        const s = localStorage.getItem(k);
        if (s) {
          const l: Product[] = JSON.parse(s);
          const f = l.find((p) => (p.id === productId || p.slug === productId) && p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
          if (f) return toProductItem(f);
        }
      }
    } catch (e) {}
    return null;
  });

  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [storeName, setStoreName] = useState<string>(initialStoreName);
  const [agentName, setAgentName] = useState<string>(initialBotName);
  const [agentAvatar, setAgentAvatar] = useState<string>(cached.avatar_url || '');
  const [welcomeMessage, setWelcomeMessage] = useState<string>(cached.welcome_message || '');
  const [isLoading, setIsLoading] = useState<boolean>(!productItem);
  const [responseDelaySec, setResponseDelaySec] = useState<number>(Math.min(Math.max(Number(cached.response_delay_sec || 1), 1), 10));
  const [botResponseSpeedSec, setBotResponseSpeedSec] = useState<number>(() => {
    const l = typeof window !== 'undefined' ? localStorage.getItem('clikchat_bot_response_speed') : null;
    if (l !== null && !isNaN(Number(l))) return Math.min(Math.max(Number(l), 0), 10);
    return (cached as any).bot_response_speed_sec !== undefined ? Number((cached as any).bot_response_speed_sec) : 0;
  });
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(
    (cached as any).message_delivery_mode || (typeof window !== 'undefined' ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) : null) || 'moderate'
  );
  const [businessType, setBusinessType] = useState<string>(isRestaurant ? 'restaurante' : (cached.business_type || 'tienda'));

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('src') || new URLSearchParams(window.location.search).get('source');
      if (s) try { localStorage.setItem('clikchat_traffic_source', s.toLowerCase()); } catch (e) {}
    }

    async function resolve() {
      if (!productItem) setIsLoading(true);

      // 1. Resolver catálogo general si no hay productId
      if (!productId) {
        let defaultItem: ProductItem = { ...DEFAULT_PRODUCT, title: 'Catálogo Oficial', description: `Bienvenido a la tienda de ${initialStoreName}.`, currency: cached.currency || 'CRC' };
        try {
          const tRes = await fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' });
          if (tRes.ok && (tRes.headers.get('content-type') || '').includes('application/json')) {
            const tData = await tRes.json();
            if (tData.tenant && isMounted) {
              const t = tData.tenant;
              if (t.name) setStoreName(t.name);
              if (t.bot_name) setAgentName(tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : t.bot_name);
              if (t.avatar_url) setAgentAvatar(t.avatar_url); if (t.welcome_message) setWelcomeMessage(t.welcome_message); if (t.business_type) setBusinessType(t.business_type);
              if (t.response_delay_sec !== undefined && t.response_delay_sec !== null) setResponseDelaySec(Math.min(Math.max(Number(t.response_delay_sec), 1), 10));
              if (t.bot_response_speed_sec !== undefined && t.bot_response_speed_sec !== null) setBotResponseSpeedSec(Math.min(Math.max(Number(t.bot_response_speed_sec), 0), 10));
              if (t.message_delivery_mode) setDeliveryMode(t.message_delivery_mode);
              saveCachedTenant(t);
            }
            if (tData.products && tData.products.length > 0) {
              const clean = tData.products.filter((p: any) => p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
              if (clean.length > 0) {
                defaultItem = toProductItem(clean[0]);
                if (isMounted) setProductsList(clean.map(toProductItem));
              }
            }
          }
        } catch (e) {}
        if (isMounted) { setProductItem(defaultItem); setIsLoading(false); }
        return;
      }

      // 2. Caché local multi-fuente
      let resolvedItem: ProductItem | null = productItem;
      try {
        const localKeys = tenantSlug === 'comida-callejera-xl' ? [`clikchat_products_${tenantSlug}`, 'clikchat_products'] : [`clikchat_products_${tenantSlug}`];
        for (const key of localKeys) {
          const saved = localStorage.getItem(key);
          if (saved) {
            const list: Product[] = JSON.parse(saved);
            const found = list.find((p) => (p.id === productId || p.slug === productId) && p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
            if (found) { resolvedItem = toProductItem(found); break; }
          }
        }
      } catch (e) {}
      if (resolvedItem && isMounted) setProductItem(resolvedItem);

      // 3. Consulta de red
      try {
        const [prodRes, tenantRes] = await Promise.all([
          fetch('/api/products/' + encodeURIComponent(productId), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        if (prodRes?.product && isMounted) { resolvedItem = toProductItem(prodRes.product); setProductItem(resolvedItem); }
        if (tenantRes?.tenant && isMounted) {
          const t = tenantRes.tenant;
          if (t.name) setStoreName(t.name);
          if (t.bot_name) setAgentName(tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : t.bot_name);
          if (t.avatar_url) setAgentAvatar(t.avatar_url); if (t.welcome_message) setWelcomeMessage(t.welcome_message); if (t.business_type) setBusinessType(t.business_type);
          if (t.response_delay_sec !== undefined && t.response_delay_sec !== null) setResponseDelaySec(Math.min(Math.max(Number(t.response_delay_sec), 1), 10));
          if (t.bot_response_speed_sec !== undefined && t.bot_response_speed_sec !== null) setBotResponseSpeedSec(Math.min(Math.max(Number(t.bot_response_speed_sec), 0), 10));
          if (t.message_delivery_mode) setDeliveryMode(t.message_delivery_mode);
          saveCachedTenant(t);
        }
        if (tenantRes?.products && Array.isArray(tenantRes.products) && isMounted) {
          const clean = tenantRes.products.filter((p: any) => p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
          setProductsList(clean.map(toProductItem));
          if (!resolvedItem) {
            const f = clean.find((p: any) => p.id === productId || p.slug === productId);
            if (f) { resolvedItem = toProductItem(f); setProductItem(resolvedItem); }
          }
        }
      } catch (err) {}
      if (!resolvedItem && isMounted) setProductItem({ ...DEFAULT_PRODUCT, id: productId, slug: productId });
      if (isMounted) setIsLoading(false);
    }
    resolve();
    return () => { isMounted = false; };
  }, [productId, tenantSlug]);

  return { productItem, productsList, storeName, agentName, agentAvatar, welcomeMessage, isLoading, responseDelaySec, botResponseSpeedSec, deliveryMode, businessType };
}

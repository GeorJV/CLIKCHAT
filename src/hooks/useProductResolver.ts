import { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../types/productChat';
import { Product } from '../types';
import { DEFAULT_PRODUCT } from '../components/chat/product/productChatMock';
import { getCachedTenant } from '../utils/fallbackTenant';

export function toProductItem(p: Partial<Product> & { id: string; name: string; price: number }): ProductItem {
  const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  return {
    id: p.id,
    tenantId: p.tenant_id,
    title: p.name,
    slug: p.slug,
    category: p.details?.category || 'Catálogo Oficial',
    price: Number(p.price) || 0,
    originalPrice: p.price ? Math.round(Number(p.price) * 1.35) : undefined,
    currency: p.currency || 'USD',
    image: images[0] || '',
    images: images,
    stock: 25,
    inStock: true,
    benefits: Array.isArray(p.benefits) && p.benefits.length > 0 ? p.benefits : [
      'Disponibilidad 24/7: Atención siempre activa, incluso fuera de horario.',
      'Respuestas instantáneas: Reduce el tiempo de espera para tus clientes.',
      'Mejora la satisfacción con experiencias personalizadas y reduce costos operativos.'
    ],
    description: p.full_description || p.short_description || '',
    specifications: p.details || {}
  };
}

export function useProductResolver(productId: string | null, tenantSlug: string = 'geosoft') {
  const cached = getCachedTenant(tenantSlug);
  const initialStoreName = cached.name || 'Restaurante ClikChat';

  const [productItem, setProductItem] = useState<ProductItem | null>(null);
  const [storeName, setStoreName] = useState<string>(initialStoreName);
  const [agentName, setAgentName] = useState<string>(cached.bot_name || 'Asesora Virtual');
  const [agentAvatar, setAgentAvatar] = useState<string>(cached.avatar_url || '');
  const [welcomeMessage, setWelcomeMessage] = useState<string>(cached.welcome_message || '');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [responseDelaySec, setResponseDelaySec] = useState<number>(cached.response_delay_sec || 1);
  const [businessType, setBusinessType] = useState<string>(cached.business_type || 'restaurante');
  const hasTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      setIsLoading(true);

      // If no productId, fetch first product of tenant
      if (!productId) {
        try {
          const tRes = await fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' });
          if (tRes.ok) {
            const tData = await tRes.json();
            if (tData.tenant?.name && isMounted) setStoreName(tData.tenant.name);
            if (tData.tenant?.bot_name && isMounted) setAgentName(tData.tenant.bot_name);
            if (tData.tenant?.avatar_url && isMounted) setAgentAvatar(tData.tenant.avatar_url);
            if (tData.tenant?.welcome_message && isMounted) setWelcomeMessage(tData.tenant.welcome_message);
            if (tData.tenant?.response_delay_sec !== undefined && tData.tenant?.response_delay_sec !== null && isMounted) {
              setResponseDelaySec(Math.max(1, Number(tData.tenant.response_delay_sec)));
            }
            if (tData.tenant?.business_type && isMounted) setBusinessType(tData.tenant.business_type);
            if (tData.products && tData.products.length > 0 && isMounted) {
              setProductItem(toProductItem(tData.products[0]));
              return;
            }
          }
        } catch (e) {}
        if (isMounted) {
          setProductItem({
            ...DEFAULT_PRODUCT,
            title: `Catálogo Oficial`,
            description: `Bienvenido a la tienda de ${initialStoreName}.`,
            image: '',
            images: []
          });
        }
        setIsLoading(false);
        return;
      }

      // Check localStorage for instant preview
      try {
        const savedProds = localStorage.getItem('clikchat_products');
        if (savedProds) {
          const list: Product[] = JSON.parse(savedProds);
          const found = list.find((p) => p.id === productId || p.slug === productId);
          if (found && isMounted) {
            setProductItem(toProductItem(found));
          }
        }
      } catch (e) {}

      // Fetch from Cloudflare D1 Edge
      try {
        const [prodRes, tenantRes] = await Promise.allSettled([
          fetch('/api/products/' + encodeURIComponent(productId), { cache: 'no-store' }),
          fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' })
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const data = await prodRes.value.json();
          if (data.product && isMounted) {
            setProductItem(toProductItem(data.product));
          }
        }

        if (tenantRes.status === 'fulfilled' && tenantRes.value.ok) {
          const tData = await tenantRes.value.json();
          if (tData.tenant && isMounted) {
            if (tData.tenant.name) setStoreName(tData.tenant.name);
            if (tData.tenant.bot_name) setAgentName(tData.tenant.bot_name);
            if (tData.tenant.avatar_url) setAgentAvatar(tData.tenant.avatar_url);
            if (tData.tenant.welcome_message) setWelcomeMessage(tData.tenant.welcome_message);
            if (tData.tenant.response_delay_sec !== undefined && tData.tenant.response_delay_sec !== null) {
              setResponseDelaySec(Math.max(1, Number(tData.tenant.response_delay_sec)));
            }
            if (tData.tenant.business_type) setBusinessType(tData.tenant.business_type);
          }
          if (tData.products && Array.isArray(tData.products)) {
            const foundInTenant = tData.products.find((p: Product) => p.id === productId || p.slug === productId);
            if (foundInTenant && isMounted) {
              setProductItem(toProductItem(foundInTenant));
            } else if (tData.products.length > 0 && isMounted) {
              setProductItem(toProductItem(tData.products[0]));
            } else if (isMounted) {
              setProductItem({
                ...DEFAULT_PRODUCT,
                title: `Catálogo Oficial`,
                description: `Bienvenido a la tienda de ${tData.tenant?.name || initialStoreName}.`,
                image: '',
                images: []
              });
            }
          }
        }

        // Deduplicar: Contar estrictamente 1 sola apertura por sesión de visita
        const now = Date.now();
        const sessionKey = `clik_view_${productId}`;
        const lastTracked = typeof window !== 'undefined' ? sessionStorage.getItem(sessionKey) : null;
        const cooldownMs = 15000;

        if (hasTrackedRef.current !== productId && (!lastTracked || now - Number(lastTracked) > cooldownMs)) {
          hasTrackedRef.current = productId;
          if (typeof window !== 'undefined') {
            try { sessionStorage.setItem(sessionKey, String(now)); } catch (e) {}
          }
          fetch('/api/products/' + encodeURIComponent(productId) + '/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'view' })
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Error resolviendo producto para QLink:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    resolve();
    return () => { isMounted = false; };
  }, [productId, tenantSlug]);

  return { productItem, storeName, agentName, agentAvatar, welcomeMessage, isLoading, responseDelaySec, businessType };
}

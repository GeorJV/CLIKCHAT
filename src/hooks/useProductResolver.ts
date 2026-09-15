import { useState, useEffect } from 'react';
import { ProductItem } from '../types/productChat';
import { Product } from '../types';
import { DEFAULT_PRODUCT } from '../components/chat/product/productChatMock';

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

export function useProductResolver(productId: string | null, tenantSlug: string) {
  const [productItem, setProductItem] = useState<ProductItem>(DEFAULT_PRODUCT);
  const [storeName, setStoreName] = useState<string>('Clikchat Store');
  const [agentName, setAgentName] = useState<string>('Sofía');
  const [agentAvatar, setAgentAvatar] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      setIsLoading(true);

      // If no productId, fetch first product of tenant or keep DEFAULT_PRODUCT
      if (!productId) {
        try {
          const tRes = await fetch('/api/tenants/' + encodeURIComponent(tenantSlug));
          if (tRes.ok) {
            const tData = await tRes.json();
            if (tData.tenant?.name && isMounted) setStoreName(tData.tenant.name);
            if (tData.tenant?.bot_name && isMounted) setAgentName(tData.tenant.bot_name);
            if (tData.tenant?.avatar_url && isMounted) setAgentAvatar(tData.tenant.avatar_url);
            if (tData.products && tData.products.length > 0 && isMounted) {
              setProductItem(toProductItem(tData.products[0]));
              return;
            }
          }
        } catch (e) {}
        if (isMounted) setProductItem(DEFAULT_PRODUCT);
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
          fetch('/api/products/' + encodeURIComponent(productId)),
          fetch('/api/tenants/' + encodeURIComponent(tenantSlug))
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
          }
          if (tData.products && Array.isArray(tData.products)) {
            const foundInTenant = tData.products.find((p: Product) => p.id === productId || p.slug === productId);
            if (foundInTenant && isMounted) {
              setProductItem(toProductItem(foundInTenant));
            }
          }
        }

        // Track real view in D1
        fetch('/api/products/' + encodeURIComponent(productId) + '/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'view' })
        }).catch(() => {});
      } catch (err) {
        console.warn('Error resolviendo producto para QLink:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    resolve();
    return () => { isMounted = false; };
  }, [productId, tenantSlug]);

  return { productItem, storeName, agentName, agentAvatar, isLoading };
}

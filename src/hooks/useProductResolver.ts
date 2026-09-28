import { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../types/productChat';
import { Product } from '../types';
import { DEFAULT_PRODUCT } from '../components/chat/product/productChatMock';
import { getCachedTenant, saveCachedTenant } from '../utils/fallbackTenant';

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

function synthesizeFallbackProduct(idOrSlug: string, isRestaurant: boolean, currency: string = 'CRC'): ProductItem {
  const isId = idOrSlug.startsWith('prod_');
  const title = isId ? (isRestaurant ? 'Especialidad de la Casa' : 'Producto Destacado') : idOrSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const isCRC = (currency || 'CRC').toUpperCase() === 'CRC';
  const price = isCRC ? (isRestaurant ? 5500 : 15000) : (isRestaurant ? 9.99 : 24.99);
  return {
    id: idOrSlug, title, slug: isId ? 'especialidad' : idOrSlug, category: isRestaurant ? 'Plato Principal' : 'Catálogo Oficial',
    price, currency, image: '', images: [], stock: 50, inStock: true,
    benefits: isRestaurant ? ['Ingredientes frescos del día.', 'Preparación artesanal al momento.', 'Guarnición o bebida opcional.'] : ['Garantía oficial y entrega inmediata.', 'Atención personalizada 24/7.'],
    description: isRestaurant ? `Disfruta de ${title}, preparado con ingredientes frescos y auténtico sabor.` : `${title} con las mejores especificaciones de la tienda.`,
    specifications: {}
  };
}

export function useProductResolver(productId: string | null, tenantSlug: string = 'comida-callejera-xl') {
  const cached = getCachedTenant(tenantSlug);
  const isRestaurant = cached.business_type === 'restaurante' || /comida|callejera|restaurante/i.test(tenantSlug);
  const initialStoreName = (cached.name && cached.name !== 'Tienda Oficial') ? cached.name : (tenantSlug === 'comida-callejera-xl' ? 'COMIDA CALLEJERA XL' : 'Tienda Oficial');
  const initialBotName = tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : (cached.bot_name && cached.bot_name !== 'Asesor Comercial' ? cached.bot_name : (isRestaurant ? 'Mesero Virtual' : 'Asesor Comercial'));

  const [productItem, setProductItem] = useState<ProductItem | null>(() => {
    if (!productId || typeof window === 'undefined') return null;
    try {
      const keys = [`clikchat_products_${tenantSlug}`, 'clikchat_products'];
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

  const [storeName, setStoreName] = useState<string>(initialStoreName);
  const [agentName, setAgentName] = useState<string>(initialBotName);
  const [agentAvatar, setAgentAvatar] = useState<string>(cached.avatar_url || '');
  const [welcomeMessage, setWelcomeMessage] = useState<string>(cached.welcome_message || '');
  const [isLoading, setIsLoading] = useState<boolean>(!productItem);
  const [responseDelaySec, setResponseDelaySec] = useState<number>(cached.response_delay_sec || 1);
  const [businessType, setBusinessType] = useState<string>(isRestaurant ? 'restaurante' : (cached.business_type || 'tienda'));

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      if (!productItem) setIsLoading(true);

      // 1. Si no hay productId, resolver catálogo general de la tienda
      if (!productId) {
        let defaultItem: ProductItem = {
          ...DEFAULT_PRODUCT,
          title: 'Catálogo Oficial',
          description: `Bienvenido a la tienda de ${initialStoreName}.`,
          currency: cached.currency || 'CRC'
        };
        try {
          const tRes = await fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' });
          const ct = tRes.headers.get('content-type') || '';
          if (tRes.ok && ct.includes('application/json')) {
            const tData = await tRes.json();
            if (tData.tenant && isMounted) {
              const t = tData.tenant;
              if (t.name) setStoreName(t.name);
              if (t.bot_name) setAgentName(tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : t.bot_name);
              if (t.avatar_url) setAgentAvatar(t.avatar_url);
              if (t.welcome_message) setWelcomeMessage(t.welcome_message);
              if (t.business_type) setBusinessType(t.business_type);
              saveCachedTenant(t);
            }
            if (tData.products && tData.products.length > 0) {
              const clean = tData.products.filter((p: any) => p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
              if (clean.length > 0) defaultItem = toProductItem(clean[0]);
            }
          }
        } catch (e) {}

        if (isMounted) {
          setProductItem(defaultItem);
          setIsLoading(false);
        }
        return;
      }

      // 2. Comprobar caché local multi-fuente (prioridad instantánea sin latencia)
      let resolvedItem: ProductItem | null = productItem;
      try {
        const localKeys = [`clikchat_products_${tenantSlug}`, 'clikchat_products'];
        for (const key of localKeys) {
          const saved = localStorage.getItem(key);
          if (saved) {
            const list: Product[] = JSON.parse(saved);
            let found = list.find((p) => (p.id === productId || p.slug === productId) && p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
            if (!found && !productId.startsWith('prod_')) {
              found = list.find((p) => p.name?.toLowerCase() === productId.replace(/-/g, ' ').toLowerCase() && p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
            }
            if (found) {
              resolvedItem = toProductItem(found);
              break;
            }
          }
        }
      } catch (e) {}

      if (resolvedItem && isMounted) {
        setProductItem(resolvedItem);
      }

      // 3. Consulta de red resiliente con verificación estricta de Content-Type
      try {
        const prodPromise = fetch('/api/products/' + encodeURIComponent(productId), { cache: 'no-store' })
          .then(async res => {
            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) return res.json();
            return null;
          }).catch(() => null);

        const tenantPromise = fetch('/api/tenants/' + encodeURIComponent(tenantSlug), { cache: 'no-store' })
          .then(async res => {
            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) return res.json();
            return null;
          }).catch(() => null);

        const [prodData, tenantData] = await Promise.all([prodPromise, tenantPromise]);

        if (prodData?.product && isMounted) {
          resolvedItem = toProductItem(prodData.product);
          setProductItem(resolvedItem);
        }

        if (tenantData?.tenant && isMounted) {
          const t = tenantData.tenant;
          if (t.name) setStoreName(t.name);
          if (t.bot_name) setAgentName(tenantSlug === 'comida-callejera-xl' ? 'Valeria (Mesera Virtual)' : t.bot_name);
          if (t.avatar_url) setAgentAvatar(t.avatar_url);
          if (t.welcome_message) setWelcomeMessage(t.welcome_message);
          if (t.business_type) setBusinessType(t.business_type);
          saveCachedTenant(t);
        }

        if (!resolvedItem && tenantData?.products && Array.isArray(tenantData.products)) {
          const cleanProds = tenantData.products.filter((p: Product) => p.id !== 'prod_1789447247688' && !p.images?.[0]?.includes('cornell.edu'));
          const found = cleanProds.find((p: Product) => p.id === productId || p.slug === productId);
          if (found && isMounted) { resolvedItem = toProductItem(found); setProductItem(resolvedItem); }
        }
      } catch (err) {}
      if (!resolvedItem && isMounted) setProductItem(synthesizeFallbackProduct(productId, isRestaurant, cached.currency || 'CRC'));
      if (isMounted) setIsLoading(false);
    }
    resolve();
    return () => { isMounted = false; };
  }, [productId, tenantSlug]);

  return { productItem, storeName, agentName, agentAvatar, welcomeMessage, isLoading, responseDelaySec, businessType };
}

import { useState, useEffect } from 'react';
import { Tenant, Product, FAQ } from '../types';
import { getCachedTenant, saveCachedTenant } from '../utils/fallbackTenant';

interface UseTenantDataResult {
  tenant: Tenant;
  products: Product[];
  faqs: FAQ[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isLoadingTenant: boolean;
  tenantError: string | null;
}

export function useTenantData(tenantSlug: string = 'geosoft'): UseTenantDataResult {
  const [tenant, setTenant] = useState<Tenant>(() => getCachedTenant(tenantSlug));
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`clikchat_products_${tenantSlug}`);
        if (saved) return JSON.parse(saved);
        if (tenantSlug === 'geosoft') {
          const oldGlobal = localStorage.getItem('clikchat_products');
          if (oldGlobal) return JSON.parse(oldGlobal);
        }
      } catch (e) {}
    }
    return [];
  });
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`clikchat_faqs_${tenantSlug}`);
        if (saved) return JSON.parse(saved);
        if (tenantSlug === 'geosoft') {
          const oldGlobal = localStorage.getItem('clikchat_faqs');
          if (oldGlobal) return JSON.parse(oldGlobal);
        }
      } catch (e) {}
    }
    return [];
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => products[0] || null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTenant() {
      setTenantError(null);
      try {
        const res = await fetch(`/api/tenants/${encodeURIComponent(tenantSlug)}`, { cache: 'no-store' });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json();
          if (isMounted && data.tenant) {
            setTenant(data.tenant);
            saveCachedTenant(data.tenant);
            const prods: Product[] = data.products || [];
            if (prods.length > 0) {
              setProducts(prods);
              setSelectedProduct(prev => prev || prods[0]);
            }
            if (data.faqs) setFaqs(data.faqs);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setTenant(prev => prev || getCachedTenant(tenantSlug));
        }
      } finally {
        if (isMounted) setIsLoadingTenant(false);
      }
    }

    loadTenant();
    return () => { isMounted = false; };
  }, [tenantSlug]);

  return {
    tenant,
    products,
    faqs,
    selectedProduct,
    setSelectedProduct,
    isLoadingTenant,
    tenantError
  };
}

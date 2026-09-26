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
        const saved = localStorage.getItem('clikchat_products');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('clikchat_faqs');
        if (saved) return JSON.parse(saved);
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
        if (!res.ok) throw new Error('No se pudo cargar la tienda desde el servidor');
        const data = await res.json();

        if (isMounted && data.tenant) {
          setTenant(data.tenant);
          saveCachedTenant(data.tenant);
          const prods: Product[] = data.products || [];
          setProducts(prods);
          setFaqs(data.faqs || []);
          if (prods.length > 0) {
            setSelectedProduct(prev => prev || prods[0]);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setTenantError(err instanceof Error ? err.message : 'Error de conexión');
          // Garantizar que siempre haya un tenant válido cargado
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

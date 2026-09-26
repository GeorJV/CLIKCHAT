import { useState, useEffect } from 'react';
import { Tenant, Product, FAQ } from '../types';

interface UseTenantDataResult {
  tenant: Tenant | null;
  products: Product[];
  faqs: FAQ[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isLoadingTenant: boolean;
  tenantError: string | null;
}

export function useTenantData(tenantSlug: string = 'geosoft'): UseTenantDataResult {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(true);
  const [tenantError, setTenantError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTenant() {
      setIsLoadingTenant(true);
      setTenantError(null);
      try {
        const res = await fetch(`/api/tenants/${encodeURIComponent(tenantSlug)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('No se pudo cargar la tienda');
        const data = await res.json();

        if (isMounted) {
          setTenant(data.tenant || null);
          const prods: Product[] = data.products || [];
          setProducts(prods);
          setFaqs(data.faqs || []);
          if (prods.length > 0) {
            setSelectedProduct(prods[0]);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setTenantError(err instanceof Error ? err.message : 'Error desconocido');
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

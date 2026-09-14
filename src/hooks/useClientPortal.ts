import { useState, useEffect, useCallback } from 'react';
import { Tenant, Product, FAQ, UnresolvedQuery } from '../types';
import { TenantListItem } from '../types/client';

export function useClientPortal(initialSlug: string = 'acme-store') {
  const [tenantSlug, setTenantSlug] = useState<string>(initialSlug);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [unresolved, setUnresolved] = useState<UnresolvedQuery[]>([]);
  const [availableTenants, setAvailableTenants] = useState<TenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const loadTenantsList = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants');
      if (res.ok) {
        const data = await res.json();
        setAvailableTenants(data.tenants || []);
      }
    } catch (err) {
      console.warn('Error loading tenants list:', err);
    }
  }, []);

  const loadTenantData = useCallback(async (slugToLoad: string = tenantSlug) => {
    setIsLoading(true);
    try {
      const tRes = await fetch(`/api/tenants/${slugToLoad}`);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTenant(tData.tenant);
        setProducts(tData.products || []);
        setFaqs(tData.faqs || []);
        if (tData.tenant?.id) {
          const uRes = await fetch(`/api/audit/unresolved?tenantId=${tData.tenant.id}`);
          if (uRes.ok) {
            const uData = await uRes.json();
            setUnresolved(uData.unresolved || []);
          }
        }
      }
    } catch (err) {
      console.error('Error loading tenant data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => { loadTenantsList(); }, [loadTenantsList]);
  useEffect(() => { if (tenantSlug) loadTenantData(tenantSlug); }, [tenantSlug, loadTenantData]);

  const resolveQuery = async (queryId: string, answer: string, category: string = 'consultas_resueltas') => {
    if (!answer.trim()) return false;
    try {
      const res = await fetch(`/api/audit/resolve/${queryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim(), category, autoInjectToFaq: true })
      });
      if (res.ok) {
        await loadTenantData(tenantSlug);
        return true;
      }
    } catch (err) {
      console.error('Error resolving query:', err);
    }
    return false;
  };

  const createFaq = async (question: string, answer: string, category: string = 'general') => {
    if (!tenant?.id || !question.trim() || !answer.trim()) return false;
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenant.id, question: question.trim(), answer: answer.trim(), category, confidence_threshold: 0.65 })
      });
      if (res.ok) {
        await loadTenantData(tenantSlug);
        return true;
      }
    } catch (err) {
      console.error('Error creating FAQ:', err);
    }
    return false;
  };

  const deleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
    return false;
  };

  const createProduct = async (productData: Partial<Product> & { name: string; price: number }) => {
    if (!tenant?.id || !productData.name) return false;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, tenant_id: tenant.id })
      });
      if (res.ok) {
        await loadTenantData(tenantSlug);
        return true;
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
    return false;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await loadTenantData(tenantSlug);
        return true;
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
    return false;
  };

  const updateSettings = async (updates: Partial<Tenant>) => {
    if (!tenant?.id) return false;
    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setTenant(data.tenant);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return true;
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    }
    return false;
  };

  return {
    tenantSlug, setTenantSlug, tenant, products, faqs, unresolved,
    availableTenants, isLoading, saveSuccess, loadTenantData,
    resolveQuery, createFaq, deleteFaq, createProduct, updateProduct, deleteProduct, updateSettings
  };
}

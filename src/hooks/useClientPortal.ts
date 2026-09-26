import { useState, useEffect, useCallback } from 'react';
import { Tenant, Product, FAQ, UnresolvedQuery } from '../types';
import { TenantListItem } from '../types/client';

export function useClientPortal(initialSlug: string = 'acme-store') {
  const [tenantSlug, setTenantSlug] = useState<string>(initialSlug);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('clikchat_products');
        if (saved !== null) return JSON.parse(saved);
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
  const [unresolved, setUnresolved] = useState<UnresolvedQuery[]>([]);
  const [availableTenants, setAvailableTenants] = useState<TenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('clikchat_products', JSON.stringify(products));
        if (faqs.length > 0) localStorage.setItem('clikchat_faqs', JSON.stringify(faqs));
      } catch (e) {}
    }
  }, [products, faqs]);

  const loadTenantsList = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setAvailableTenants(data.tenants || []);
      }
    } catch (err) {
      console.warn('Error loading tenants list:', err);
    }
  }, []);

  const loadTenantData = useCallback(async (slugToLoad: string = tenantSlug, isBackground: boolean = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const tRes = await fetch(`/api/tenants/${slugToLoad}`, { cache: 'no-store' });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTenant(prev => {
          if (!prev) return tData.tenant;
          if (JSON.stringify(prev) === JSON.stringify(tData.tenant)) {
            return prev;
          }
          return tData.tenant;
        });
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
      if (!isBackground) setIsLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => { loadTenantsList(); }, [loadTenantsList]);
  useEffect(() => { if (tenantSlug) loadTenantData(tenantSlug); }, [tenantSlug, loadTenantData]);

  // Periodic background refresh for real live metrics every 8 seconds
  useEffect(() => {
    if (!tenantSlug) return;
    const interval = setInterval(() => {
      loadTenantData(tenantSlug, true);
    }, 8000);
    return () => clearInterval(interval);
  }, [tenantSlug, loadTenantData]);

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
    if (!question.trim() || !answer.trim()) return false;
    const newFaq: FAQ = {
      id: `faq_${Date.now()}`,
      tenant_id: tenant?.id || 'tenant-demo',
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || 'general',
      confidence_threshold: 0.65,
      source: 'manual'
    };
    setFaqs(prev => [newFaq, ...prev]);
    try {
      if (tenant?.id) {
        await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenant_id: tenant.id, question: question.trim(), answer: answer.trim(), category, confidence_threshold: 0.65 })
        });
      }
    } catch (err) {
      console.warn('FAQ saved locally, backend sync warning:', err);
    }
    return true;
  };

  const deleteFaq = async (id: string) => {
    try {
      localStorage.removeItem('clikchat_faqs');
    } catch (e) {}
    setFaqs(prev => prev.filter(f => f.id !== id));
    try {
      await fetch(`/api/faqs/${encodeURIComponent(id)}`, { method: 'DELETE', cache: 'no-store' });
    } catch (err) {
      console.warn('FAQ deleted locally:', err);
    }
    return true;
  };

  const updateFaq = async (id: string, answer: string, question?: string, category?: string) => {
    if (!answer.trim()) return false;
    try {
      localStorage.removeItem('clikchat_faqs');
    } catch (e) {}
    setFaqs(prev => prev.map(f => {
      if (f.id !== id) return f;
      return {
        ...f,
        answer: answer.trim(),
        ...(question ? { question: question.trim() } : {}),
        ...(category ? { category: category.trim() } : {})
      };
    }));
    try {
      await fetch(`/api/faqs/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          answer: answer.trim(),
          ...(question ? { question: question.trim() } : {}),
          ...(category ? { category: category.trim() } : {})
        })
      });
    } catch (err) {
      console.warn('FAQ updated locally:', err);
    }
    return true;
  };

  const createBulkFaqs = async (faqsToCreate: Array<{ question: string; answer: string; category?: string }>, source: string = 'archivo') => {
    if (!faqsToCreate.length) return false;
    const newFaqs: FAQ[] = faqsToCreate.map((f, i) => ({
      id: `faq_${Date.now()}_${i}`,
      tenant_id: tenant?.id || 'tenant-demo',
      question: f.question.trim(),
      answer: f.answer.trim(),
      category: f.category?.trim() || 'general',
      confidence_threshold: 0.65,
      source
    }));
    setFaqs(prev => [...newFaqs, ...prev]);
    try {
      if (tenant?.id) {
        await fetch('/api/faqs/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenant_id: tenant.id, faqs: faqsToCreate, source })
        });
      }
    } catch (err) {
      console.warn('Bulk FAQs saved locally, backend sync warning:', err);
    }
    return true;
  };

  const createProduct = async (productData: Partial<Product> & { name: string; price: number }) => {
    if (!productData.name) return false;
    const targetTenantId = tenant?.id || 'a0000000-0000-0000-0000-000000000001';
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      tenant_id: targetTenantId,
      name: productData.name,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      price: productData.price,
      currency: productData.currency || 'USD',
      short_description: productData.short_description || '',
      full_description: productData.full_description || productData.short_description || '',
      images: productData.images && productData.images.length > 0 ? productData.images : [],
      benefits: productData.benefits || [],
      details: productData.details || { category: 'General', sku: `SKU-${Date.now().toString().slice(-4)}` },
      cta_label: 'Comprar Ahora',
      cta_url: productData.cta_url || `https://wa.me/50688888888?text=Hola,%20deseo%20${encodeURIComponent(productData.name)}`,
      is_active: true,
      metrics: {
        views: 0,
        buyClicks: 0,
        benefitViews: 0,
        coldLeads: 0,
        warmLeads: 0,
        hotLeads: 0
      }
    };
    setProducts(prev => {
      const next = [newProd, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('clikchat_products', JSON.stringify(next));
      }
      return next;
    });
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProd, tenant_id: targetTenantId })
      });
    } catch (err) {
      console.warn('Product saved locally, backend sync warning:', err);
    }
    return true;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      if (typeof window !== 'undefined') {
        localStorage.setItem('clikchat_products', JSON.stringify(next));
      }
      return next;
    });
    try {
      await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn('Product updated locally:', err);
    }
    return true;
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('clikchat_products', JSON.stringify(next));
      }
      return next;
    });
    try {
      await fetch(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Product deleted locally:', err);
    }
    return true;
  };

  const updateSettings = async (updates: Partial<Tenant>) => {
    const targetIdentifier = tenant?.id || tenant?.slug || tenantSlug;
    if (!targetIdentifier) return false;
    try {
      const res = await fetch(`/api/tenants/${encodeURIComponent(targetIdentifier)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tenant) {
          setTenant(data.tenant);
          if (data.tenant.slug && data.tenant.slug !== tenantSlug) {
            setTenantSlug(data.tenant.slug);
          }
        }
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
    resolveQuery, createFaq, updateFaq, deleteFaq, createBulkFaqs, createProduct, updateProduct, deleteProduct, updateSettings
  };
}

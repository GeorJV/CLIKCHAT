import { useState, useEffect, useCallback, useMemo } from 'react';
import { MerchantAdminItem, EditSubFormData, AiSpendingMetrics } from '../types/adminDirectory';

export function useAdminDirectory() {
  const [merchants, setMerchants] = useState<MerchantAdminItem[]>([]);
  const [aiMetrics, setAiMetrics] = useState<AiSpendingMetrics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAdminItem | null>(null);
  const [isSavingSub, setIsSavingSub] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editSubForm, setEditSubForm] = useState<EditSubFormData>({
    plan: 'pro',
    billingCycle: 'monthly',
    monthlyPrice: 79,
    currency: 'CRC',
    businessType: 'restaurante',
    nextBillingDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMerchants = useCallback(async () => {
    setIsLoading(true);
    try {
      const [merchRes, aiRes] = await Promise.all([
        fetch('/api/admin/merchants'),
        fetch('/api/admin/ai-spending-metrics')
      ]);
      if (merchRes.ok) {
        const mData = await merchRes.json();
        if (mData?.merchants) setMerchants(mData.merchants);
      }
      if (aiRes.ok) {
        const aData = await aiRes.json();
        setAiMetrics(aData);
      }
    } catch (err) {
      console.error('Error fetching directory data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleOpenSubModal = (m: MerchantAdminItem) => {
    setSelectedMerchant(m);
    setEditSubForm({
      plan: m.plan || 'pro',
      billingCycle: m.billing_cycle || 'monthly',
      monthlyPrice: m.monthly_price ?? 79,
      currency: m.currency || 'CRC',
      businessType: m.business_type || 'restaurante',
      nextBillingDate: m.next_billing_date || new Date().toISOString().split('T')[0],
      status: m.status || 'active'
    });
    setIsSubModalOpen(true);
  };

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant) return;
    setIsSavingSub(true);
    try {
      const res = await fetch(`/api/admin/merchants/${selectedMerchant.id}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSubForm)
      });
      if (res.ok) {
        showToast('¡Suscripción actualizada exitosamente en Cloudflare D1!');
        setIsSubModalOpen(false);
        fetchMerchants();
      } else {
        showToast('Error al actualizar en Cloudflare D1');
      }
    } catch (err) {
      showToast('Error de conexión con el servidor');
    } finally {
      setIsSavingSub(false);
    }
  };

  const filteredMerchants = useMemo(() => {
    if (!searchTerm.trim()) return merchants;
    const s = searchTerm.toLowerCase();
    return merchants.filter(m =>
      (m.name && m.name.toLowerCase().includes(s)) ||
      (m.owner_email && m.owner_email.toLowerCase().includes(s)) ||
      (m.slug && m.slug.toLowerCase().includes(s))
    );
  }, [merchants, searchTerm]);

  return {
    merchants: filteredMerchants,
    totalCount: merchants.length,
    aiMetrics,
    searchTerm,
    setSearchTerm,
    isLoading,
    fetchMerchants,
    isSubModalOpen,
    setIsSubModalOpen,
    selectedMerchant,
    editSubForm,
    setEditSubForm,
    handleOpenSubModal,
    handleSaveSub,
    isSavingSub,
    toastMessage
  };
}

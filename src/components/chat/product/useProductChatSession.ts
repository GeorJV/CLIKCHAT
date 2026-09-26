import { useState, useEffect, useCallback } from 'react';
import { ProductItem, ProductChatMessage, ProductCheckoutData } from '../../../types/productChat';
import { adaptTemporalText } from '../../../utils/temporalGreeting';

interface UseProductChatSessionOptions {
  selectedProduct: ProductItem;
  storeName: string;
  agentName: string;
  welcomeMessage?: string;
  isRestaurant: boolean;
  onResetOrderTotal: () => void;
  onRestoreOrderTotal?: (total: number) => void;
}

export function useProductChatSession({
  selectedProduct, storeName, agentName, welcomeMessage, isRestaurant, onResetOrderTotal, onRestoreOrderTotal
}: UseProductChatSessionOptions) {
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);

  const [sessId, setSessId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'sess_' + Date.now().toString(36);
    const key = `clik_sess_prod_${selectedProduct.id || 'default'}`;
    const saved = sessionStorage.getItem(key);
    if (saved) return saved;
    const created = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    sessionStorage.setItem(key, created);
    return created;
  });

  const handleResetChat = useCallback(() => {
    if (typeof window !== 'undefined' && selectedProduct.id) {
      sessionStorage.removeItem(`clik_sess_prod_${selectedProduct.id}`);
      const newSess = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
      sessionStorage.setItem(`clik_sess_prod_${selectedProduct.id}`, newSess);
      setSessId(newSess);
      onResetOrderTotal();
    }
  }, [selectedProduct.id, onResetOrderTotal]);

  useEffect(() => {
    if (selectedProduct.id && typeof window !== 'undefined') {
      const storageKey = `clik_sess_prod_${selectedProduct.id}`;
      let cur = sessionStorage.getItem(storageKey);
      if (!cur) {
        cur = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem(storageKey, cur);
      }
      setSessId(cur);
    }
  }, [selectedProduct.id]);

  useEffect(() => {
    if (!selectedProduct?.title || !storeName) return;
    let isMounted = true;
    fetch(`/api/chat/messages/${sessId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.messages && data.messages.length > 0) {
          setMessages(data.messages);
          if (typeof data?.activeOrder?.totalAmount === 'number' && data.activeOrder.totalAmount > 0) {
            onRestoreOrderTotal?.(data.activeOrder.totalAmount);
          }
        } else if (isMounted) {
          const defaultGreeting = `¡Hola! 👋 Soy **${agentName}**, asesora de **${storeName}**.\n\nVeo que estás mirando **${selectedProduct.title}** ($${selectedProduct.price.toFixed(2)} ${selectedProduct.currency}).\n\n¿Tienes alguna duda sobre los beneficios o deseas apartar tu pedido?`;
          const dynamicGreeting = welcomeMessage
            ? adaptTemporalText(welcomeMessage.replace(/\{nombre_del_negocio\}|\{negocio\}/gi, storeName).replace(/\{asesor\}|\{bot\}/gi, agentName).replace(/\{producto\}/gi, selectedProduct.title))
            : defaultGreeting;
          setMessages([{
            id: `msg-${Date.now()}`, sessionId: sessId, tenantId: 'tenant-demo', sender: 'assistant',
            content: dynamicGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ragTrace: { levelUsed: 3, confidence: 0.95, executionTimeMs: 14, modelUsed: 'RAG Edge', reasoning: 'Bienvenida catálogo' },
          }]);
        }
      }).catch(() => {});
    return () => { isMounted = false; };
  }, [selectedProduct.id, selectedProduct.title, agentName, storeName, sessId, welcomeMessage]);

  const trackEvent = (event: string, temperature?: string) => {
    if (!selectedProduct.id) return;
    fetch(`/api/products/${selectedProduct.id}/track`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, temperature })
    }).catch(() => {});
  };

  const handleConfirmCheckout = (data: ProductCheckoutData) => {
    trackEvent('lead', 'hot');
    trackEvent('buy_click');
    setMessages((prev) => [...prev, {
      id: `order-${Date.now()}`, sessionId: sessId, tenantId: 'tenant', sender: 'assistant',
      content: `🛍️ **¡Pedido Registrado con Éxito!**\n\n- **Producto:** ${data.product.title} (x${data.quantity})\n- **Total:** $${data.totalAmount.toFixed(2)} ${data.product.currency}\n- **Destinatario:** ${data.customerName} (${data.customerPhone})\n- **Dirección:** ${data.shippingAddress}\n\nTe contactaremos a tu WhatsApp con el enlace de despacho.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return { messages, setMessages, sessId, handleResetChat, trackEvent, handleConfirmCheckout };
}

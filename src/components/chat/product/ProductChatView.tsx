import React, { useState, useEffect } from 'react';
import { ProductItem, ProductChatMessage, ProductCheckoutData } from '../../../types/productChat';
import { ProductChatColumn } from './ProductChatColumn';
import { ProductShowcase } from './ProductShowcase';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFullscreenModal } from './ProductFullscreenModal';
import { ProductCheckoutModal } from './ProductCheckoutModal';

const BLANK_PRODUCT: ProductItem = {
  id: '',
  title: 'Cargando producto...',
  category: 'General',
  price: 0,
  currency: 'USD',
  stock: 0,
  image: '',
  images: [],
  benefits: ['Atención directa con IA', 'Garantía oficial', 'Soporte personalizado'],
  description: ''
};

interface Props {
  storeName?: string;
  agentName?: string;
  agentAvatar?: string;
  products?: ProductItem[];
  initialProduct?: ProductItem;
  onExit?: () => void;
}

export const ProductChatView: React.FC<Props> = ({
  storeName = 'Clikchat Store',
  agentName = 'Sofía',
  agentAvatar,
  products = [],
  initialProduct,
  onExit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProduct || products[0] || BLANK_PRODUCT);
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'benefits' | 'specs' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (initialProduct) setSelectedProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (!selectedProduct.title || selectedProduct.title === 'Cargando producto...') return;
    const welcomeMsg: ProductChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: `sess-${Date.now()}`,
      tenantId: 'tenant-demo',
      sender: 'assistant',
      content: `¡Hola! 👋 Soy **${agentName}**, asesora de **${storeName}**.\n\nVeo que estás mirando **${selectedProduct.title}** ($${selectedProduct.price.toFixed(2)} ${selectedProduct.currency}).\n\n¿Tienes alguna duda sobre los beneficios o deseas apartar tu pedido?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragTrace: { levelUsed: 3, confidence: 0.98, executionTimeMs: 14, modelUsed: 'Catálogo D1 Edge', reasoning: 'Bienvenida contextualizada.' },
    };
    setMessages([welcomeMsg]);
  }, [selectedProduct.id, selectedProduct.title]);

  const trackEvent = (event: string, temperature?: string) => {
    if (!selectedProduct.id) return;
    fetch(`/api/products/${selectedProduct.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, temperature })
    }).catch(() => {});
  };

  const handleSendMessage = (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text || isLoading) return;
    const userMsg: ProductChatMessage = {
      id: `user-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'user', content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    trackEvent('chat_message');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
        content: `¡Excelente consulta! **${selectedProduct.title}** cuenta con despacho express en 24/48h, garantía de 30 días y stock activo. Pulsa **"Comprar Ahora"** para completar tu pedido.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragTrace: { levelUsed: 2, confidence: 0.96, executionTimeMs: 16, modelUsed: 'FAQ RAG Hybrid L2', reasoning: 'Respuesta validada.' },
      }]);
      setIsLoading(false);
    }, 700);
  };

  const handleConfirmCheckout = (data: ProductCheckoutData) => {
    trackEvent('lead', 'hot');
    trackEvent('buy_click');
    setMessages((prev) => [...prev, {
      id: `order-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
      content: `🛍️ **¡Pedido Registrado con Éxito!**\n\n- **Producto:** ${data.product.title} (x${data.quantity})\n- **Total:** $${data.totalAmount.toFixed(2)} ${data.product.currency}\n- **Destinatario:** ${data.customerName} (${data.customerPhone})\n- **Dirección:** ${data.shippingAddress}\n\nTe contactaremos a tu WhatsApp con el enlace de despacho.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#222020] text-slate-100 overflow-hidden font-sans">
      <div className="flex-1 w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-0">
        <ProductChatColumn
          storeName={storeName} agentName={agentName} agentAvatar={agentAvatar}
          productTitle={selectedProduct.title} messages={messages} inputValue={inputValue}
          isLoading={isLoading} onInputChange={setInputValue} onSendMessage={() => handleSendMessage()} onExit={onExit}
        />
        <ProductShowcase
          product={selectedProduct}
          onOpenBenefits={() => { setDetailModal('benefits'); trackEvent('benefit_view'); }}
          onOpenSpecs={() => { setDetailModal('specs'); trackEvent('detail_view'); }}
          onOpenFullscreen={() => { setFullscreenOpen(true); trackEvent('fullscreen_view'); }}
          onBuyNow={() => { setCheckoutOpen(true); trackEvent('buy_click'); }}
        />
      </div>
      {detailModal && (
        <ProductDetailModal
          product={selectedProduct} mode={detailModal} onClose={() => setDetailModal(null)}
          onProceedBuy={() => { setDetailModal(null); setCheckoutOpen(true); trackEvent('buy_click'); }}
        />
      )}
      {fullscreenOpen && (
        <ProductFullscreenModal
          product={selectedProduct} storeName={storeName} onClose={() => setFullscreenOpen(false)}
          onAskAboutProduct={(p) => { setFullscreenOpen(false); trackEvent('lead', 'warm'); handleSendMessage(`¿Beneficios de ${p.title}?`); }}
          onDirectCheckout={() => { setFullscreenOpen(false); setCheckoutOpen(true); trackEvent('buy_click'); }}
        />
      )}
      {checkoutOpen && (
        <ProductCheckoutModal
          product={selectedProduct} storeName={storeName} onClose={() => setCheckoutOpen(false)}
          onConfirmCheckout={handleConfirmCheckout}
        />
      )}
    </div>
  );
};

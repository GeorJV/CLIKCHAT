import React, { useState, useEffect } from 'react';
import { ProductItem, ProductChatMessage, ProductCheckoutData } from '../../../types/productChat';
import { ProductChatColumn } from './ProductChatColumn';
import { ProductShowcase } from './ProductShowcase';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFullscreenModal } from './ProductFullscreenModal';
import { ProductCheckoutModal } from './ProductCheckoutModal';
import { DEFAULT_PRODUCT } from './productChatMock';

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
  products = [DEFAULT_PRODUCT],
  initialProduct,
  onExit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProduct || products[0] || DEFAULT_PRODUCT);
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'benefits' | 'specs' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
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
  }, [selectedProduct.id]);

  const handleSendMessage = (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ProductChatMessage = {
      id: `user-${Date.now()}`,
      sessionId: 'sess',
      tenantId: 'tenant',
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const replyMsg: ProductChatMessage = {
        id: `asst-${Date.now()}`,
        sessionId: 'sess',
        tenantId: 'tenant',
        sender: 'assistant',
        content: `¡Excelente consulta! **${selectedProduct.title}** cuenta con despacho express en 24/48h, garantía de 30 días y stock activo (${selectedProduct.stock} uds). Pulsa **"Comprar Ahora"** para completar tu pedido contra entrega.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragTrace: { levelUsed: 2, confidence: 0.96, executionTimeMs: 16, modelUsed: 'FAQ RAG Hybrid L2', reasoning: 'Respuesta validada.' },
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsLoading(false);
    }, 700);
  };

  const handleConfirmCheckout = (data: ProductCheckoutData) => {
    const confirmMsg: ProductChatMessage = {
      id: `order-${Date.now()}`,
      sessionId: 'sess',
      tenantId: 'tenant',
      sender: 'assistant',
      content: `🛍️ **¡Pedido Registrado con Éxito!**\n\n- **Producto:** ${data.product.title} (x${data.quantity})\n- **Total:** $${data.totalAmount.toFixed(2)} ${data.product.currency}\n- **Destinatario:** ${data.customerName} (${data.customerPhone})\n- **Dirección:** ${data.shippingAddress}\n- **Pago:** ${data.paymentMethod === 'cash_on_delivery' ? 'Contra Entrega' : data.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}\n\nTe contactaremos a tu WhatsApp con el enlace de despacho.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1a1919] text-slate-100 overflow-hidden font-sans">
      <div className="flex-1 w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-0">
        <ProductChatColumn
          storeName={storeName}
          agentName={agentName}
          agentAvatar={agentAvatar}
          productTitle={selectedProduct.title}
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSendMessage={() => handleSendMessage()}
          onExit={onExit}
        />
        <ProductShowcase
          product={selectedProduct}
          onOpenBenefits={() => setDetailModal('benefits')}
          onOpenSpecs={() => setDetailModal('specs')}
          onOpenFullscreen={() => setFullscreenOpen(true)}
          onBuyNow={() => setCheckoutOpen(true)}
        />
      </div>

      {detailModal && (
        <ProductDetailModal
          product={selectedProduct}
          mode={detailModal}
          onClose={() => setDetailModal(null)}
          onProceedBuy={() => { setDetailModal(null); setCheckoutOpen(true); }}
        />
      )}
      {fullscreenOpen && (
        <ProductFullscreenModal
          product={selectedProduct}
          storeName={storeName}
          onClose={() => setFullscreenOpen(false)}
          onAskAboutProduct={(p) => { setFullscreenOpen(false); handleSendMessage(`¿Beneficios de ${p.title}?`); }}
          onDirectCheckout={() => { setFullscreenOpen(false); setCheckoutOpen(true); }}
        />
      )}
      {checkoutOpen && (
        <ProductCheckoutModal
          product={selectedProduct}
          storeName={storeName}
          onClose={() => setCheckoutOpen(false)}
          onConfirmCheckout={handleConfirmCheckout}
        />
      )}
    </div>
  );
};

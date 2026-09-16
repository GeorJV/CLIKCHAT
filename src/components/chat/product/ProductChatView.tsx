import React, { useState, useEffect } from 'react';
import { ProductItem, ProductChatMessage, ProductCheckoutData } from '../../../types/productChat';
import { ProductChatColumn } from './ProductChatColumn';
import { ProductShowcase } from './ProductShowcase';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFullscreenModal } from './ProductFullscreenModal';
import { ProductCheckoutModal } from './ProductCheckoutModal';
import { ProductChatTheme, PRODUCT_THEMES } from './productThemes';
import { DEFAULT_PRODUCT } from './productChatMock';
import { useMessageBatcher } from '../../../hooks/useMessageBatcher';

interface Props {
  storeName?: string; agentName?: string; agentAvatar?: string;
  products?: ProductItem[]; initialProduct?: ProductItem; onExit?: () => void;
}

export const ProductChatView: React.FC<Props> = ({
  storeName = 'Clikchat Store', agentName = 'Sofía', agentAvatar,
  products = [DEFAULT_PRODUCT], initialProduct, onExit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProduct || products[0] || DEFAULT_PRODUCT);
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'benefits' | 'specs' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState<ProductChatTheme>('linear_dark');
  const themeStyles = PRODUCT_THEMES[theme];

  useEffect(() => {
    if (initialProduct) setSelectedProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (!selectedProduct.title) return;
    const welcomeMsg: ProductChatMessage = {
      id: `msg-${Date.now()}`, sessionId: `sess-${Date.now()}`, tenantId: 'tenant-demo', sender: 'assistant',
      content: `¡Hola! 👋 Soy **${agentName}**, asesora de **${storeName}**.\n\nVeo que estás mirando **${selectedProduct.title}** ($${selectedProduct.price.toFixed(2)} ${selectedProduct.currency}).\n\n¿Tienes alguna duda sobre los beneficios o deseas apartar tu pedido?`,
      timestamp: '20:03',
      ragTrace: { levelUsed: 2, confidence: 0.99, executionTimeMs: 14, modelUsed: 'Catálogo D1', reasoning: 'Bienvenida contextualizada.' },
    };
    setMessages([welcomeMsg]);
  }, [selectedProduct.id, selectedProduct.title]);

  const trackEvent = (event: string, temperature?: string) => {
    if (!selectedProduct.id) return;
    fetch(`/api/products/${selectedProduct.id}/track`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, temperature })
    }).catch(() => {});
  };

  const { sendMessage: sendBatchedMessage, sendVoiceQuery } = useMessageBatcher({
    debounceMs: 9000,
    deliveryDelayMs: 350,
    onDeliverUserMessage: (userMsg) => setMessages((prev) => [...prev, userMsg]),
    onSetLoading: setIsLoading,
    onTriggerBotReply: (batch) => {
      const isMulti = batch.length > 1;
      const combined = batch.join(' ').toLowerCase();
      const ragK = (selectedProduct as any).embedding_text || selectedProduct.specifications?.rag_knowledge || '';
      const reasoning = ragK ? 'RAG Producto Especializado D1.' : (isMulti ? `RAG L2: Ráfaga (${batch.length} preguntas).` : 'Respuesta catálogo D1.');
      let replyContent = ragK && !combined.includes('precio') && !combined.includes('envio')
        ? `Sobre **${selectedProduct.title}**: ${ragK.slice(0, 180)}...\n\nPulsa **"Comprar Ahora"** para completar tu pedido.`
        : `¡Excelente consulta! **${selectedProduct.title}** cuenta con despacho express en 24/48h, garantía de 30 días y stock activo. Pulsa **"Comprar Ahora"** para completar tu pedido.`;
      if (combined.includes('envio') || combined.includes('envío') || combined.includes('despacho')) {
        replyContent = `¡Con gusto! Para **${selectedProduct.title}** contamos con despacho express en 24/48h a nivel nacional con seguimiento en tiempo real.`;
      } else if (combined.includes('precio') || combined.includes('cuanto') || combined.includes('costo')) {
        replyContent = `El precio actual de **${selectedProduct.title}** es de **$${selectedProduct.price.toFixed(2)} ${selectedProduct.currency}** con garantía oficial de 30 días.`;
      }
      setMessages((prev) => [...prev, {
        id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
        content: replyContent, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragTrace: { levelUsed: 2, confidence: 0.99, executionTimeMs: 16, modelUsed: 'Catálogo D1', reasoning },
      }]);
    },
  });

  const handleAudioRecorded = (audioData: { audioUrl: string; duration: number }) => {
    trackEvent('chat_message');
    setMessages((prev) => [...prev, {
      id: `audio-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'user', content: '',
      isAudio: true, audioDuration: audioData.duration, audioUrl: audioData.audioUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const handleSendMessage = (customText?: string, fromVoice?: boolean) => {
    const text = (customText || inputValue).trim();
    if (!text) return;
    setInputValue('');
    if (!fromVoice) { trackEvent('chat_message'); sendBatchedMessage(text); }
    else { sendVoiceQuery(text); }
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
    <div className={`w-full h-full flex flex-col ${themeStyles.containerBg} ${themeStyles.textPrimary} overflow-hidden font-sans transition-colors duration-300`}>
      <div className="flex-1 w-full h-full grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-0">
        <ProductChatColumn
          storeName={storeName} agentName={agentName} agentAvatar={agentAvatar}
          productTitle={selectedProduct.title} messages={messages} inputValue={inputValue}
          isLoading={isLoading} theme={theme} themeStyles={themeStyles} onThemeChange={setTheme}
          onInputChange={setInputValue} onSendMessage={handleSendMessage} onAudioRecorded={handleAudioRecorded} onExit={onExit}
        />
        <ProductShowcase
          product={selectedProduct} themeStyles={themeStyles}
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

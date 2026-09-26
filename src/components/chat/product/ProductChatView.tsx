import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../../../types/productChat';
import { ProductChatColumn } from './ProductChatColumn';
import { ProductShowcase } from './ProductShowcase';
import { ProductModalsContainer } from './ProductModalsContainer';
import { ProductChatTheme, PRODUCT_THEMES } from './productThemes';
import { DEFAULT_PRODUCT } from './productChatMock';
import { useMessageBatcher } from '../../../hooks/useMessageBatcher';
import { extractPriceFromText, parsePriceNumber, isAddOrderAction } from '../../../utils/orderPriceExtractor';
import { useProductChatSession } from './useProductChatSession';

interface Props {
  storeName?: string; agentName?: string; agentAvatar?: string;
  welcomeMessage?: string; businessType?: string;
  products?: ProductItem[]; initialProduct?: ProductItem; responseDelaySec?: number; onExit?: () => void;
}

export const ProductChatView: React.FC<Props> = ({
  storeName = 'Tienda Oficial', agentName = 'Asesora Virtual', agentAvatar,
  welcomeMessage, businessType = 'tienda',
  products = [], initialProduct, responseDelaySec, onExit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProduct || products[0] || { ...DEFAULT_PRODUCT, title: 'Catálogo Oficial', image: '', images: [] });
  const isRestaurant = businessType === 'restaurante';
  const [orderTotal, setOrderTotal] = useState<number | null>(() => (isRestaurant ? 0 : (selectedProduct?.price || null)));
  const [isTotalPulsing, setIsTotalPulsing] = useState(false);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (isRestaurant && orderTotal === null) setOrderTotal(0); }, [isRestaurant]);
  useEffect(() => () => { if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current); }, []);
  useEffect(() => { if (initialProduct) setSelectedProduct(initialProduct); }, [initialProduct]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'benefits' | 'specs' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState<ProductChatTheme>('linear_dark');
  const themeStyles = PRODUCT_THEMES[theme];

  const { messages, setMessages, sessId, handleResetChat, trackEvent, handleConfirmCheckout } = useProductChatSession({
    selectedProduct, storeName, agentName, welcomeMessage, isRestaurant,
    onResetOrderTotal: () => setOrderTotal(isRestaurant ? 0 : (selectedProduct?.price || null)),
    onRestoreOrderTotal: (total) => setOrderTotal(total)
  });

  const { sendMessage: sendBatchedMessage, sendVoiceQuery } = useMessageBatcher({
    debounceMs: Math.max((responseDelaySec ?? 1) * 1000, 400), deliveryDelayMs: 0, onSetLoading: setIsLoading,
    onDeliverUserMessage: (userMsg) => setMessages((prev) => [...prev, userMsg]),
    onTriggerBotReply: async (batch) => {
      const userText = batch.join('\n').trim();
      if (!userText) return;
      setIsLoading(true);
      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantSlug: 'geosoft', tenantId: (selectedProduct as any).tenant_id || (selectedProduct as any).tenantId,
            sessionId: sessId, message: userText, clientHour: new Date().getHours(),
            clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
          })
        });
        const data = res.ok ? await res.json() : null;
        if (data?.isRestaurant || isRestaurant) {
          if (typeof data?.orderTotal === 'number') {
            setOrderTotal(data.orderTotal);
            if (data.orderTotal > 0) {
              if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
              setIsTotalPulsing(true);
              pulseTimerRef.current = setTimeout(() => setIsTotalPulsing(false), 10000);
            }
          }
          const askedTotal = data?.isAskingTotal || /\b(cuanto\s*es(\s*la\s*cuenta|\s*para\s*pagar|\s*en\s*total|\s*todo)?|la\s*cuenta|total\s*a\s*pagar|total\s*del\s*pedido)\b/i.test(userText);
          if (askedTotal) {
            if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
            setIsTotalPulsing(true);
            pulseTimerRef.current = setTimeout(() => setIsTotalPulsing(false), 10000);
          }
        }
        const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
        setMessages((prev) => [...prev, {
          id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
          content: data?.answer || `Sobre **${selectedProduct.title}**: $${selectedProduct.price.toFixed(2)} ${selectedProduct.currency}. ¿Deseas adquirirlo?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: data?.quickActions,
          ragTrace: {
            levelUsed: (lvlMap[data?.level] || 3) as any, confidence: data?.confidence || 0.95, executionTimeMs: 85,
            modelUsed: data?.provider || 'RAG Cloudflare Edge', reasoning: data?.levelLabel || 'RAG Catálogo D1'
          }
        }]);
      } catch {
        setMessages((prev) => [...prev, { id: `err-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: 'Hubo una breve intermitencia de conexión. ¿Podrías reiterar tu consulta?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } finally { setIsLoading(false); }
    },
  });

  const handleAudioRecorded = (audioData: { audioUrl: string; duration: number }) => {
    trackEvent('chat_message');
    setMessages((prev) => [...prev, { id: `audio-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'user', content: '', isAudio: true, audioDuration: audioData.duration, audioUrl: audioData.audioUrl, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const handleSendMessage = (customText?: string, fromVoice?: boolean) => {
    const text = (customText || inputValue).trim();
    if (!text) return;
    setInputValue('');
    if (isRestaurant && isAddOrderAction(text)) {
      let addedPrice = extractPriceFromText(text, selectedProduct?.currency);
      if ((addedPrice === null || addedPrice <= 0) && products.length > 0) {
        const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const matched = products.find(p => {
          const pName = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return norm.includes(pName) || pName.includes(norm.replace(/agregar|quiero|sumar|anotar/g, '').trim());
        });
        if (matched && matched.price > 0) {
          addedPrice = parsePriceNumber(matched.price, (matched.currency || selectedProduct?.currency) === 'CRC');
        }
      }
      if (addedPrice !== null && addedPrice > 0) {
        setOrderTotal((prev) => (prev ?? 0) + addedPrice);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        setIsTotalPulsing(true);
        pulseTimerRef.current = setTimeout(() => setIsTotalPulsing(false), 10000);
      }
    }
    if (!fromVoice) { trackEvent('chat_message'); sendBatchedMessage(text); } else { sendVoiceQuery(text); }
  };

  return (
    <div className={`w-full h-full flex flex-col ${themeStyles.containerBg} ${themeStyles.textPrimary} overflow-hidden font-sans transition-colors duration-300`}>
      <div className="flex-1 w-full h-full grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-0">
        <ProductChatColumn
          storeName={storeName} agentName={agentName} agentAvatar={agentAvatar} productTitle={selectedProduct.title}
          messages={messages} inputValue={inputValue} isLoading={isLoading} theme={theme} themeStyles={themeStyles}
          onThemeChange={setTheme} onInputChange={setInputValue} onSendMessage={handleSendMessage} onAudioRecorded={handleAudioRecorded} onExit={onExit} onResetChat={handleResetChat}
        />
        <ProductShowcase
          product={selectedProduct} themeStyles={themeStyles} orderTotal={orderTotal} isTotalPulsing={isTotalPulsing} isRestaurant={isRestaurant}
          onOpenBenefits={() => { setDetailModal('benefits'); trackEvent('benefit_view'); }} onOpenSpecs={() => { setDetailModal('specs'); trackEvent('detail_view'); }}
          onOpenFullscreen={() => { setFullscreenOpen(true); trackEvent('fullscreen_view'); }} onBuyNow={() => { setCheckoutOpen(true); trackEvent('buy_click'); }}
        />
      </div>
      <ProductModalsContainer
        product={selectedProduct} storeName={storeName} detailModal={detailModal} fullscreenOpen={fullscreenOpen} checkoutOpen={checkoutOpen}
        onCloseDetail={() => setDetailModal(null)} onProceedBuyDetail={() => { setDetailModal(null); setCheckoutOpen(true); trackEvent('buy_click'); }}
        onCloseFullscreen={() => setFullscreenOpen(false)} onAskAboutProduct={(p) => { setFullscreenOpen(false); trackEvent('lead', 'warm'); handleSendMessage(`¿Beneficios de ${p.title}?`); }}
        onDirectCheckout={() => { setFullscreenOpen(false); setCheckoutOpen(true); trackEvent('buy_click'); }}
        onCloseCheckout={() => setCheckoutOpen(false)} onConfirmCheckout={handleConfirmCheckout}
      />
    </div>
  );
};

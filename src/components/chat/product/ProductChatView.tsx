import React, { useState, useEffect } from 'react';
import { MessageSquare, ShoppingBag, CreditCard } from 'lucide-react';
import { ProductItem } from '../../../types/productChat';
import { ProductChatColumn } from './ProductChatColumn';
import { ProductShowcase } from './ProductShowcase';
import { ProductModalsContainer } from './ProductModalsContainer';
import { ProductChatTheme, PRODUCT_THEMES } from './productThemes';
import { DEFAULT_PRODUCT } from './productChatMock';
import { useMessageBatcher } from '../../../hooks/useMessageBatcher';
import { extractPriceFromText, isAddOrderAction } from '../../../utils/orderPriceExtractor';
import { useProductChatSession } from './useProductChatSession';
import { useProductChatOrder } from './useProductChatOrder';
import { generateClientChatFallback } from '../../../services/clientChatFallback';
import { useLivePresencePing } from '../../../hooks/useLivePresencePing';

import { DeliveryMode } from '../../../utils/messageSplitter';

interface Props {
  storeName?: string; agentName?: string; agentAvatar?: string; welcomeMessage?: string;
  businessType?: string; tenantSlug?: string; products?: ProductItem[]; initialProduct?: ProductItem; responseDelaySec?: number; deliveryMode?: DeliveryMode; onExit?: () => void;
}

export const ProductChatView: React.FC<Props> = ({
  storeName = 'Tienda Oficial', agentName = 'Asesora Virtual', agentAvatar, welcomeMessage, businessType = 'tienda', tenantSlug = 'comida-callejera-xl', products = [], initialProduct, responseDelaySec, deliveryMode, onExit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(initialProduct || products[0] || { ...DEFAULT_PRODUCT, title: 'Catálogo Oficial', image: '', images: [] });
  const [mobileTab, setMobileTab] = useState<'chat' | 'product'>('chat');
  const isRestaurant = businessType === 'restaurante';
  const {
    orderTotal, orderItems, isTotalPulsing, orderItemsCount,
    setOrderTotal, registerAddedItem, updateItemQuantity, removeOrderItem, syncFromBotReply, resetOrder, triggerPulse
  } = useProductChatOrder({ tenantSlug, isRestaurant, defaultPrice: selectedProduct?.price || null });

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
    onResetOrderTotal: resetOrder, onRestoreOrderTotal: (total) => setOrderTotal(total)
  });

  useLivePresencePing({
    tenantSlug, sessionId: sessId, activeProduct: selectedProduct?.title,
    hasCart: Boolean(orderTotal && orderTotal > 0), cartTotal: orderTotal || 0,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      if (sessId) fetch('/api/chat/typing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sessId, draftText: inputValue }) }).catch(() => {});
    }, 350);
    return () => clearTimeout(t);
  }, [inputValue, sessId]);

  const { sendMessage: sendBatchedMessage, sendVoiceQuery } = useMessageBatcher({
    debounceMs: Math.max((responseDelaySec ?? 1) * 1000, 400), deliveryDelayMs: 0, onSetLoading: setIsLoading,
    onDeliverUserMessage: (userMsg) => setMessages((prev) => [...prev, userMsg]),
    onTriggerBotReply: async (batch) => {
      const userText = batch.join('\n').trim();
      if (!userText) return;
      setIsLoading(true);
      const startTime = Date.now();
      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantSlug: tenantSlug || (selectedProduct as any).slug || 'comida-callejera-xl',
            tenantId: (selectedProduct as any).tenant_id || (selectedProduct as any).tenantId,
            sessionId: sessId, message: userText, clientHour: new Date().getHours(),
            clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            source: typeof window !== 'undefined' ? (localStorage.getItem('clikchat_traffic_source') || undefined) : undefined
          })
        });
        if (!res.ok) throw new Error('Error en el servidor de chat');
        const data = await res.json();
        const targetDelayMs = Math.max((responseDelaySec ?? 1) * 1000, 300);
        const elapsed = Date.now() - startTime;
        if (elapsed < targetDelayMs) await new Promise((r) => setTimeout(r, targetDelayMs - elapsed));
        if (data?.isRestaurant || isRestaurant) {
          syncFromBotReply(data?.orderItems, data?.orderTotal, data?.answer);
          const askedTotal = data?.isAskingTotal || /\b(cuanto\s*es(\s*la\s*cuenta|\s*para\s*pagar|\s*en\s*total|\s*todo)?|la\s*cuenta|total\s*a\s*pagar|total\s*del\s*pedido)\b/i.test(userText);
          if (askedTotal) triggerPulse();
        }
        const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
        const rawAns = data?.answer || '';
        const safeAns = (!rawAns || /user safety|response safety/i.test(rawAns) || /^(the user|i need to)/i.test(rawAns)) ? '¡Hola! Con gusto te atiendo. ¿En qué te puedo colaborar?' : rawAns;
        setMessages((prev) => [...prev, {
          id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: safeAns,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), quickActions: data?.quickActions,
          ragTrace: { levelUsed: (lvlMap[data?.level] || 3) as any, confidence: data?.confidence || 0.95, executionTimeMs: 85, modelUsed: data?.provider || 'RAG Cloudflare Edge', reasoning: data?.levelLabel || 'RAG Catálogo D1' }
        }]);
      } catch {
        try {
          const fb = await generateClientChatFallback({ tenantSlug: tenantSlug || (selectedProduct as any).slug || 'comida-callejera-xl', storeName, agentName, businessType, welcomeMessage, userMessage: userText, selectedProduct, products, sessionId: sessId });
          const targetDelayMs = Math.max((responseDelaySec ?? 1) * 1000, 300);
          const elapsed = Date.now() - startTime;
          if (elapsed < targetDelayMs) await new Promise((r) => setTimeout(r, targetDelayMs - elapsed));
          const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
          setMessages((prev) => [...prev, {
            id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: fb.answer, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ragTrace: { levelUsed: (lvlMap[fb.level] || 3) as any, confidence: fb.confidence, executionTimeMs: 120, modelUsed: fb.provider, reasoning: fb.levelLabel }
          }]);
        } catch {
          setMessages((prev) => [...prev, { id: `err-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: '¡Hola! ¿En qué te puedo asesorar el día de hoy?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
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
      const addedPrice = extractPriceFromText(text, selectedProduct?.currency);
      const cleanName = text.replace(/^(?:si\s+)?(?:agregar|agregame|sumar|anotar|dame|ponme|quiero)\s+/i, '').replace(/\([^)]*\)/g, '').trim();
      const resolvedTitle = cleanName.length >= 2 ? cleanName : (selectedProduct?.title || 'Producto');
      if (addedPrice !== null && addedPrice > 0) registerAddedItem(resolvedTitle, addedPrice);
    }
    if (!fromVoice) { trackEvent('chat_message'); sendBatchedMessage(text); } else { sendVoiceQuery(text); }
  };

  return (
    <div className={`w-full h-full flex flex-col ${themeStyles.containerBg} ${themeStyles.textPrimary} overflow-hidden font-sans transition-colors duration-300`}>
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#171616] border-b border-[#282626] shrink-0 z-20">
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#111010] border border-[#282626]">
          <button type="button" onClick={() => setMobileTab('chat')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 min-h-[32px] ${mobileTab === 'chat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}>
            <MessageSquare className="w-4 h-4" /><span>Chat</span>
          </button>
          <button type="button" onClick={() => setMobileTab('product')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 min-h-[32px] ${mobileTab === 'product' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}>
            <ShoppingBag className="w-4 h-4" /><span>{isRestaurant ? 'Platillo' : 'Producto'}</span>
          </button>
        </div>
        <button type="button" onClick={() => { setCheckoutOpen(true); trackEvent('buy_click'); }} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer min-h-[32px]">
          <CreditCard className="w-4 h-4" /><span>{isRestaurant ? 'Ordenar' : 'Comprar'}</span>
        </button>
      </div>
      <div className="flex-1 w-full h-full flex md:grid md:grid-cols-2 overflow-hidden min-h-0">
        <div className={`h-full w-full ${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex min-h-0 overflow-hidden`}>
          <ProductChatColumn
            storeName={storeName} agentName={agentName} agentAvatar={agentAvatar} productTitle={selectedProduct.title}
            messages={messages} inputValue={inputValue} isLoading={isLoading} theme={theme} themeStyles={themeStyles}
            deliveryMode={deliveryMode}
            onThemeChange={setTheme} onInputChange={setInputValue} onSendMessage={handleSendMessage} onAudioRecorded={handleAudioRecorded} onExit={onExit} onResetChat={handleResetChat}
          />
        </div>
        <div className={`h-full w-full ${mobileTab === 'product' ? 'flex' : 'hidden'} md:flex min-h-0 overflow-hidden`}>
          <ProductShowcase
            product={selectedProduct} themeStyles={themeStyles} orderTotal={orderTotal} isTotalPulsing={isTotalPulsing} isRestaurant={isRestaurant} orderItemsCount={orderItemsCount}
            onOpenBenefits={() => { setDetailModal('benefits'); trackEvent('benefit_view'); }} onOpenSpecs={() => { setDetailModal('specs'); trackEvent('detail_view'); }}
            onOpenFullscreen={() => { setFullscreenOpen(true); trackEvent('fullscreen_view'); }} onBuyNow={() => { setCheckoutOpen(true); trackEvent('buy_click'); }} />
        </div>
      </div>
      <ProductModalsContainer
        product={selectedProduct} storeName={storeName} detailModal={detailModal} fullscreenOpen={fullscreenOpen} checkoutOpen={checkoutOpen}
        orderItems={orderItems} orderTotal={orderTotal} isRestaurant={isRestaurant}
        onUpdateQuantity={updateItemQuantity} onRemoveItem={removeOrderItem}
        onCloseDetail={() => setDetailModal(null)} onProceedBuyDetail={() => { setDetailModal(null); setCheckoutOpen(true); trackEvent('buy_click'); }}
        onCloseFullscreen={() => setFullscreenOpen(false)} onAskAboutProduct={(p) => { setFullscreenOpen(false); trackEvent('lead', 'warm'); handleSendMessage(`¿Beneficios de ${p.title}?`); }}
        onDirectCheckout={() => { setFullscreenOpen(false); setCheckoutOpen(true); trackEvent('buy_click'); }} onCloseCheckout={() => setCheckoutOpen(false)} onConfirmCheckout={handleConfirmCheckout} onAskQuestion={handleSendMessage}
      />
    </div>
  );
};

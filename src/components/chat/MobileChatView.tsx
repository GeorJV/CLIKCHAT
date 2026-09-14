import React, { useState } from 'react';
import { Product } from '../../types';
import { useTenantData } from '../../hooks/useTenantData';
import { useChatRAG } from '../../hooks/useChatRAG';
import { ChatHeader } from './ChatHeader';
import { ProductCarousel } from './ProductCarousel';
import { DesktopProductShowcase } from './DesktopProductShowcase';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatQuickPills } from './ChatQuickPills';
import { ChatInputBar } from './ChatInputBar';
import { PersistentCTA } from './PersistentCTA';
import { FullscreenViewer } from './FullscreenViewer';
import { LeadCaptureModal } from './LeadCaptureModal';

interface MobileChatViewProps {
  tenantSlug?: string;
  onNavigateToPanel?: () => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  tenantSlug = 'demo-store',
  onNavigateToPanel
}) => {
  const [isCarouselCollapsed, setIsCarouselCollapsed] = useState(false);
  const [fullscreenProduct, setFullscreenProduct] = useState<Product | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  // 1. Capa de Datos: Hook del Inquilino y Catálogo D1
  const { tenant, products, selectedProduct, setSelectedProduct } = useTenantData(tenantSlug);

  // 2. Capa de Lógica: Hook del Motor Conversacional y RAG
  const { messages, isLoading, sessionId, sendMessage, resetChat } = useChatRAG({
    tenant,
    tenantSlug,
    onSelectProduct: (p) => setSelectedProduct(p),
    onTriggerFallback: () => setShowLeadModal(true)
  });

  return (
    <div className="flex-1 h-full max-w-7xl mx-auto w-full p-0 sm:p-3 md:p-4 lg:grid lg:grid-cols-12 lg:gap-5 overflow-hidden">
      {/* Columna Izquierda: Ventana de Chat */}
      <div className="h-full flex flex-col bg-slate-950 sm:rounded-2xl border-0 sm:border border-slate-800 shadow-2xl overflow-hidden relative lg:col-span-7 xl:col-span-8">
        <ChatHeader
          tenant={tenant}
          onResetChat={resetChat}
          onNavigateToPanel={onNavigateToPanel}
        />

        {/* Carrusel móvil con colapso ante el teclado */}
        <div className="lg:hidden">
          <ProductCarousel
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenFullscreen={(p) => setFullscreenProduct(p)}
            isCollapsed={isCarouselCollapsed}
            onToggleCollapse={() => setIsCarouselCollapsed((prev) => !prev)}
          />
        </div>

        <ChatMessagesList
          messages={messages}
          isLoading={isLoading}
          onSelectProduct={(p) => { setSelectedProduct(p); setFullscreenProduct(p); }}
          onOpenLeadModal={() => setShowLeadModal(true)}
        />

        <ChatQuickPills
          onSelectPrompt={(text) => sendMessage(text)}
          disabled={isLoading}
        />

        {/* Sticky CTA móvil sobre el input */}
        <div className="lg:hidden">
          <PersistentCTA tenant={tenant} activeProduct={selectedProduct} />
        </div>

        <ChatInputBar
          onSendMessage={(text) => sendMessage(text)}
          onInputFocus={() => setIsCarouselCollapsed(true)}
          isLoading={isLoading}
        />
      </div>

      {/* Columna Derecha: Escaparate Fijo (Escritorio PC) */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-4 h-full">
        <DesktopProductShowcase
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenFullscreen={(p) => setFullscreenProduct(p)}
        />
      </div>

      {fullscreenProduct && (
        <FullscreenViewer
          product={fullscreenProduct}
          onClose={() => setFullscreenProduct(null)}
        />
      )}

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        sessionId={sessionId}
        tenantId={tenant?.id || 'default'}
      />
    </div>
  );
};

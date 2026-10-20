import React from 'react';
import { ProductItem, ProductCheckoutData, OrderItem } from '../../../types/productChat';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFullscreenModal } from './ProductFullscreenModal';
import { ProductCheckoutModal } from './ProductCheckoutModal';
import { ExitIntentToast } from '../ExitIntentToast';
import { useExitIntent } from '../../../hooks/useExitIntent';

interface Props {
  product: ProductItem;
  storeName: string;
  detailModal: 'benefits' | 'specs' | null;
  fullscreenOpen: boolean;
  checkoutOpen: boolean;
  orderItems?: OrderItem[];
  orderTotal?: number | null;
  isRestaurant?: boolean;
  onUpdateQuantity?: (index: number, newQty: number) => void;
  onRemoveItem?: (index: number) => void;
  onCloseDetail: () => void;
  onProceedBuyDetail: () => void;
  onCloseFullscreen: () => void;
  onAskAboutProduct: (p: ProductItem) => void;
  onDirectCheckout: () => void;
  onCloseCheckout: () => void;
  onConfirmCheckout: (data: ProductCheckoutData) => void;
  onAskQuestion?: (query: string) => void;
}

export const ProductModalsContainer: React.FC<Props> = ({
  product, storeName, detailModal, fullscreenOpen, checkoutOpen,
  orderItems = [], orderTotal = null, isRestaurant = false,
  onUpdateQuantity, onRemoveItem,
  onCloseDetail, onProceedBuyDetail, onCloseFullscreen,
  onAskAboutProduct, onDirectCheckout, onCloseCheckout, onConfirmCheckout,
  onAskQuestion
}) => {
  const { showExitIntent, dismissExitIntent } = useExitIntent();

  return (
    <>
      {detailModal && (
        <ProductDetailModal
          product={product}
          mode={detailModal}
          storeName={storeName}
          orderItems={orderItems}
          orderTotal={orderTotal}
          isRestaurant={isRestaurant}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClose={onCloseDetail}
          onProceedBuy={onProceedBuyDetail}
        />
      )}
      {fullscreenOpen && (
        <ProductFullscreenModal
          product={product}
          storeName={storeName}
          onClose={onCloseFullscreen}
          onAskAboutProduct={onAskAboutProduct}
          onDirectCheckout={onDirectCheckout}
        />
      )}
      {checkoutOpen && (
        <ProductCheckoutModal
          product={product}
          storeName={storeName}
          onClose={onCloseCheckout}
          onConfirmCheckout={onConfirmCheckout}
        />
      )}
      <ExitIntentToast
        isOpen={showExitIntent && !checkoutOpen && !fullscreenOpen && !detailModal}
        storeName={storeName}
        hasItemsInCart={Boolean(orderTotal && orderTotal > 0)}
        onProceedCheckout={onDirectCheckout}
        onAskQuestion={(q) => {
          if (onAskQuestion) onAskQuestion(q);
          else onAskAboutProduct({ ...product, title: q });
        }}
        onDismiss={dismissExitIntent}
      />
    </>
  );
};

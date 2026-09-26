import React from 'react';
import { ProductItem, ProductCheckoutData } from '../../../types/productChat';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductFullscreenModal } from './ProductFullscreenModal';
import { ProductCheckoutModal } from './ProductCheckoutModal';

interface Props {
  product: ProductItem;
  storeName: string;
  detailModal: 'benefits' | 'specs' | null;
  fullscreenOpen: boolean;
  checkoutOpen: boolean;
  onCloseDetail: () => void;
  onProceedBuyDetail: () => void;
  onCloseFullscreen: () => void;
  onAskAboutProduct: (p: ProductItem) => void;
  onDirectCheckout: () => void;
  onCloseCheckout: () => void;
  onConfirmCheckout: (data: ProductCheckoutData) => void;
}

export const ProductModalsContainer: React.FC<Props> = ({
  product, storeName, detailModal, fullscreenOpen, checkoutOpen,
  onCloseDetail, onProceedBuyDetail, onCloseFullscreen,
  onAskAboutProduct, onDirectCheckout, onCloseCheckout, onConfirmCheckout
}) => {
  return (
    <>
      {detailModal && (
        <ProductDetailModal
          product={product}
          mode={detailModal}
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
    </>
  );
};

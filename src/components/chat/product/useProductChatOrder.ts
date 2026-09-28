import { useState, useEffect, useRef } from 'react';
import { OrderItem } from '../../../types/productChat';
import { parsePriceNumber } from '../../../utils/orderPriceExtractor';

interface UseProductChatOrderProps {
  tenantSlug?: string;
  isRestaurant: boolean;
  defaultPrice?: number | null;
}

export function useProductChatOrder({
  tenantSlug = 'default',
  isRestaurant,
  defaultPrice = null,
}: UseProductChatOrderProps) {
  const orderTotalKey = `clik_ordertotal_${tenantSlug}`;
  const orderItemsKey = `clik_orderitems_${tenantSlug}`;

  const [orderTotal, setOrderTotal] = useState<number | null>(() => {
    if (typeof window !== 'undefined' && isRestaurant) {
      const saved = localStorage.getItem(orderTotalKey);
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
    }
    return isRestaurant ? 0 : defaultPrice;
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    if (typeof window !== 'undefined' && isRestaurant) {
      try {
        const s = localStorage.getItem(orderItemsKey);
        if (s) return JSON.parse(s);
      } catch {}
    }
    return [];
  });

  const [isTotalPulsing, setIsTotalPulsing] = useState(false);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerPulse = () => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setIsTotalPulsing(true);
    pulseTimerRef.current = setTimeout(() => setIsTotalPulsing(false), 10000);
  };

  useEffect(() => {
    if (isRestaurant && orderTotal === null) setOrderTotal(0);
  }, [isRestaurant]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isRestaurant) {
      if (typeof orderTotal === 'number') localStorage.setItem(orderTotalKey, orderTotal.toString());
      localStorage.setItem(orderItemsKey, JSON.stringify(orderItems));
    }
  }, [orderTotal, orderItems, isRestaurant, orderTotalKey, orderItemsKey]);

  useEffect(() => () => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
  }, []);

  const registerAddedItem = (name: string, price: number) => {
    setOrderTotal((prev) => (prev ?? 0) + price);
    setOrderItems((prev) => {
      const norm = name.toLowerCase();
      const existIdx = prev.findIndex(it => it.name.toLowerCase().includes(norm) || norm.includes(it.name.toLowerCase()));
      if (existIdx !== -1) {
        const next = [...prev];
        next[existIdx] = { ...next[existIdx], quantity: (next[existIdx].quantity || 1) + 1 };
        return next;
      }
      return [...prev, { name, price, quantity: 1 }];
    });
    triggerPulse();
  };

  const syncFromBotReply = (serverItems?: OrderItem[], serverTotal?: number | null, botAnswer?: string) => {
    if (typeof serverTotal === 'number' && serverTotal > 0) {
      setOrderTotal(serverTotal);
      triggerPulse();
    }
    if (Array.isArray(serverItems) && serverItems.length > 0) {
      setOrderItems(serverItems);
    } else if (botAnswer) {
      const parsed: OrderItem[] = [];
      for (const l of botAnswer.split('\n')) {
        const m = l.match(/^\s*[-*•]?\s*(\d+)x\s+([^—–-]+)[—–-]\s*[₡¢$€£]?\s*([\d,.]+)/i);
        if (m) {
          parsed.push({
            quantity: parseInt(m[1], 10),
            name: m[2].trim(),
            price: parsePriceNumber(m[3], isRestaurant)
          });
        }
      }
      if (parsed.length > 0) setOrderItems(parsed);
    }
  };

  const resetOrder = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(orderTotalKey);
      localStorage.removeItem(orderItemsKey);
    }
    setOrderItems([]);
    setOrderTotal(isRestaurant ? 0 : defaultPrice);
  };

  const orderItemsCount = orderItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

  return {
    orderTotal,
    orderItems,
    isTotalPulsing,
    orderItemsCount,
    setOrderTotal,
    setOrderItems,
    triggerPulse,
    registerAddedItem,
    syncFromBotReply,
    resetOrder
  };
}

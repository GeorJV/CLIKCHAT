import { useState, useEffect, useCallback } from 'react';
import { BookingDetail, subscribeBookingSync } from '../utils/bookingSyncBus';

export const useNewBookingAlert = (tenantSlug: string = 'geosoft') => {
  const tKey = tenantSlug || 'geosoft';
  const seenKey = `clikchat_seen_bookings_${tKey}`;
  const highlightKey = `clikchat_highlighted_booking_${tKey}`;

  const getSeenIds = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(seenKey);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  };

  const [newBooking, setNewBooking] = useState<BookingDetail | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('clikchat_latest_new_booking');
      if (raw) {
        const parsed = JSON.parse(raw);
        const seen = getSeenIds();
        if (parsed?.id && !seen.has(parsed.id)) return parsed;
      }
    } catch {}
    return null;
  });

  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(highlightKey) || null;
  });

  const [unreadCount, setUnreadCount] = useState<number>(newBooking ? 1 : 0);

  const acknowledgeBooking = useCallback((id: string) => {
    if (!id || typeof window === 'undefined') return;
    try {
      const seen = getSeenIds();
      seen.add(id);
      localStorage.setItem(seenKey, JSON.stringify(Array.from(seen)));
      localStorage.removeItem(highlightKey);
      setHighlightedBookingId((prev) => (prev === id ? null : prev));
      setNewBooking((prev) => (prev?.id === id ? null : prev));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent('clikchat_booking_acknowledged', { detail: { id } }));
    } catch {}
  }, [seenKey, highlightKey]);

  const focusBooking = useCallback((booking: BookingDetail) => {
    if (!booking?.id || typeof window === 'undefined') return;
    setHighlightedBookingId(booking.id);
    localStorage.setItem(highlightKey, booking.id);
    window.dispatchEvent(new CustomEvent('clikchat_focus_booking', { detail: { bookingId: booking.id } }));
  }, [highlightKey]);

  const dismissAlert = useCallback(() => {
    if (newBooking?.id) acknowledgeBooking(newBooking.id);
    setNewBooking(null);
  }, [newBooking, acknowledgeBooking]);

  useEffect(() => {
    const unsub = subscribeBookingSync((event) => {
      if (event?.booking?.id) {
        const seen = getSeenIds();
        if (!seen.has(event.booking.id)) {
          setNewBooking(event.booking);
          setHighlightedBookingId(event.booking.id);
          localStorage.setItem(highlightKey, event.booking.id);
          setUnreadCount(1);
        }
      }
    });

    const handleAck = (e: any) => {
      const id = e?.detail?.id;
      if (id) {
        setHighlightedBookingId((prev) => (prev === id ? null : prev));
        setNewBooking((prev) => (prev?.id === id ? null : prev));
        setUnreadCount(0);
      }
    };

    window.addEventListener('clikchat_booking_acknowledged', handleAck);
    return () => {
      unsub();
      window.removeEventListener('clikchat_booking_acknowledged', handleAck);
    };
  }, [highlightKey]);

  return {
    newBooking,
    unreadCount,
    highlightedBookingId,
    acknowledgeBooking,
    focusBooking,
    dismissAlert,
  };
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { BookingDetail, subscribeBookingSync } from '../utils/bookingSyncBus';

const playBookingChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.18, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(start); osc.stop(start + dur);
    };
    playTone(587.33, now, 0.35); playTone(880, now + 0.12, 0.55);
  } catch {}
};

export const useNewBookingAlert = (tenantSlug: string = 'geosoft') => {
  const tKey = tenantSlug || 'geosoft';
  const seenKey = `clikchat_seen_bookings_${tKey}`;
  const highlightKey = `clikchat_highlighted_booking_${tKey}`;
  const isPollingRef = useRef(false);

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

  const triggerAlert = useCallback((booking: BookingDetail) => {
    if (!booking?.id) return;
    const seen = getSeenIds();
    if (seen.has(booking.id)) return;
    setNewBooking(booking);
    setUnreadCount(1);
    playBookingChime();
    try { localStorage.setItem('clikchat_latest_new_booking', JSON.stringify({ ...booking, tenant: tKey, timestamp: Date.now() })); } catch {}
  }, [tKey, seenKey]);

  const acknowledgeBooking = useCallback((id: string) => {
    if (!id || typeof window === 'undefined') return;
    try {
      const seen = getSeenIds();
      seen.add(id);
      localStorage.setItem(seenKey, JSON.stringify(Array.from(seen)));
      localStorage.removeItem(highlightKey);
      setHighlightedBookingId((prev) => (prev === id ? null : prev));
      setNewBooking((prev) => (prev?.id === id ? null : prev));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent('clikchat_booking_acknowledged', { detail: { id } }));
    } catch {}
  }, [seenKey, highlightKey]);

  const focusBooking = useCallback((booking: BookingDetail) => {
    if (!booking?.id || typeof window === 'undefined') return;
    setHighlightedBookingId(booking.id);
    localStorage.setItem(highlightKey, booking.id);
    window.dispatchEvent(new CustomEvent('clikchat_focus_booking', { detail: { bookingId: booking.id, booking } }));
  }, [highlightKey]);

  const dismissAlert = useCallback(() => {
    if (newBooking?.id) acknowledgeBooking(newBooking.id);
    setNewBooking(null);
    setUnreadCount(0);
  }, [newBooking, acknowledgeBooking]);

  const pollBookings = useCallback(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    try {
      const isGeo = tKey === 'geosoft' || tKey === 'ten_geosoft_prod';
      const q = isGeo ? 'tenant=geosoft&tenantId=ten_geosoft_prod' : `tenant=${encodeURIComponent(tKey)}&tenantId=${encodeURIComponent(tKey)}`;
      const res = await fetch(`/api/bookings?${q}&_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const list = data?.bookings;
      if (!Array.isArray(list) || list.length === 0) return;

      const seen = getSeenIds();
      const rawSeen = typeof window !== 'undefined' ? localStorage.getItem(seenKey) : null;
      if (!rawSeen) {
        const recent = list.find((b: any) => {
          const age = b.created_at ? (Date.now() - new Date(b.created_at).getTime()) : 999999;
          return age > 0 && age < 120000;
        });
        const baseIds = list.filter(b => b.id !== recent?.id).map(b => b.id);
        localStorage.setItem(seenKey, JSON.stringify(baseIds));
        if (recent) {
          triggerAlert({ id: recent.id, clientName: recent.customer_name || recent.clientName || 'Cliente', serviceName: recent.service_name || recent.serviceName || 'Servicio Profesional', date: recent.booking_date || recent.date, time: recent.booking_time || recent.time, price: Number(recent.price) || 0 });
        }
        return;
      }
      const unseen = list.find((b: any) => !seen.has(b.id));
      if (unseen) {
        triggerAlert({ id: unseen.id, clientName: unseen.customer_name || unseen.clientName || 'Cliente', serviceName: unseen.service_name || unseen.serviceName || 'Servicio Profesional', date: unseen.booking_date || unseen.date, time: unseen.booking_time || unseen.time, price: Number(unseen.price) || 0 });
      }
    } catch {} finally { isPollingRef.current = false; }
  }, [tKey, seenKey, triggerAlert]);

  useEffect(() => {
    pollBookings();
    const unsub = subscribeBookingSync((event) => {
      if (event?.booking?.id) triggerAlert(event.booking);
      pollBookings();
    });
    const handleAck = (e: any) => {
      const id = e?.detail?.id;
      if (id) {
        setHighlightedBookingId((prev) => (prev === id ? null : prev));
        setNewBooking((prev) => (prev?.id === id ? null : prev));
        setUnreadCount(0);
      }
    };
    const handleTabActive = () => { if (!document.hidden) pollBookings(); };
    window.addEventListener('focus', handleTabActive);
    document.addEventListener('visibilitychange', handleTabActive);
    window.addEventListener('clikchat_booking_acknowledged', handleAck);
    const interval = setInterval(pollBookings, 10000);
    return () => {
      unsub();
      window.removeEventListener('focus', handleTabActive);
      document.removeEventListener('visibilitychange', handleTabActive);
      window.removeEventListener('clikchat_booking_acknowledged', handleAck);
      clearInterval(interval);
    };
  }, [pollBookings, triggerAlert]);

  return { newBooking, unreadCount, highlightedBookingId, acknowledgeBooking, focusBooking, dismissAlert };
};

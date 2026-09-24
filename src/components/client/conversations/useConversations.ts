import { useState, useEffect, useCallback, useRef } from 'react';
import { ConversationSession } from './types';

export function useConversations(tenantId?: string) {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<'online' | 'closed'>('online');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasInitializedFilter = useRef(false);

  const loadConversations = useCallback(async (isInitial = false) => {
    if (!tenantId) return;
    if (isInitial) setLoading(true);

    try {
      const res = await fetch(`/api/chat/tenant-conversations/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        const rawList = data.conversations || [];
        const now = Date.now();

        const mapped: ConversationSession[] = rawList.map((c: any) => {
          const lastActiveTime = new Date(c.updated_at || c.created_at).getTime();
          const isRecent = (now - lastActiveTime) < 30 * 60 * 1000;
          const status: 'online' | 'closed' = (c.status === 'closed')
            ? 'closed'
            : (isRecent ? 'online' : 'closed');

          return {
            id: c.id,
            user_name: c.user_name || undefined,
            user_phone: c.user_phone || undefined,
            user_email: c.user_email || undefined,
            created_at: c.created_at,
            updated_at: c.updated_at,
            last_message: c.last_message || undefined,
            first_user_message: c.first_user_message || undefined,
            last_rag_level: c.last_rag_level || undefined,
            total_messages: Number(c.total_messages) || 0,
            status
          };
        });

        setSessions(mapped);

        // Si es la primera carga y no hay online pero sí historial, conmutar a closed
        if (!hasInitializedFilter.current && mapped.length > 0) {
          hasInitializedFilter.current = true;
          const onlineItems = mapped.filter(s => s.status === 'online');
          if (onlineItems.length === 0 && mapped.some(s => s.status === 'closed')) {
            setActiveFilter('closed');
            setSelectedId(mapped.find(s => s.status === 'closed')?.id || null);
            return;
          }
        }

        // Mantener la sesión seleccionada sin desincronizar
        setSelectedId(prev => {
          if (prev && mapped.some(s => s.id === prev)) return prev;
          const firstInFilter = mapped.find(s => s.status === activeFilter);
          return firstInFilter?.id || mapped[0]?.id || null;
        });
      }
    } catch (err) {
      console.warn('Error al cargar conversaciones:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [tenantId, activeFilter]);

  useEffect(() => {
    loadConversations(true);
    const timer = setInterval(() => loadConversations(false), 6000);
    return () => clearInterval(timer);
  }, [loadConversations]);

  const handleToggleStatus = async (id: string) => {
    const target = sessions.find(s => s.id === id);
    if (!target) return;
    const nextStatus = target.status === 'online' ? 'closed' : 'online';

    // Actualización optimista local
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));

    try {
      await fetch('/api/chat/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id, status: nextStatus })
      });
    } catch (e) {
      console.warn('Error sincronizando status con D1:', e);
    }
  };

  const handleChangeFilter = (filter: 'online' | 'closed') => {
    setActiveFilter(filter);
    const firstInFilter = sessions.find(s => s.status === filter);
    setSelectedId(firstInFilter?.id || null);
  };

  return {
    sessions,
    activeFilter,
    selectedId,
    loading,
    setSelectedId,
    handleToggleStatus,
    handleChangeFilter,
    reload: () => loadConversations(false)
  };
}

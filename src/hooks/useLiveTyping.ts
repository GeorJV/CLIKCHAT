import { useState, useCallback } from 'react';
import { useSmartPolling } from './useSmartPolling';

export function useLiveTyping(id?: string | null) {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [draftText, setDraftText] = useState<string>('');

  const checkTyping = useCallback(async () => {
    if (!id) {
      setIsTyping(false);
      setDraftText('');
      return;
    }
    try {
      const res = await fetch(`/api/chat/typing/${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = await res.json();
      setIsTyping(Boolean(data?.isTyping));
      setDraftText(data?.draftText || '');
    } catch {}
  }, [id]);

  useSmartPolling(checkTyping, {
    intervalMs: 2500,
    enabled: Boolean(id),
    runImmediatelyOnFocus: true,
  });

  return { isTyping, draftText };
}

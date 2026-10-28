import { useState, useEffect, useCallback } from 'react';
import { CrmLead, CrmMessage, CrmStageId, CrmInboxFilter } from '../types/crm';
import { useSmartPolling } from './useSmartPolling';

export function useVoceroCrm(tenantId?: string) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CrmMessage[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [filterInbox, setFilterInbox] = useState<CrmInboxFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadLeads = useCallback(async () => {
    if (!tenantId) return;
    try {
      const res = await fetch(`/api/crm/leads/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        const raw = Array.isArray(data.leads) ? data.leads : [];
        setLeads(raw.map((l: any) => ({
          ...l,
          name: l.name || 'Lead Web',
          phone: l.phone || '',
          email: l.email || '',
          last_message: l.last_message || 'Chat iniciado',
        })));
      }
    } catch (err) {
      console.warn('Error cargando leads CRM:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [tenantId]);

  useEffect(() => { setIsLoadingLeads(true); loadLeads(); }, [loadLeads]);
  useSmartPolling(loadLeads, { intervalMs: 8000, enabled: Boolean(tenantId), runImmediatelyOnFocus: true });
  useEffect(() => { if (leads.length > 0 && !selectedLeadId) setSelectedLeadId(leads[0].id); }, [leads, selectedLeadId]);

  const selectedLead = leads.find(l => l.id === selectedLeadId || l.session_id === selectedLeadId) || null;

  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/messages/${sessionId}`);
      if (res.ok) { const data = await res.json(); setMessages(data.messages || []); }
    } catch (err) { console.warn('Error cargando mensajes de sesión:', err); }
    finally { setIsLoadingMessages(false); }
  }, []);

  useEffect(() => {
    if (selectedLead?.session_id) { setIsLoadingMessages(true); loadMessages(selectedLead.session_id); }
    else setMessages([]);
  }, [selectedLead?.session_id, loadMessages]);

  const pollActiveMessages = useCallback(() => {
    if (selectedLead?.session_id) loadMessages(selectedLead.session_id);
  }, [selectedLead?.session_id, loadMessages]);
  useSmartPolling(pollActiveMessages, { intervalMs: 6000, enabled: Boolean(selectedLead?.session_id), runImmediatelyOnFocus: true });

  const changeLeadStage = useCallback(async (leadId: string, stage: CrmStageId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
    try { await fetch(`/api/crm/leads/${leadId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) }); } catch { loadLeads(); }
  }, [loadLeads]);

  const toggleTakeover = useCallback(async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId); if (!lead) return;
    const nextPaused = !lead.ai_paused; setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ai_paused: nextPaused } : l));
    try { await fetch(`/api/crm/leads/${leadId}/takeover`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ai_paused: nextPaused }) }); } catch { loadLeads(); }
  }, [leads, loadLeads]);

  const sendAgentMessage = useCallback(async (leadId: string, text: string) => {
    if (!text.trim() || !tenantId) return;
    const optMsg: CrmMessage = { id: 'opt_' + Date.now(), session_id: selectedLead?.session_id || leadId, sender: 'agent', message: text.trim(), created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optMsg]); setLeads(prev => prev.map(l => l.id === leadId ? { ...l, last_message: text.trim() } : l));
    try { const res = await fetch(`/api/crm/leads/${leadId}/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text.trim(), tenantId }) }); if (!res.ok) throw new Error('Error al enviar'); } catch (err) { console.warn(err); }
  }, [selectedLead, tenantId]);

  const updateLead = useCallback(async (leadId: string, fields: Partial<CrmLead>) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...fields } : l));
    try { await fetch(`/api/crm/leads/${leadId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) }); } catch { loadLeads(); }
  }, [loadLeads]);

  const createLead = useCallback(async (data: Partial<CrmLead>) => {
    if (!tenantId) return;
    try {
      const res = await fetch('/api/crm/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, tenantId }) });
      if (res.ok) {
        const json = await res.json();
        if (json.lead) { setLeads(prev => [json.lead, ...prev]); setSelectedLeadId(json.lead.id); }
      }
    } catch (err) { console.warn('Error creando lead manual:', err); }
  }, [tenantId]);

  const [readLeadIds, setReadLeadIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined' && tenantId) {
      try { const s = localStorage.getItem(`clikcrm_read_${tenantId}`); if (s) return new Set(JSON.parse(s)); } catch {}
    }
    return new Set<string>();
  });

  const markLeadAsRead = useCallback((leadId: string) => {
    if (!leadId) return;
    setReadLeadIds(prev => {
      const next = new Set(prev).add(leadId);
      const leadObj = leads.find(l => l.id === leadId || l.session_id === leadId);
      if (leadObj?.session_id) next.add(leadObj.session_id);
      if (leadObj?.id) next.add(leadObj.id);
      if (typeof window !== 'undefined' && tenantId) {
        try { localStorage.setItem(`clikcrm_read_${tenantId}`, JSON.stringify([...next])); } catch {}
      }
      return next;
    });
  }, [tenantId, leads]);

  useEffect(() => { if (selectedLeadId) markLeadAsRead(selectedLeadId); }, [selectedLeadId, markLeadAsRead]);

  const unreadCount = leads.filter(l => !readLeadIds.has(l.id) && !readLeadIds.has(l.session_id || '') && l.id !== selectedLeadId).length;
  const botAttendingCount = leads.filter(l => !l.ai_paused && (l.stage === 'lead' || l.stage === 'qualifying')).length;

  const deleteLead = useCallback(async (leadId: string): Promise<boolean> => {
    if (!leadId) return false;
    setLeads(prev => prev.filter(l => l.id !== leadId)); setSelectedLeadId(prev => (prev === leadId ? null : prev));
    try { const res = await fetch(`/api/crm/leads/${leadId}`, { method: 'DELETE' }); return res.ok; }
    catch (err) { console.warn('Error eliminando lead:', err); loadLeads(); return false; }
  }, [loadLeads]);

  const deleteLeads = useCallback(async (leadIds: string[]): Promise<boolean> => {
    if (!leadIds || leadIds.length === 0) return false;
    const idSet = new Set(leadIds); setLeads(prev => prev.filter(l => !idSet.has(l.id))); setSelectedLeadId(prev => (prev && idSet.has(prev) ? null : prev));
    try {
      const res = await fetch('/api/crm/leads/bulk-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: leadIds }) });
      if (!res.ok) await Promise.all(leadIds.map(id => fetch(`/api/crm/leads/${id}`, { method: 'DELETE' }).catch(() => null)));
      return true;
    } catch (err) { console.warn('Error eliminando leads múltiples:', err); loadLeads(); return false; }
  }, [loadLeads]);

  return {
    leads, selectedLeadId, setSelectedLeadId, selectedLead, messages,
    isLoadingLeads, isLoadingMessages, filterInbox, setFilterInbox,
    searchTerm, setSearchTerm, loadLeads, changeLeadStage,
    toggleTakeover, sendAgentMessage, updateLead, createLead,
    deleteLead, deleteLeads, readLeadIds, markLeadAsRead, unreadCount, botAttendingCount,
  };
}

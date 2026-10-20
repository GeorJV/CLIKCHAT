import { useState, useEffect, useCallback } from 'react';
import { CrmLead, CrmMessage, CrmStageId, CrmInboxFilter } from '../types/crm';

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
    setIsLoadingLeads(true);
    try {
      const res = await fetch(`/api/crm/leads/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.warn('Error cargando leads CRM:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Selección automática del primer lead si no hay ninguno seleccionado
  useEffect(() => {
    if (leads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  // Cargar mensajes cuando cambia el lead seleccionado
  const loadMessages = useCallback(async (sessionId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/messages/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.warn('Error cargando mensajes de sesión:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLead?.session_id) {
      loadMessages(selectedLead.session_id);
    } else {
      setMessages([]);
    }
  }, [selectedLead?.session_id, loadMessages]);

  const changeLeadStage = useCallback(async (leadId: string, stage: CrmStageId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
    try {
      await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
    } catch (err) {
      console.warn('Error actualizando stage de lead:', err);
      loadLeads();
    }
  }, [loadLeads]);

  const toggleTakeover = useCallback(async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const nextPaused = !lead.ai_paused;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ai_paused: nextPaused } : l));
    try {
      await fetch(`/api/crm/leads/${leadId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_paused: nextPaused })
      });
    } catch (err) {
      console.warn('Error alternando Human Takeover:', err);
      loadLeads();
    }
  }, [leads, loadLeads]);

  const sendAgentMessage = useCallback(async (leadId: string, text: string) => {
    if (!text.trim() || !tenantId) return;
    const optimisticMsg: CrmMessage = {
      id: 'opt_' + Date.now(),
      session_id: selectedLead?.session_id || leadId,
      sender: 'agent',
      message: text.trim(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, last_message: text.trim() } : l));

    try {
      const res = await fetch(`/api/crm/leads/${leadId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), tenantId })
      });
      if (!res.ok) throw new Error('Error al enviar mensaje');
    } catch (err) {
      console.warn('Error al enviar mensaje del asesor:', err);
    }
  }, [selectedLead, tenantId]);

  const updateLead = useCallback(async (leadId: string, fields: Partial<CrmLead>) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...fields } : l));
    try {
      await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
    } catch (err) {
      console.warn('Error actualizando lead:', err);
      loadLeads();
    }
  }, [loadLeads]);

  const createLead = useCallback(async (data: Partial<CrmLead>) => {
    if (!tenantId) return;
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tenantId })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.lead) {
          setLeads(prev => [json.lead, ...prev]);
          setSelectedLeadId(json.lead.id);
        }
      }
    } catch (err) {
      console.warn('Error creando lead manual:', err);
    }
  }, [tenantId]);

  return {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    selectedLead,
    messages,
    isLoadingLeads,
    isLoadingMessages,
    filterInbox,
    setFilterInbox,
    searchTerm,
    setSearchTerm,
    loadLeads,
    changeLeadStage,
    toggleTakeover,
    sendAgentMessage,
    updateLead,
    createLead,
  };
}

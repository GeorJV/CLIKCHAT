import React, { useState } from 'react';
import { CrmLead, CrmMessage, TrafficSource } from '../../../types/crm';
import { Sparkles, Instagram, ExternalLink, Smartphone, QrCode, Globe, Send, User, Pause, Play, ChevronDown } from 'lucide-react';

interface Props {
  leads: CrmLead[];
  selectedLead: CrmLead | null;
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  messages: CrmMessage[];
  onToggleTakeover: (leadId: string, paused: boolean) => void;
  onSendMessage: (sessionId: string, text: string) => void;
}

export const ClikChatConversationsView: React.FC<Props> = ({
  leads, selectedLead, selectedLeadId, onSelectLead, messages, onToggleTakeover, onSendMessage
}) => {
  const [sourceFilter, setSourceFilter] = useState<'all' | TrafficSource>('all');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [replyText, setReplyText] = useState('');

  const webLeads = leads.filter(l => l.channel === 'web' || l.channel === 'clikchat' || l.source);
  const filteredLeads = webLeads.filter(l => sourceFilter === 'all' || l.source === sourceFilter);

  const getSourceBadge = (source?: TrafficSource) => {
    switch (source) {
      case 'anuncio': return { label: 'Anuncio (Ads)', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Sparkles };
      case 'dm': return { label: 'DM Instagram / FB', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: Instagram };
      case 'post': return { label: 'Post / Bio', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ExternalLink };
      case 'sms': return { label: 'SMS / WhatsApp', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Smartphone };
      case 'qr': return { label: 'Código QR', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: QrCode };
      default: return { label: 'Web Directa', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Globe };
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedLead) return;
    onSendMessage(selectedLead.session_id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-xs font-sans">
      {/* Columna Izquierda: Lista de Chats con Atribución */}
      <div className="w-80 shrink-0 border-r border-[#e8edf6] flex flex-col bg-[#f8fafc]">
        {/* Filtros de Origen */}
        <div className="p-2.5 border-b border-[#e8edf6] flex items-center gap-1 relative bg-white">
          {(['all', 'anuncio', 'dm', 'sms'] as const).map((sf) => (
            <button
              key={sf} onClick={() => setSourceFilter(sf)}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer shrink-0 ${
                sourceFilter === sf ? 'bg-[#0d5bff] text-white shadow-xs' : 'text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9]'
              }`}
            >
              {sf === 'all' ? 'Todos' : sf === 'anuncio' ? 'Ads' : sf.toUpperCase()}
            </button>
          ))}

          <div className="relative ml-auto">
            <button
              type="button" onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${
                ['post', 'web', 'qr'].includes(sourceFilter) ? 'bg-[#0d5bff] text-white shadow-xs' : 'text-[#62728d] hover:text-[#0a1730] hover:bg-[#f1f5f9]'
              }`}
            >
              <span>{['post', 'web', 'qr'].includes(sourceFilter) ? sourceFilter.toUpperCase() : 'Más'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-32 rounded-xl border border-[#e2e8f0] bg-white p-1 shadow-lg z-30 animate-in fade-in zoom-in-95 duration-150">
                {(['post', 'web', 'qr'] as const).map((sf) => (
                  <button
                    key={sf} onClick={() => { setSourceFilter(sf); setShowMoreMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      sourceFilter === sf ? 'bg-blue-50 text-[#0d5bff]' : 'text-[#42506b] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {sf === 'post' ? 'Post / Bio' : sf === 'web' ? 'Web Directa' : 'Código QR'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista de leads */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredLeads.length === 0 ? (
            <p className="text-center text-xs text-[#8391aa] py-12">No hay chats en este filtro</p>
          ) : (
            filteredLeads.map((l) => {
              const active = selectedLeadId === l.id;
              const badge = getSourceBadge(l.source);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={l.id} onClick={() => onSelectLead(l.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    active ? 'bg-white border-[#0d5bff] shadow-xs ring-1 ring-[#0d5bff]/20' : 'bg-white border-[#e8edf6] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0a1730] truncate">{l.name}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold border ${badge.color}`}>
                      <BadgeIcon className="h-2.5 w-2.5" />
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#62728d] truncate">{l.last_message || 'Sin mensajes aún'}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalle de Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedLead ? (
          <>
            <div className="h-14 shrink-0 px-4 border-b border-[#e8edf6] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#0d5bff]/10 text-[#0d5bff] font-bold text-xs flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0a1730]">{selectedLead.name}</h4>
                  <div className="flex items-center gap-2 text-[10.5px] text-[#8391aa]">
                    <span>Origen: <strong>{getSourceBadge(selectedLead.source).label}</strong></span>
                    {selectedLead.deal_value > 0 && <span className="text-[#0f8b44] font-mono font-bold">₡{selectedLead.deal_value.toLocaleString()}</span>}
                  </div>
                </div>
              </div>

              <button
                type="button" onClick={() => onToggleTakeover(selectedLead.id, !selectedLead.ai_paused)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedLead.ai_paused ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#eaf7ef] text-[#0f8b44] border border-[#d7eede]'
                }`}
              >
                {selectedLead.ai_paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                <span>{selectedLead.ai_paused ? 'IA Pausada' : 'IA Activa'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f6f8fc]">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs border ${
                    m.sender === 'user' ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm' : 'bg-white border-[#e2e8f0] text-[#0a1730] rounded-tl-sm'
                  }`}>
                    {m.message}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-[#e8edf6] flex items-center gap-2 bg-white">
              <input
                type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta como asesor humano..."
                className="flex-1 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d5bff] text-white text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer">
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8391aa]">
            Selecciona una conversación para ver los mensajes y atribución
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, Trash2, ArrowUpRight, FlaskConical, MessageSquare } from 'lucide-react';
import { LabSessionRecord, getLabSessions, deleteLabSessionRecord, formatLabChatForClipboard } from './labHistoryStore';

interface LiveLabHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
  tenantName: string;
  botName: string;
  currentSeq: string;
  onSelectSession: (session: LabSessionRecord) => void;
  onNewSession: () => void;
}

export const LiveLabHistoryModal: React.FC<LiveLabHistoryModalProps> = ({
  isOpen, onClose, tenantSlug, tenantName, botName, currentSeq, onSelectSession, onNewSession
}) => {
  const [sessions, setSessions] = useState<LabSessionRecord[]>(() => getLabSessions(tenantSlug));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (s: LabSessionRecord) => {
    const text = formatLabChatForClipboard({
      seq: s.seq,
      botName,
      tenantName,
      messages: s.messages,
      sessionId: s.id
    });
    await navigator.clipboard.writeText(text);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    deleteLabSessionRecord(tenantSlug, id);
    setSessions(getLabSessions(tenantSlug));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-[#dde5f1] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#e8edf6] bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-[#0d5bff]" />
            <div>
              <h3 className="text-sm font-bold text-[#0a1730]">Historial de Chats de Prueba</h3>
              <p className="text-[11px] text-[#6b7c96]">Sesiones registradas con número de secuencia para intervención rápida</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#8391aa] hover:bg-slate-200 transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#8391aa]">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>Aún no hay conversaciones guardadas en el historial del Lab.</p>
            </div>
          ) : (
            sessions.map((s) => {
              const isCurrent = s.seq === currentSeq;
              return (
                <div key={s.id} className={`p-3 rounded-xl border transition flex flex-col gap-2 ${isCurrent ? 'border-[#0d5bff] bg-blue-50/40' : 'border-[#e8edf6] bg-white hover:border-[#cbd5e1]'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-[#0d5bff]/10 text-[#0d5bff]">
                        {s.seq}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Activo</span>
                      )}
                      <span className="text-[11px] text-[#8391aa] truncate">
                        {new Date(s.updatedAt || s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {s.messages.length} msgs
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(s)}
                        title="Copiar conversación completa"
                        className="p-1.5 rounded-lg border border-[#dde5f1] hover:bg-slate-100 text-[#42506b] transition cursor-pointer"
                      >
                        {copiedId === s.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => { onSelectSession(s); onClose(); }}
                        title="Cargar esta conversación"
                        className="px-2.5 py-1 rounded-lg bg-[#0d5bff] hover:bg-[#0047e1] text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Cargar</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        title="Eliminar de historial"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {s.lastSnippet && (
                    <p className="text-xs text-[#42506b] line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{s.lastSnippet}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-[#e8edf6] bg-[#f8fafc] flex justify-between items-center gap-2">
          <button
            onClick={() => { onNewSession(); onClose(); }}
            className="px-3 py-1.5 rounded-xl border border-[#0d5bff] text-[#0d5bff] hover:bg-[#0d5bff]/10 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Nueva Prueba de Lab</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

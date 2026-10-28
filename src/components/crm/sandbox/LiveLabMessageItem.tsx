import React from 'react';
import { Layers, CheckCircle, Edit3, Calendar, Clock, DollarSign, User, Mail, Phone, Bot } from 'lucide-react';
import { SandboxMsg } from './sandboxConstants';

interface LiveLabMessageItemProps {
  message: SandboxMsg;
  agentName?: string;
  agentAvatar?: string;
  onOpenCorrection: (msg: SandboxMsg) => void;
}

export const LiveLabMessageItem: React.FC<LiveLabMessageItemProps> = ({
  message: m,
  agentName = 'Asesor Virtual',
  agentAvatar,
  onOpenCorrection,
}) => {
  const isUser = m.sender === 'user';
  const cardMatch = !isUser && m.text ? m.text.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/) : null;
  const cleanText = cardMatch ? m.text.replace(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/g, '').trim() : m.text;
  let parsedCard: any = null;
  if (cardMatch) {
    try { parsedCard = JSON.parse(cardMatch[1]); } catch (e) {}
  }

  const renderFormattedText = (txt: string) => {
    return txt.split('\n').map((line, lIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={lIdx}>
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-[#0a1730]">{p.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{p}</span>;
          })}
          {lIdx < txt.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && (
        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono flex-wrap">
          <div className="flex items-center gap-1 font-sans font-bold text-[#0a1730] mr-1">
            {agentAvatar ? (
              <img src={agentAvatar} alt={agentName} className="w-4 h-4 rounded-full object-cover border border-slate-300" />
            ) : (
              <Bot className="w-3.5 h-3.5 text-[#0d5bff]" />
            )}
            <span className="text-[11px] font-bold text-slate-800">{agentName}</span>
          </div>
          {m.rag && (
            <span className="text-[#0038d8] bg-[#ebf1ff] px-2 py-0.5 rounded-full flex items-center gap-1 font-sans font-bold">
              <Layers className="h-2.5 w-2.5" /> {m.rag}
            </span>
          )}
          {m.score && (
            <span className="text-[#0f8b44] bg-[#eaf7ef] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <CheckCircle className="h-2.5 w-2.5" /> Calidad {m.score}/100
            </span>
          )}
          {m.modelUsed && (
            <span className="text-[#7c3aed] bg-[#f5f3ff] border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              ⚡ {m.modelUsed}
            </span>
          )}
          {m.fallbackUsed && (
            <span className="text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              🛡️ Rescate por Fallo
            </span>
          )}
          <button
            type="button"
            onClick={() => onOpenCorrection(m)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[#0d5bff] hover:bg-blue-100 transition cursor-pointer font-sans font-bold"
            title="Modificar respuesta del agente"
          >
            <Edit3 className="h-2.5 w-2.5" />
            <span>Modificar</span>
          </button>
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl p-3 text-[13px] leading-relaxed border shadow-xs break-words ${
          isUser
            ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm'
            : 'bg-[#ebf1ff] border-[#d3e2ff] text-[#0a1730] rounded-tl-sm'
        }`}
      >
        <div>{renderFormattedText(cleanText)}</div>
        {parsedCard && (
          <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-300 text-xs text-[#0a1730] shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Cita Confirmada en Agenda D1</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-zinc-700">
              <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-600 shrink-0" /><span><strong>Fecha:</strong> {parsedCard.date}</span></div>
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-emerald-600 shrink-0" /><span><strong>Hora:</strong> {parsedCard.time}</span></div>
              {parsedCard.customerName && <div className="flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-500 shrink-0" /><span><strong>Cliente:</strong> {parsedCard.customerName}</span></div>}
              {parsedCard.customerEmail && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-zinc-500 shrink-0" /><span><strong>Email:</strong> {parsedCard.customerEmail}</span></div>}
              {parsedCard.customerPhone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-zinc-500 shrink-0" /><span><strong>Tel:</strong> {parsedCard.customerPhone}</span></div>}
              {parsedCard.price !== undefined && <div className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-emerald-600 shrink-0" /><span><strong>Inversión:</strong> ${parsedCard.price} {parsedCard.currency || 'USD'}</span></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

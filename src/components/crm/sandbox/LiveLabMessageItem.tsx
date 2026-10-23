import React from 'react';
import { Layers, CheckCircle, Edit3 } from 'lucide-react';
import { SandboxMsg } from './sandboxConstants';

interface LiveLabMessageItemProps {
  message: SandboxMsg;
  onOpenCorrection: (msg: SandboxMsg) => void;
}

export const LiveLabMessageItem: React.FC<LiveLabMessageItemProps> = ({
  message: m,
  onOpenCorrection,
}) => {
  const isUser = m.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && (
        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono flex-wrap">
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
          <button
            type="button"
            onClick={() => onOpenCorrection(m)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[#0d5bff] hover:bg-blue-100 transition cursor-pointer font-sans font-bold"
            title="Modificar respuesta del agente"
          >
            <Edit3 className="h-2.5 w-2.5" />
            <span>Modificar respuesta</span>
          </button>
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl p-3 text-[13px] leading-relaxed border shadow-sm break-words ${
          isUser
            ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm'
            : 'bg-[#ebf1ff] border-[#d3e2ff] text-[#0a1730] rounded-tl-sm'
        }`}
      >
        {m.text}
      </div>
    </div>
  );
};

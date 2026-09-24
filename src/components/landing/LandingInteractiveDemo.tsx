import React, { useState } from 'react';
import { Send, Bot, ShoppingBag, Gem } from 'lucide-react';

export const LandingInteractiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; product?: { name: string; price: string; img: string } }>>([
    {
      sender: 'bot',
      text: 'Sea bienvenido a la demostración de ClikChat. Soy Sofía, su asesora comercial. ¿En qué producto o cotización de nuestro catálogo le asisto hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    '¿Qué calzado deportivo de alta gama tienen hoy?',
    '¿Cuál es su horario de atención comercial?',
    '¿Cómo confirmo una compra directa por WhatsApp?'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isTyping) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = 'Con todo gusto le proporciono la información verificada de nuestra tienda.';
      let product: { name: string; price: string; img: string } | undefined = undefined;

      const lower = q.toLowerCase();
      if (lower.includes('calzado') || lower.includes('zapatilla') || lower.includes('alta gama') || lower.includes('producto')) {
        botReply = 'Le recomiendo nuestro modelo insignia Nike Air Zoom Alpha Pro. Incorpora amortiguación técnica de alto rendimiento y acabados transpirables premium para máximo confort.';
        product = {
          name: 'Nike Air Zoom Alpha Pro Edition',
          price: '$89.00 USD',
          img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
        };
      } else if (lower.includes('horario') || lower.includes('atencion')) {
        botReply = 'Nuestra atención comercial presencial opera de Lunes a Sábado de 8:00 AM a 7:00 PM. No obstante, mediante este canal inteligente puede cotizar, consultar inventario y comprar las 24 horas del día.';
      } else if (lower.includes('whatsapp') || lower.includes('compra')) {
        botReply = 'Al pulsar el botón de compra que le facilito, se abre de inmediato su WhatsApp oficial con el producto seleccionado y los detalles de pago para procesar la transacción sin demoras.';
      } else {
        botReply = 'Excelente consulta. El motor de ClikChat se ciñe con precisión matemática a los datos oficiales de su catálogo, evitando cualquier tipo de alucinación o dato impreciso.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, product }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="demo" className="max-w-4xl mx-auto px-4 sm:px-6 py-18">
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#8c6b38] font-bold bg-[#f4efe4] px-4 py-1.5 rounded-full border border-[#ded4be]">
          Experiencia Interactiva
        </span>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#181716] tracking-tight">
          Ponga a prueba la precisión de ClikChat
        </h2>
        <p className="text-xs sm:text-sm text-[#615a4f] font-light">
          Pulse una consulta de prueba o formule su propia pregunta para evaluar la cadencia y nivel de respuesta.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-[#ded7cb] shadow-[0_12px_44px_rgba(20,18,15,0.06)] overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#faf8f5] border-b border-[#eae4d8] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#181716] border border-[#3d3830] flex items-center justify-center text-[#dfc18b] shadow-sm">
              <Gem className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-cinzel text-xs font-bold text-[#181716] flex items-center gap-2">
                Sofía • Concierge ClikChat
                <span className="w-2 h-2 rounded-full bg-[#194c37] animate-pulse" />
              </p>
              <p className="text-[10px] text-[#787166]">Enlace activo • Respuestas sin latencia</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#785929] bg-[#f4efe4] border border-[#ded3be] px-2.5 py-1 rounded-full">
            Simulador Oficial
          </span>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fbfaf8]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-[#f0e8d8] border border-[#decbb0] flex items-center justify-center text-[#6e4e20] text-xs shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${m.sender === 'user' ? 'bg-[#181716] text-[#fbfaf8] rounded-br-none border border-[#2e2a25] shadow-sm' : 'bg-white border border-[#e5ded4] text-[#2b2721] rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}`}>
                <p className="font-light">{m.text}</p>
                {m.product && (
                  <div className="mt-3 p-3 rounded-2xl bg-[#faf8f5] border border-[#e4dfd5] flex items-center gap-3">
                    <img src={m.product.img} alt={m.product.name} className="w-14 h-14 rounded-xl object-cover border border-[#e8e4dc]" />
                    <div className="flex-1">
                      <p className="font-cinzel font-bold text-[#181716] text-xs">{m.product.name}</p>
                      <p className="text-[#194c37] font-bold text-xs mt-0.5">{m.product.price}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-[#194c37] hover:bg-[#123627] text-white font-bold text-[10px] flex items-center gap-1.5 shadow-sm transition">
                      <ShoppingBag className="w-3 h-3" /> Adquirir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-[11px] text-[#787166]">
              <Bot className="w-3.5 h-3.5 animate-spin text-[#9c783c]" />
              <span>Sofía está preparando la respuesta...</span>
            </div>
          )}
        </div>

        {/* Quick Pills */}
        <div className="px-4 py-2.5 bg-white border-t border-[#eae5dc] overflow-x-auto flex gap-2 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-[#f4efe4] hover:bg-[#eae2d3] text-[#4d402b] border border-[#ded3be] whitespace-nowrap transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3.5 bg-[#faf8f5] border-t border-[#eae5dc] flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Escriba su consulta comercial..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white border border-[#ded7cb] rounded-xl px-4 py-2.5 text-xs text-[#181716] placeholder-[#8f8679] focus:outline-none focus:border-[#9c783c] transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-[#181716] hover:bg-[#2c2824] disabled:opacity-40 text-[#dfc18b] border border-[#2e2a25] transition cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

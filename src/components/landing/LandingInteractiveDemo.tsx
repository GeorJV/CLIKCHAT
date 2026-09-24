import React, { useState } from 'react';
import { Send, Bot, Sparkles, ShoppingBag } from 'lucide-react';

export const LandingInteractiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; product?: { name: string; price: string; img: string } }>>([
    {
      sender: 'bot',
      text: '¡Hola! Bienvenido a la demo en vivo de ClikChat. Soy Sofía, tu asesora virtual. ¿En qué producto o servicio puedo asesorarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    '¿Qué zapatillas deportivas tienen en oferta?',
    '¿Cuáles son sus horarios de atención?',
    '¿Cómo hago para comprar por WhatsApp?'
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isTyping) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = 'Con gusto te colaboro con la información oficial de la tienda.';
      let product: { name: string; price: string; img: string } | undefined = undefined;

      const lower = q.toLowerCase();
      if (lower.includes('zapatilla') || lower.includes('oferta') || lower.includes('producto')) {
        botReply = '¡Tenemos disponibles las Nike Air Zoom Alpha con 20% de descuento hoy! Vienen con amortiguación premium y suela antideslizante para running y entrenamiento.';
        product = {
          name: 'Nike Air Zoom Alpha Pro',
          price: '$89.00 USD',
          img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
        };
      } else if (lower.includes('horario') || lower.includes('abierto')) {
        botReply = 'Nuestro horario de atención comercial es de Lunes a Sábado de 8:00 AM a 7:00 PM. Pero a través de este chat inteligente puedes cotizar y comprar las 24 horas del día.';
      } else if (lower.includes('whatsapp') || lower.includes('comprar')) {
        botReply = 'Solo debes hacer clic en el botón de compra que te genero y automáticamente se abre tu WhatsApp con los datos del pedido listos para pagar.';
      } else {
        botReply = 'Excelente pregunta. El asesor inteligente de ClikChat consulta la base de datos de tu tienda y te responde con datos 100% verificados y sin alucinaciones.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, product }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="demo" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center space-y-3 mb-8">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          Simulador en Tiempo Real
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Prueba la experiencia de venta de ClikChat ahora mismo
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Haz clic en una pregunta rápida o escribe lo que quieras para ver cómo responde y vende.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[480px]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Sofía • Asesora ClikChat
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-[10px] text-slate-500">En línea • Respuestas en tiempo real</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Demo Interactiva
          </span>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 text-[10px] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                <p>{m.text}</p>
                {m.product && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <img src={m.product.img} alt={m.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-[11px]">{m.product.name}</p>
                      <p className="text-emerald-600 font-bold text-[11px]">{m.product.price}</p>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition">
                      <ShoppingBag className="w-3 h-3" /> Comprar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Bot className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Sofía está escribiendo...</span>
            </div>
          )}
        </div>

        {/* Quick Pills */}
        <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 whitespace-nowrap transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe una pregunta para la demo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

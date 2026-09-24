import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, ShoppingBag, ArrowRight } from 'lucide-react';

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
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Simulador en Tiempo Real
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Prueba la experiencia de venta de ClikChat ahora mismo
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Haz clic en una pregunta rápida o escribe lo que quieras para ver cómo responde y vende.
        </p>
      </div>

      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[460px]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                Sofía • Asesora ClikChat
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="text-[10px] text-zinc-400">En línea • Respuestas en tiempo real</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            Demo Interactiva
          </span>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#09090b]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-[10px] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'}`}>
                <p>{m.text}</p>
                {m.product && (
                  <div className="mt-2.5 p-2 rounded-xl bg-black/60 border border-zinc-800 flex items-center gap-2.5">
                    <img src={m.product.img} alt={m.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-white text-[11px]">{m.product.name}</p>
                      <p className="text-emerald-400 font-bold text-[11px]">{m.product.price}</p>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> Comprar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <Bot className="w-3.5 h-3.5 animate-spin" />
              <span>Sofía está escribiendo...</span>
            </div>
          )}
        </div>

        {/* Quick Pills */}
        <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe una pregunta para la demo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

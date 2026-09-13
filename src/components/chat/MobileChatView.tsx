import React, { useState, useEffect, useRef } from 'react';
import { Tenant, Product, ChatMessage } from '../../types';
import { ChatHeader } from './ChatHeader';
import { ProductCarousel } from './ProductCarousel';
import { DesktopProductShowcase } from './DesktopProductShowcase';
import { FullscreenViewer } from './FullscreenViewer';
import { PersistentCTA } from './PersistentCTA';
import { LeadCaptureModal } from './LeadCaptureModal';
import { Send, Sparkles, Loader2, HelpCircle, ArrowUp } from 'lucide-react';
import { subscribeUserToPush } from '../../services/pwaPush';

interface MobileChatViewProps {
  tenantSlug?: string;
  onNavigateToPanel?: () => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  tenantSlug = 'demo-store',
  onNavigateToPanel
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Mobile strict collapse state: true when typing / input is focused
  const [isCarouselCollapsed, setIsCarouselCollapsed] = useState(false);

  // Fullscreen viewer state
  const [fullscreenProduct, setFullscreenProduct] = useState<Product | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load tenant profile & products
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch(`/api/tenants/${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          setTenant(data.tenant);
          const prods = data.products || [];
          setProducts(prods);
          if (prods.length > 0) {
            setSelectedProduct(prods[0]);
          }

          const initialSession = 'sess_' + Math.random().toString(36).substring(2, 9);
          setSessionId(initialSession);

          setMessages([
            {
              id: 'welcome-msg',
              sender: 'assistant',
              message: data.tenant?.welcome_message || '¡Hola! Bienvenido a nuestra tienda.',
              levelLabel: 'Saludo Oficial',
              created_at: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Error cargando tenant:', err);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to 3-Level RAG Backend
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      message: text.trim(),
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenant?.slug || tenantSlug,
          tenantId: tenant?.id,
          sessionId,
          message: text.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servicio de chat');
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        message: data.answer || 'He recibido tu mensaje.',
        rag_level_used: data.level,
        levelLabel: data.levelLabel,
        confidence: data.confidence,
        stoppedEarly: data.stoppedEarly,
        products: data.products,
        isFallback: data.isFallback,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMsg]);

      // If specific product returned in RAG L3, select it for the showcase
      if (data.products && data.products.length > 0) {
        setSelectedProduct(data.products[0]);
      }

      // If RAG Fallback was triggered, open Lead Capture Modal
      if (data.isFallback || data.requiresLeadInfo) {
        setTimeout(() => {
          setShowLeadModal(true);
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          message: 'Lo siento, hubo un problema momentáneo de conexión. Por favor intenta de nuevo.',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    const newSession = 'sess_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newSession);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        message: tenant?.welcome_message || '¡Hola! ¿En qué producto estás interesado hoy?',
        levelLabel: 'Saludo Oficial',
        created_at: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="w-full h-full lg:max-w-6xl lg:mx-auto lg:p-4 lg:grid lg:grid-cols-12 lg:gap-6 relative">
      
      {/* ========================================================================= */}
      {/* COLUMNA IZQUIERDA: CHAT CON EL AGENTE IA (MÓVIL & ESCRITORIO)              */}
      {/* ========================================================================= */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full bg-slate-950 border-x lg:border border-slate-800 lg:rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* 1. Cabecera fija dinámica con estado 'En línea' */}
        <ChatHeader
          tenant={tenant}
          onResetChat={resetChat}
        />

        {/* 2. Tarjeta de producto móvil (30% superior) - REGLA ESTRICTA: Se colapsa al hacer focus en el input */}
        <ProductCarousel
          products={products}
          isCollapsed={isCarouselCollapsed}
          onOpenFullscreen={(p) => setFullscreenProduct(p)}
        />

        {/* 3. Área de Mensajes de Conversación con Scroll */}
        <div
          className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950"
          onClick={() => {
            // Unfocus input to restore carousel on mobile
            setIsCarouselCollapsed(false);
            inputRef.current?.blur();
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-800/95 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  {/* RAG Level Badge Tag */}
                  {!isUser && msg.levelLabel && (
                    <div className="mb-1.5 flex items-center space-x-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        msg.rag_level_used === 'level_2_faq'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : msg.rag_level_used === 'level_3_catalog'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : msg.rag_level_used === 'fallback_hitl'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {msg.levelLabel}
                      </span>
                      {msg.confidence !== undefined && msg.confidence > 0 && (
                        <span className="text-[10px] text-slate-400">
                          ({Math.round(msg.confidence * 100)}% certeza)
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.message}</p>

                  {/* Product quick-preview card in chat if returned by RAG L3 */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/70 space-y-2">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setFullscreenProduct(p);
                          }}
                          className="flex items-center space-x-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition"
                        >
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-indigo-400 font-semibold">${p.price} {p.currency}</p>
                          </div>
                          <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md font-bold">
                            Ver HD
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback button if query was unresolved */}
                  {msg.isFallback && (
                    <button
                      onClick={() => setShowLeadModal(true)}
                      className="mt-2.5 w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition flex items-center justify-center space-x-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                      <span>Activar Notificación Push PWA & Contacto</span>
                    </button>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Verificando catálogo y formulando respuesta...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Pills */}
        <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto flex space-x-2 scrollbar-none">
          <button
            onClick={() => handleSendMessage('¿Cuáles son los métodos de pago?')}
            className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            💳 Métodos de Pago
          </button>
          <button
            onClick={() => handleSendMessage('Háblame del Cronógrafo Suizo Royal Black')}
            className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            ⌚ Ver Reloj
          </button>
          <button
            onClick={() => handleSendMessage('¿Cuánto tarda el envío y cuánto cuesta?')}
            className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            🚚 Envíos Gratis
          </button>
          <button
            onClick={() => handleSendMessage('¿Hacen envíos a Marte en cohete supersónico?')}
            className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            ❓ Probar Fallback HITL
          </button>
        </div>

        {/* 4. Sticky CTA móvil: Anclado JUSTO ARRIBA del input */}
        <div className="lg:hidden">
          <PersistentCTA
            tenant={tenant}
            activeProduct={selectedProduct}
          />
        </div>

        {/* 5. Input Bar del Chat (Focus colapsa el carrusel para prioridad al teclado en móvil) */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsCarouselCollapsed(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Escribe tu mensaje o consulta comercial..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition active:scale-95 shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMNA DERECHA: ESCAPARATE FIJO (EXCLUSIVO ESCRITORIO PC)               */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-4 h-full">
        <DesktopProductShowcase
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onOpenFullscreen={(p) => setFullscreenProduct(p)}
        />
      </div>

      {/* Fullscreen Product Viewer (Tap on image opens fullscreen carousel) */}
      {fullscreenProduct && (
        <FullscreenViewer
          product={fullscreenProduct}
          onClose={() => setFullscreenProduct(null)}
        />
      )}

      {/* Fallback Human-in-the-Loop & PWA Push Subscription Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        sessionId={sessionId}
        tenantId={tenant?.id || ''}
        onClose={() => setShowLeadModal(false)}
        onSaved={async () => {
          // Trigger PWA Push Manager subscription
          await subscribeUserToPush(sessionId);

          setMessages((prev) => [
            ...prev,
            {
              id: 'lead-ack-' + Date.now(),
              sender: 'assistant',
              message: '¡Datos recibidos! Tu consulta ha sido enviada al dueño de la tienda y las notificaciones push han sido configuradas. Te avisaremos en cuanto tengamos la respuesta.',
              levelLabel: 'Notificación PWA Activada',
              created_at: new Date().toISOString()
            }
          ]);
        }}
      />
    </div>
  );
};

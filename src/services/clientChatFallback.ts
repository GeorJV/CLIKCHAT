import { ProductItem } from '../types/productChat';

export interface FallbackChatParams {
  tenantSlug: string;
  storeName?: string;
  agentName?: string;
  businessType?: string;
  userMessage: string;
  selectedProduct?: ProductItem;
  products?: ProductItem[];
  sessionId?: string;
}

export interface FallbackChatResult {
  answer: string;
  level: string;
  levelLabel: string;
  confidence: number;
  provider: string;
}

const getOpenRouterKey = (): string => {
  try {
    return atob('c2stb3ItdjEtZjVlNzBmZjUwYzViNzIwZDg1NWFmOWM3ZWQzN2E2YWYwZTcwMjY4NGZjZjY0ZWQxZTQ0OTgwNjRlYzhkZDg1ZQ==');
  } catch {
    return '';
  }
};

export async function generateClientChatFallback(params: FallbackChatParams): Promise<FallbackChatResult> {
  const { storeName = 'Tienda Oficial', agentName = 'Asesor Virtual', businessType = 'tienda', userMessage, selectedProduct, products = [] } = params;
  const cleanMsg = (userMessage || '').trim();
  const lowerMsg = cleanMsg.toLowerCase();

  // 1. Saludos iniciales universales
  const isGreeting = /^(hola|buenas|buenos\s*d[ií]as|buenas\s*tardes|buenas\s*noches|hey|hi|hello)\b/i.test(cleanMsg) && cleanMsg.split(/\s+/).length <= 4;
  if (isGreeting) {
    const greetingText = businessType === 'restaurante'
      ? `¡Hola! 👋 Bienvenido a **${storeName}**. Soy ${agentName}, tu mesera virtual. ¿En qué te puedo colaborar hoy o qué se te antoja ordenar?`
      : `¡Hola! 👋 Bienvenido a **${storeName}**. Soy ${agentName}, tu asesora virtual. ¿En qué te puedo colaborar el día de hoy?`;

    return {
      answer: greetingText,
      level: 'level_1',
      levelLabel: 'Nivel 1: Saludo & Asesoría Inicial',
      confidence: 0.98,
      provider: 'Motor Conversacional Inteligente'
    };
  }

  // 2. Consulta de catálogo / productos generales
  const isAskingCatalog = /\b(que\s*tienen|men[uú]|catalogo|que\s*venden|productos|opciones|carta)\b/i.test(lowerMsg);
  if (isAskingCatalog && products.length > 0) {
    const productList = products.slice(0, 5).map(p => `• **${p.title}** - $${p.price} ${p.currency}`).join('\n');
    const catalogAnswer = `Con mucho gusto, aquí tienes algunas de nuestras mejores opciones en **${storeName}**:\n\n${productList}\n\n¿Te llama la atención alguno en particular para darte más detalles?`;
    return {
      answer: catalogAnswer,
      level: 'level_3_catalog',
      levelLabel: 'Nivel 3: Catálogo Destacado',
      confidence: 0.95,
      provider: 'Catálogo Local'
    };
  }

  // 3. Intento de llamada directa a OpenRouter con timeout breve (resiliencia multi-canal)
  try {
    const apiKey = getOpenRouterKey();
    if (apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const productContext = selectedProduct
        ? `Producto enfocado actualmente: "${selectedProduct.title}", Precio: ${selectedProduct.price} ${selectedProduct.currency}. Descripción: ${selectedProduct.description || ''}. Beneficios: ${(selectedProduct.benefits || []).join(', ')}.`
        : '';

      const systemPrompt = `Eres ${agentName}, el asesor comercial y de atención al cliente de "${storeName}" (Tipo: ${businessType}).
Tu tono es amable, profesional, empático y orientado a ayudar al cliente a tomar la mejor decisión de compra.
${productContext}
Responde de manera concisa (máximo 2 párrafos), clara y cordial en español. Si el usuario pregunta algo general, guíalo amablemente sin inventar datos no disponibles.`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://clikchat.pages.dev',
          'X-Title': 'ClikChat Client Resilient AI'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: cleanMsg }
          ],
          max_tokens: 300,
          temperature: 0.4
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const aiReply = data.choices?.[0]?.message?.content?.trim();
        if (aiReply) {
          return {
            answer: aiReply,
            level: 'level_3_catalog',
            levelLabel: 'Nivel 3: Asesoría IA Resiliente',
            confidence: 0.95,
            provider: 'OpenRouter DeepSeek (Multi-Edge)'
          };
        }
      }
    }
  } catch {
    // Si la llamada externa también falla o hace timeout, continuar con respuesta determinista de cortesía
  }

  // 4. Respuesta contextual si se enfoca un producto
  if (selectedProduct && selectedProduct.title) {
    return {
      answer: `Con gusto te asesoro sobre **${selectedProduct.title}**. Cuenta con un valor de $${selectedProduct.price} ${selectedProduct.currency}. ¿Deseas conocer más detalles específicos o agregarlo a tu pedido?`,
      level: 'level_3_catalog',
      levelLabel: 'Nivel 3: Asistencia de Producto',
      confidence: 0.9,
      provider: 'Asesor Local'
    };
  }

  // 5. Salida de cortesía cordial
  return {
    answer: `Entendido. En **${storeName}** estamos para servirte. ¿Hay algún producto o consulta en específico sobre la que te gustaría que te oriente?`,
    level: 'level_1',
    levelLabel: 'Nivel 1: Asistencia General',
    confidence: 0.85,
    provider: 'Asesor Local'
  };
}

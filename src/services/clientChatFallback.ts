import { ProductItem } from '../types/productChat';

export interface FallbackChatParams {
  tenantSlug: string;
  storeName?: string;
  agentName?: string;
  businessType?: string;
  welcomeMessage?: string;
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
  const { storeName = 'Tienda Oficial', agentName = 'Asesor Virtual', businessType = 'tienda', welcomeMessage, userMessage, selectedProduct, products = [] } = params;
  const cleanMsg = (userMessage || '').trim();
  const lowerMsg = cleanMsg.toLowerCase();
  const cleanGreeting = lowerMsg.replace(/^[¡!¿?\s\.,;:()\-]+|[¡!¿?\s\.,;:()\-]+$/g, '').trim();

  // 1. Saludos iniciales universales
  const isGreeting = /^(hola|buenas|buenos\s*d[ií]as|buenas\s*tardes|buenas\s*noches|hey|hi|hello|saludos|que\s*tal|pura\s*vida)\b/i.test(cleanGreeting) && cleanMsg.split(/\s+/).length <= 4;
  if (isGreeting) {
    const greetingText = welcomeMessage && welcomeMessage.trim()
      ? welcomeMessage.replace(/\{nombre_del_negocio\}|\{negocio\}/gi, storeName).replace(/\{asesor\}|\{bot\}/gi, agentName)
      : (businessType === 'restaurante'
          ? `¡Hola! 👋 Bienvenido a **${storeName}**. Soy ${agentName}, tu mesera virtual. ¿En qué te puedo colaborar hoy o qué se te antoja ordenar?`
          : `¡Hola! 👋 Bienvenido a **${storeName}**. Soy ${agentName}, tu asesora virtual. ¿En qué te puedo colaborar el día de hoy?`);

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
REGLA CRÍTICA: NUNCA pienses en voz alta ni redactes razonamientos internos ("El usuario quiere...", "Debo..."). Responde DIRECTAMENTE al cliente como en WhatsApp.
Responde de manera concisa (máximo 2 párrafos), clara y cordial en español. Si el usuario pregunta algo general, guíalo amablemente sin inventar datos no disponibles.`;

      for (const mId of ['openai/gpt-4o-mini', 'deepseek/deepseek-chat']) {
        try {
          const reqPayload: Record<string, any> = {
            model: mId,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: cleanMsg }
            ],
            max_tokens: 500,
            temperature: 0.35,
            provider: {
              sort: 'latency',
              allow_fallbacks: false
            }
          };
          if (mId.includes('glm')) {
            reqPayload.reasoning = { effort: 'low' };
          }
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': 'https://clikchat.pages.dev',
              'X-Title': 'ClikChat Client Resilient AI'
            },
            body: JSON.stringify(reqPayload),
            signal: controller.signal
          });
          if (res.ok) {
            const data = await res.json();
            const choice = data.choices?.[0];
            const isCutOff = choice?.finish_reason === 'length';
            let aiReply = choice?.message?.content?.trim();
            if (aiReply && !isCutOff) {
              aiReply = aiReply.replace(/<(?:think|thought|reasoning|co_thought)>[\s\S]*?(?:<\/(?:think|thought|reasoning|co_thought)>|$)/gi, '').trim();
              const isBad = /user safety|response safety|safety:\s*safe/i.test(aiReply) || aiReply.toLowerCase() === 'safe';
              const cotRegex = /^(?:el\s+usuario\s+(?:quiere|dice|pregunta|busca|est[aá]|solicita)|el\s+cliente\s+(?:quiere|dice|pregunta)|seg[uú]n\s+(?:las\s+reglas|el\s+contexto)|debo\s+(?:recomendar|responder|saludar|seguir|tener|hacer)|necesito\s+(?:mostrar|verificar|responder)|voy\s+a\s+(?:estructurar|responder|recomendar)|the\s+user\s+(?:is\s+asking|says|wants|is)|i\s+(?:need\s+to|should|will|must)\s+check|looking\s+at\s+the|based\s+on\s+the)\b/i;
              const isTruncated = /\b(?:de|del|la|el|los|las|con|en|y|o|para|por|a)\s*[*_]*$/i.test(aiReply);
              if (!isBad && !isTruncated && !cotRegex.test(aiReply) && !/\b(?:Debo responder|Voy a estructurar)\b/i.test(aiReply) && aiReply.length >= 10) {
                clearTimeout(timeoutId);
                return {
                  answer: aiReply,
                  level: 'level_3_catalog',
                  levelLabel: 'Nivel 3: Asesoría IA Resiliente',
                  confidence: 0.95,
                  provider: mId.includes('gpt-4o-mini') ? 'OpenRouter GPT-4o-mini (Titular)' : 'OpenRouter DeepSeek (Respaldo)'
                };
              }
            }
          }
        } catch {}
      }
      clearTimeout(timeoutId);
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

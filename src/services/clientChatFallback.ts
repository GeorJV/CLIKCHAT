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
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const productContext = selectedProduct
        ? `Producto enfocado actualmente: "${selectedProduct.title}", Precio: ${selectedProduct.price} ${selectedProduct.currency}. Descripción: ${selectedProduct.description || ''}. Beneficios: ${(selectedProduct.benefits || []).join(', ')}.`
        : (products.length > 0 ? `Catálogo disponible: ${products.slice(0, 4).map(p => `"${p.title}" ($${p.price} ${p.currency}): ${p.description || ''}`).join(' | ')}` : '');

      const systemPrompt = `Eres ${agentName}, el asesor comercial y de atención al cliente de "${storeName}" (Tipo: ${businessType}).
Tu tono es amable, profesional, empático y orientado a resolver la necesidad del cliente con certeza y valor comercial.
${productContext}
REGLA CRÍTICA DE ASESORÍA:
- Si el cliente expresa una necesidad o interés de compra (por ejemplo: "necesito una página web", "quiero comprar X", "ocupo un software"), NUNCA le preguntes qué producto busca, ya que él ya te lo indicó.
- Valida su requerimiento con entusiasmo, explícale la solución oficial basada en tu catálogo y hazle preguntas estratégicas para entender su proyecto.
- NUNCA pienses en voz alta ni redactes razonamientos internos ("El usuario quiere...", "Debo..."). Responde DIRECTAMENTE al cliente como en WhatsApp.
- Responde de manera concisa (máximo 2 párrafos breves), clara y cordial en español.`;

      for (const mId of ['deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct', 'mistralai/mistral-small-24b-instruct-2501']) {
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
                  provider: 'OpenRouter DeepSeek (Respaldo)'
                };
              }
            }
          }
        } catch {}
      }
      clearTimeout(timeoutId);
    }
  } catch {
    // Si la llamada externa también falla o hace timeout, continuar con respuesta determinista inteligente
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

  // 5. Coincidencia semántica con productos disponibles en memoria
  if (products && products.length > 0) {
    const matchedProduct = products.find(p => {
      const pFull = `${p.title || ''} ${p.description || ''} ${(p.benefits || []).join(' ')}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const queryWords = lowerMsg.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/).filter(w => w.length > 3);
      const hasWordMatch = queryWords.some(w => pFull.includes(w));
      const isWebMatch = /\b(web|pagina|sitio|portal|landing|tienda|saas|software)\b/i.test(lowerMsg) && /\b(web|plataforma|saas|sitio|portal|software)\b/i.test(pFull);
      const isAppMatch = /\b(app|aplicacion|movil|celular)\b/i.test(lowerMsg) && /\b(app|aplicacion|movil)\b/i.test(pFull);
      const isIaMatch = /\b(ia|bot|agente|asistente)\b/i.test(lowerMsg) && /\b(ia|bot|agente|asistente)\b/i.test(pFull);
      return hasWordMatch || isWebMatch || isAppMatch || isIaMatch;
    });

    if (matchedProduct) {
      const benefitsStr = (matchedProduct.benefits || []).slice(0, 3).map(b => `• ${b}`).join('\n');
      return {
        answer: `¡Excelente iniciativa! En **${storeName}** contamos con la solución perfecta: **${matchedProduct.title}** (Inversión estimada: $${matchedProduct.price} ${matchedProduct.currency}).\n\n${matchedProduct.description || ''}\n\n${benefitsStr ? `**Beneficios destacados:**\n${benefitsStr}\n\n` : ''}¿Tu negocio es de venta de productos físicos, servicios profesionales o buscas alguna funcionalidad en particular? ¡Cuéntame y con gusto te estructuro la mejor propuesta!`,
        level: 'level_3_catalog',
        levelLabel: 'Nivel 3: Asesoría Local Inteligente',
        confidence: 0.95,
        provider: 'Motor Conversacional de Catálogo'
      };
    }
  }

  // 6. Asesoría especializada para negocios de tecnología y servicios digitales (ej. GeoSoft)
  if (businessType === 'servicios' || storeName.toLowerCase().includes('geosoft') || /\b(web|p[aá]gina|sitio|portal|landing|tienda|saas|software|app|aplicaci[oó]n|bot|ia)\b/i.test(lowerMsg)) {
    return {
      answer: `¡Excelente iniciativa! En **${storeName}** nos especializamos en el diseño y desarrollo de páginas web modernas, rápidas y totalmente optimizadas para hacer crecer tu negocio (diseño responsive para móvil y PC, optimización SEO para Google, botón directo de WhatsApp y panel de administración).\n\nCuéntame: ¿qué tipo de negocio tienes y qué funcionalidades te gustaría incluir en tu página web para prepararte la mejor propuesta?`,
      level: 'level_3_catalog',
      levelLabel: 'Nivel 3: Asesoría de Desarrollo Web',
      confidence: 0.92,
      provider: 'Consultor de Proyectos Digitales'
    };
  }

  // 7. Asesoría para restaurantes y comida urbana
  if (businessType === 'restaurante' && /\b(ordenar|pedir|comer|hamburguesa|pizza|almorzar|cenar|combo|comida|hambre)\b/i.test(lowerMsg)) {
    return {
      answer: `¡Con el mayor de los gustos! En **${storeName}** tenemos opciones espectaculares listas para ti. ¿Se te antoja alguna hamburguesa, combo especial o deseas que te recomiende lo más pedido del día?`,
      level: 'level_3_catalog',
      levelLabel: 'Nivel 3: Asesoría Gastronómica',
      confidence: 0.92,
      provider: 'Mesera Virtual'
    };
  }

  // 8. Salida cordial orientada a la asesoría
  return {
    answer: `¡Con mucho gusto te atiendo en **${storeName}**! ¿En qué proyecto o requerimiento te puedo colaborar el día de hoy?`,
    level: 'level_1',
    levelLabel: 'Nivel 1: Asistencia General',
    confidence: 0.85,
    provider: 'Asesor Local'
  };
}
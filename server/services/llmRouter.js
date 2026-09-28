/**
 * Multi-LLM Router Service
 * Handles routing between OpenRouter (default), Tenant-specific custom keys,
 * and Google AI Studio (Gemini 2.0 for Playground and direct calls).
 */

require('dotenv').config();

const DEFAULT_OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;

// Generate completion via OpenRouter
async function callOpenRouter(messages, options = {}) {
  const apiKey = options.apiKey || DEFAULT_OPENROUTER_KEY;
  const model = options.model || 'openai/gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OpenRouter API Key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://clikchat.pages.dev',
      'X-Title': 'Clikchat Multi-Tenant Bot'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature || 0.4,
      max_tokens: options.max_tokens || 800
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Generate completion via Google AI Studio (Gemini)
async function callGoogleAIStudio(prompt, options = {}) {
  const apiKey = options.apiKey || DEFAULT_GOOGLE_AI_KEY;
  const model = options.model || 'gemini-2.0-flash';

  if (!apiKey) {
    throw new Error('Google AI Studio Key not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = Array.isArray(prompt)
    ? prompt.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    : [{ role: 'user', parts: [{ text: prompt }] }];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.max_tokens || 1000
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI Studio error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function sanitizeAiResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  let text = rawText.trim();

  // 1. Quitar etiquetas de pensamiento cerradas o truncadas (<think>, <thought>, <reasoning>, <co_thought>)
  text = text.replace(/<(?:think|thought|reasoning|co_thought)>[\s\S]*?(?:<\/(?:think|thought|reasoning|co_thought)>|$)/gi, '').trim();

  // 2. Erradicar fugas de evaluación de seguridad / guardrails
  const isSafetyLeak = (
    /user safety:\s*safe/i.test(text) ||
    /response safety:\s*safe/i.test(text) ||
    /safety:\s*safe/i.test(text) ||
    /^safety:\s*/i.test(text) ||
    text.toLowerCase() === 'safe'
  );
  if (isSafetyLeak) return null;

  // 3. Patrones de monólogo interno / razonamiento (Chain-of-Thought) en español e inglés
  const cotRegex = /^(?:el\s+usuario\s+(?:quiere|dice|pregunta|busca|est[aá]|solicita|necesita|menciona|acaba)|el\s+cliente\s+(?:quiere|dice|pregunta|busca|est[aá]|solicita|necesita)|seg[uú]n\s+(?:las\s+reglas|el\s+contexto|la\s+informaci[oó]n|mis\s+instrucciones)|debo\s+(?:recomendar|responder|saludar|seguir|tener|hacer|mostrar|actuar|estructurar|enfocar|cumplir|ofrecer|evitar)|necesito\s+(?:mostrar|verificar|responder|preguntar|analizar|ofrecer)|voy\s+a\s+(?:estructurar|responder|recomendar|saludar|preguntar|ofrecer|mencionar)|como\s+(?:mesera|asesor|bot|asistente)\s+virtual|mi\s+rol\s+es|analizando\s+la\s+consulta|pensando\s*:|the\s+user\s+(?:is\s+asking|says|wants|is|needs|mentioned)|i\s+(?:need\s+to|should|will|must|have\s+to)\s+(?:check|respond|answer|provide|recommend)|looking\s+at\s+the|based\s+on\s+the\s+(?:context|rules|prompt)|in\s+this\s+scenario|let\s+me\s+(?:check|see|think))\b/i;

  const paragraphs = text.split(/\n+/);
  const cleanParagraphs = [];

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    if (cotRegex.test(trimmed)) continue;
    if (/\b(?:Debo responder|Voy a estructurar|Debo tener en cuenta|Debo seguir el protocolo)\b/i.test(trimmed)) continue;
    cleanParagraphs.push(trimmed);
  }

  text = cleanParagraphs.join('\n\n').trim();

  // 4. Verificación de sanidad final
  if (!text || text.length < 5 || cotRegex.test(text)) {
    return null;
  }

  return text;
}

// Unified LLM Generator with Tenant Key routing and graceful fallback
async function generateCompletion({
  systemPrompt,
  userMessage,
  history = [],
  context = '',
  tenantCustomKey = null,
  model = null
}) {
  const antiCotDirective = '\n\n[BLINDAJE]: NUNCA pienses en voz alta ni expongas razonamientos internos ("El usuario quiere...", "Debo..."). Responde DIRECTAMENTE al cliente como en WhatsApp.';
  const messages = [
    { role: 'system', content: `${systemPrompt}${antiCotDirective}\n\n[CONTEXTO VERIFICADO DE LA TIENDA]:\n${context}` },
    ...history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.message
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    // 1. Modelo Principal: DeepSeek V3.2 (Directo, micro-costo, cero CoT)
    const apiKey = tenantCustomKey || DEFAULT_OPENROUTER_KEY;
    const activeModel = model || 'deepseek/deepseek-v3.2';
    const response = await callOpenRouter(messages, {
      apiKey,
      model: activeModel,
      temperature: 0.35,
      max_tokens: 650
    });
    const clean = sanitizeAiResponse(response);
    if (!clean) throw new Error('Respuesta corrupta (guardrail o CoT leak)');
    return { success: true, text: clean, provider: activeModel };
  } catch (err) {
    console.warn('⚠️ Fallo en modelo principal, ejecutando respaldo con DeepSeek Chat:', err.message);
    try {
      // 2. Modelo de Respaldo: DeepSeek V3
      const apiKey = DEFAULT_OPENROUTER_KEY;
      const response = await callOpenRouter(messages, {
        apiKey,
        model: 'deepseek/deepseek-chat',
        temperature: 0.35
      });
      const clean = sanitizeAiResponse(response);
      if (!clean) throw new Error('Respuesta corrupta de DeepSeek (guardrail o CoT leak)');
      return { success: true, text: clean, provider: 'deepseek/deepseek-chat' };
    } catch (dsErr) {
      console.warn('⚠️ Fallo en DeepSeek, ejecutando respaldo final con GPT-4o Mini:', dsErr.message);
      try {
        // 3. Respaldo Final: OpenAI GPT-4o Mini
        const apiKey = DEFAULT_OPENROUTER_KEY;
        const response = await callOpenRouter(messages, {
          apiKey,
          model: 'openai/gpt-4o-mini',
          temperature: 0.25
        });
        const clean = sanitizeAiResponse(response);
        if (!clean) throw new Error('Respuesta corrupta de GPT-4o Mini');
        return { success: true, text: clean, provider: 'openai/gpt-4o-mini' };
      } catch (gErr) {
        console.error('❌ Fallaron todos los modelos de la plataforma:', gErr.message);
        // 4. Fallback contextual si todo lo demás falla
        if (context && context.trim().length > 0) {
          return {
            success: true,
            text: `Con gusto te informo:\n\n${context.replace(/\[.*?\]/g, '').trim()}\n\n¿Deseas que te ayude a procesar tu pedido o tienes alguna otra pregunta?`,
            provider: 'context_template'
          };
        }
        throw gErr;
      }
    }
  }
}

module.exports = {
  callOpenRouter,
  callGoogleAIStudio,
  generateCompletion
};

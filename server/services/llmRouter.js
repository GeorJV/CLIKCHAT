/**
 * Multi-LLM Router Service
 * Handles routing between OpenRouter (default), Tenant-specific custom keys,
 * and Google AI Studio (Gemini 1.5/2.0 for Playground and direct calls).
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
  const model = options.model || 'gemini-1.5-flash';

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

// Unified LLM Generator with Tenant Key routing and graceful fallback
async function generateCompletion({
  systemPrompt,
  userMessage,
  history = [],
  context = '',
  tenantCustomKey = null,
  model = null
}) {
  const messages = [
    { role: 'system', content: `${systemPrompt}\n\n[CONTEXTO VERIFICADO DE LA TIENDA]:\n${context}` },
    ...history.slice(-6).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.message
    })),
    { role: 'user', content: userMessage }
  ];

  try {
    // 1. Try OpenRouter (tenant key or default)
    const apiKey = tenantCustomKey || DEFAULT_OPENROUTER_KEY;
    const response = await callOpenRouter(messages, {
      apiKey,
      model: model || 'openai/gpt-4o-mini',
      temperature: 0.3
    });
    return { success: true, text: response, provider: 'openrouter' };
  } catch (err) {
    console.warn('⚠️ Fallo en OpenRouter, intentando Google AI Studio fallback:', err.message);
    try {
      // 2. Fallback to Google AI Studio
      const promptText = `${systemPrompt}\n\nContexto:\n${context}\n\nPregunta: ${userMessage}`;
      const response = await callGoogleAIStudio(promptText);
      return { success: true, text: response, provider: 'google_ai_studio' };
    } catch (gErr) {
      console.error('❌ Fallaron ambos proveedores LLM:', gErr.message);
      // 3. Fallback to context-based template response so the user never gets an empty error
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

module.exports = {
  callOpenRouter,
  callGoogleAIStudio,
  generateCompletion
};

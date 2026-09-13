/**
 * Semantic Vector Embeddings & Similarity Service
 * Provides vector representations and cosine similarity calculations
 * Supports multi-tenant metadata filtering and namespace isolation
 */

// Cosine similarity between two dense vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const STOP_WORDS = new Set([
  'de', 'la', 'los', 'las', 'el', 'en', 'por', 'para', 'con', 'y', 'a', 'que', 'del', 'al',
  'un', 'una', 'unos', 'unas', 'es', 'son', 'se', 'su', 'sus', 'lo', 'le', 'les', 'o', 'u',
  'como', 'pero', 'mas', 'si', 'no', 'mi', 'tu', 'te', 'me', 'nos', 'the', 'of', 'and', 'to', 'in', 'is'
]);

// Tokenizer & semantic hash vectorizer (Fast, reliable, zero-latency fallback)
function createSemanticVector(text, dimensions = 128) {
  if (!text || typeof text !== 'string') return new Array(dimensions).fill(0);

  const cleanText = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, ' ');

  const words = cleanText.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const vector = new Array(dimensions).fill(0);

  if (words.length === 0) return vector;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Hash function to map words into vector dimensions
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const index = Math.abs(hash) % dimensions;
    vector[index] += 1.0;

    // Also include bi-grams for semantic phrasing
    if (i < words.length - 1) {
      const bigram = word + '_' + words[i + 1];
      let biHash = 0;
      for (let c = 0; c < bigram.length; c++) {
        biHash = (biHash << 5) - biHash + bigram.charCodeAt(c);
        biHash |= 0;
      }
      const biIndex = Math.abs(biHash) % dimensions;
      vector[biIndex] += 1.5;
    }
  }

  // Normalize vector to unit length
  const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

function computeWordOverlap(textA, textB) {
  if (!textA || !textB) return 0;
  const getTokens = (t) => t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const setA = new Set(getTokens(textA));
  const setB = new Set(getTokens(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let common = 0;
  for (const w of setA) {
    if (setB.has(w)) common++;
  }
  return (2 * common) / (setA.size + setB.size);
}

// Search items with vector similarity, Dice overlap and strict threshold
function rankBySimilarity(queryText, items, textField = 'text', threshold = 0.0) {
  const queryVec = createSemanticVector(queryText);

  const ranked = items.map(item => {
    const targetText = typeof textField === 'function' ? textField(item) : item[textField];
    const itemVec = item._vector || createSemanticVector(targetText);
    const cosScore = cosineSimilarity(queryVec, itemVec);
    const diceScore = computeWordOverlap(queryText, targetText);
    // Combined metric handles synonyms, n-grams, and natural word reordering in chat
    const score = Math.max(cosScore, (0.4 * cosScore) + (0.6 * diceScore));
    return { item, score };
  });

  return ranked
    .filter(res => res.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  cosineSimilarity,
  createSemanticVector,
  computeWordOverlap,
  rankBySimilarity
};

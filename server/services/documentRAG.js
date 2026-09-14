/**
 * RAG Vectorial No Estructurado: Ingesta, chunking y recuperación de documentos/manuales
 */
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { rankBySimilarity } = require('./embeddings');

// Simple chunker: divide text into overlapping paragraphs
function chunkText(text, maxChars = 800, overlap = 150) {
  if (!text) return [];
  const clean = text.trim();
  const chunks = [];
  let start = 0;

  while (start < clean.length) {
    let end = start + maxChars;
    if (end < clean.length) {
      // Find nearest punctuation or newline
      const lastPunct = clean.lastIndexOf('.', end);
      const lastBreak = clean.lastIndexOf('\n', end);
      const cutPoint = Math.max(lastPunct, lastBreak);
      if (cutPoint > start + 200) {
        end = cutPoint + 1;
      }
    }
    const chunk = clean.slice(start, end).trim();
    if (chunk.length > 30) {
      chunks.push(chunk);
    }
    start = end - overlap;
    if (start >= clean.length - 50) break;
  }
  return chunks.length > 0 ? chunks : [clean];
}

// Ingest document and its chunks into Cloudflare D1
async function ingestDocument(tenantId, title, content, category = 'manuales', fileType = 'text') {
  const docId = uuidv4();
  await query(
    `INSERT INTO knowledge_documents (id, tenant_id, title, category, file_type, raw_content)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [docId, tenantId, title, category, fileType, content]
  );

  const chunks = chunkText(content);
  for (let i = 0; i < chunks.length; i++) {
    const chunkId = uuidv4();
    const chunkTextContent = chunks[i];
    
    // Extract keywords for dense hybrid matching
    const stopWords = new Set(['que', 'como', 'cuando', 'donde', 'por', 'para', 'con', 'los', 'las', 'una', 'uno', 'del', 'los', 'cual']);
    const keywords = chunkTextContent.toLowerCase().replace(/[^a-záéíóúñ0-9\s]/gi, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w)).slice(0, 15);

    await query(
      `INSERT INTO document_chunks (id, document_id, tenant_id, chunk_index, content, keywords)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [chunkId, docId, tenantId, i, chunkTextContent, JSON.stringify(keywords)]
    );
  }

  return { id: docId, tenantId, title, category, chunksCount: chunks.length };
}

// Search relevant chunks across tenant's documents
async function searchDocumentChunks(tenantId, queryText, limit = 2) {
  try {
    const chunksRes = await query(
      `SELECT dc.id, dc.content, dc.keywords, kd.title as doc_title
       FROM document_chunks dc
       JOIN knowledge_documents kd ON dc.document_id = kd.id
       WHERE dc.tenant_id = $1`,
      [tenantId]
    );

    const chunks = chunksRes.rows;
    if (chunks.length === 0) return [];

    const matches = rankBySimilarity(
      queryText,
      chunks,
      (c) => `${c.doc_title} ${c.content} ${(c.keywords || []).join(' ')}`,
      0.30
    );

    return matches.slice(0, limit).map(m => ({
      content: m.item.content,
      docTitle: m.item.doc_title,
      score: m.score
    }));
  } catch (err) {
    console.warn('?? Error buscando document chunks en D1:', err.message);
    return [];
  }
}

module.exports = {
  ingestDocument,
  searchDocumentChunks,
  chunkText
};

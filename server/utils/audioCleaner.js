/**
 * Audio Transcription Cleaning & Anti-Looping Filter
 * Eliminates Whisper repetition hallucinations, music tags, and subtitle artifacts
 */

function cleanWhisperLooping(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText.trim();

  // 1. Remove common Whisper hallucination tokens (subtitles, music tags, video sign-offs)
  const hallucinationPatterns = [
    /\[.*?\]/g,
    /\(.*?\)/g,
    /subt[ií]tulos\s+realizados\s+por\s+.*?(?:\.|$)/gi,
    /subt[ií]tulos\s+por\s+.*?(?:\.|$)/gi,
    /gracias\s+por\s+(?:ver|escuchar|sintonizar).*?(?:\.|$)/gi,
    /thanks\s+for\s+watching.*?(?:\.|$)/gi,
    /suscr[ií]bete.*?(?:\.|$)/gi,
    /like\s+y\s+suscr[ií]bete.*?(?:\.|$)/gi
  ];
  for (const pattern of hallucinationPatterns) {
    text = text.replace(pattern, ' ');
  }

  // 2. Deduplicate single-word loops: "palabra palabra palabra" -> "palabra"
  text = text.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');

  // 3. Deduplicate multi-word phrase loops: "cuanto cuesta cuanto cuesta" -> "cuanto cuesta"
  text = text.replace(/\b((?:\w+\s+){1,4}\w+)(?:\s+\1\b)+/gi, '$1');

  // 4. Normalize spaces and punctuation
  text = text.replace(/\s+/g, ' ').replace(/[.]{2,}/g, '.').trim();

  return text;
}

module.exports = { cleanWhisperLooping };

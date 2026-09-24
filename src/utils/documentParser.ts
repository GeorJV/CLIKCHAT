/**
 * Universal Client-Side Document Parser
 * Parses .txt, .md, .csv, .docx, .xlsx, .xls directly in browser for RAG knowledge
 */

declare global {
  interface Window {
    XLSX?: any;
    mammoth?: any;
  }
}

function loadExternalScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar la librería desde ${src}`));
    document.head.appendChild(script);
  });
}

export async function parseDocumentFile(file: File): Promise<{ title: string; content: string; fileType: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

  // 1. Archivos de Texto Plano (.txt, .md, .csv)
  if (['txt', 'md', 'csv'].includes(ext)) {
    const text = await file.text();
    return { title: cleanTitle, content: text.trim(), fileType: ext };
  }

  // 2. Archivos Word (.docx, .doc)
  if (['docx', 'doc'].includes(ext)) {
    try {
      await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
      const arrayBuffer = await file.arrayBuffer();
      if (window.mammoth) {
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        if (result?.value && result.value.trim().length > 0) {
          return { title: cleanTitle, content: result.value.trim(), fileType: ext };
        }
      }
    } catch (e) {
      console.warn('Fallo cargando mammoth, intentando extracción binaria:', e);
    }

    // Fallback binario para texto en docs
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
    const matches = text.match(/[\w\sÁÉÍÓÚáéíóúñÑ.,;:!¿?()\-]{4,}/g) || [];
    return { title: cleanTitle, content: matches.join(' ').slice(0, 10000).trim(), fileType: ext };
  }

  // 3. Archivos Excel (.xlsx, .xls)
  if (['xlsx', 'xls'].includes(ext)) {
    await loadExternalScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    if (!window.XLSX) throw new Error('No se pudo inicializar el lector de Excel');
    const data = await file.arrayBuffer();
    const workbook = window.XLSX.read(data, { type: 'array' });
    let combined = '';

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      if (!rows || rows.length === 0) continue;

      combined += `--- HOJA: ${sheetName} ---\n`;
      const headers = rows[0] || [];

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length === 0) continue;
        const line = row.map((val, idx) => {
          const h = headers[idx] ? `${headers[idx]}: ` : '';
          return `${h}${val}`;
        }).filter(Boolean).join(' | ');
        if (line.trim().length > 0) combined += line + '\n';
      }
      combined += '\n';
    }

    return { title: cleanTitle, content: combined.trim(), fileType: ext };
  }

  throw new Error(`Formato de archivo .${ext} no soportado. Usa .txt, .docx, .xlsx o .csv`);
}

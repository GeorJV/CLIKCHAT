/**
 * Client-Side Document Extractor
 * Reads .txt, .docx, and .pdf files directly in the browser with ZERO token cost.
 */

declare global {
  interface Window {
    mammoth?: any;
    pdfjsLib?: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar el módulo desde ${src}`));
    document.head.appendChild(script);
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Plain text / Markdown / JSON / CSV
  if (['txt', 'md', 'json', 'csv', 'log'].includes(extension)) {
    return await file.text();
  }

  // 2. Microsoft Word (.docx)
  if (extension === 'docx') {
    if (!window.mammoth) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    }
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value ? result.value.trim() : '';
  }

  // 3. Adobe PDF (.pdf)
  if (extension === 'pdf') {
    if (!window.pdfjsLib) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .filter(Boolean);
      fullText += pageStrings.join(' ') + '\n\n';
    }
    return fullText.trim();
  }

  throw new Error(`Formato .${extension} no soportado. Usa archivos .txt, .docx o .pdf`);
}

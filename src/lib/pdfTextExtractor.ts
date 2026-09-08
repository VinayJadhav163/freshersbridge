'use client';

/**
 * Client-side file text extractor for PDF, TXT, and Markdown files.
 * Completely local-first: executes 100% in the user's browser with 0 server uploads.
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Plain Text / Markdown files
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || file.type === 'text/plain') {
    return await file.text();
  }

  // 2. PDF Files via pdfjs-dist
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    return await extractTextFromPdf(file);
  }

  // 3. Fallback for other text formats
  try {
    const text = await file.text();
    if (text && text.trim().length > 20) {
      return text;
    }
  } catch {
    // continue to error
  }

  throw new Error('Unsupported file format. Please upload a PDF or TXT resume, or paste the text directly.');
}

async function extractTextFromPdf(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction runs exclusively in browser.');
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    // Dynamic import to isolate browser-only module from Next.js server compilation
    const pdfjsLib = await import('pdfjs-dist');

    // Configure worker via secure reliable CDN
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    if (!cleanedText) {
      throw new Error('No readable text found in PDF. It may be a scanned image-only PDF.');
    }

    return fullText;
  } catch (err: any) {
    console.error('Error parsing PDF:', err);
    throw new Error(
      err?.message || 'Failed to extract text from PDF. If it is a scanned document, please paste your resume text directly.'
    );
  }
}

import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js
if (typeof window !== 'undefined') {
  // Get the version from pdfjs
  const version = pdfjs.version;
  console.log(`PDF.js version: ${version}`);

  // Use local worker file to avoid CORS issues
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
}

/**
 * Extract text content from a PDF file
 * @param url URL or path to the PDF file
 * @returns Promise resolving to the extracted text
 */
export async function extractTextFromPDF(url: string): Promise<string> {
  try {
    console.log('Starting PDF extraction from:', url);

    // Try a different approach - use fetch to get the PDF data as ArrayBuffer
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    const pdfData = await response.arrayBuffer();
    console.log('PDF data fetched successfully, size:', pdfData.byteLength, 'bytes');

    // Load the PDF with the data
    const loadingTask = pdfjs.getDocument({
      data: pdfData,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
      cMapPacked: true,
      disableAutoFetch: false,
      disableStream: false,
      disableRange: false
    });

    console.log('PDF loading task created');

    // Add a longer timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timed out after 20 seconds')), 20000);
    });

    // Race the loading task against the timeout
    const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);

    // Get the total number of pages
    const numPages = pdf.numPages;
    console.log(`PDF loaded with ${numPages} pages`);

    // Extract text from each page
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      console.log(`Processing page ${i} of ${numPages}`);
      const page = await pdf.getPage(i);

      // Try using getTextContent first
      try {
        const textContent = await page.getTextContent();

        // Concatenate the text items
        const pageText = textContent.items
          .map((item: Record<string, unknown>) => 'str' in item ? item.str as string : '')
          .join(' ');

        fullText += pageText + '\n\n';
      } catch (pageError) {
        console.warn(`Error extracting text from page ${i} using getTextContent:`, pageError);

        // Fallback to rendering the page and using OCR-like approach
        try {
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            throw new Error('Could not get canvas context');
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // We can't do actual OCR here, but we can note that we tried the fallback
          fullText += `[Page ${i} - Text extraction fallback used]\n\n`;
        } catch (renderError) {
          console.error(`Fallback rendering failed for page ${i}:`, renderError);
          fullText += `[Page ${i} - Text extraction failed]\n\n`;
        }
      }
    }

    console.log('PDF text extraction completed successfully');
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);

    // Return a more user-friendly error message
    if (error instanceof Error) {
      throw new Error(`Could not extract PDF text: ${error.message}`);
    } else {
      throw new Error('Could not extract PDF text: Unknown error');
    }
  }
}

/**
 * Generate a markdown summary of the PDF content
 * @param text Extracted text from the PDF
 * @returns Markdown formatted summary
 */
export function generateMarkdownSummary(text: string): string {
  // Basic markdown formatting
  const lines = text.split('\n').filter(line => line.trim() !== '');

  let markdown = '# PDF Content Summary\n\n';

  // Try to identify sections based on common patterns
  let currentSection = '';

  for (const line of lines) {
    // Check if this looks like a heading (all caps, short line, etc.)
    if (line.toUpperCase() === line && line.length < 50 && line.trim().length > 0) {
      currentSection = line.trim();
      markdown += `\n## ${currentSection}\n\n`;
    } else if (line.trim().length > 0) {
      // Regular content
      markdown += `${line.trim()}\n\n`;
    }
  }

  return markdown;
}

/**
 * Save content to a markdown file
 * @param content Content to save
 * @param filename Filename to save to
 */
export async function saveToMarkdown(content: string, filename: string): Promise<void> {
  // This function will be implemented differently based on environment
  // For client-side, we'll use a download approach
  // For server-side, we'll use the filesystem

  if (typeof window !== 'undefined') {
    // Client-side: Create a downloadable file
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    return Promise.resolve();
  } else {
    // This would be server-side code, but we're using client components
    // If needed, we could implement this using an API route
    throw new Error('Server-side saving not implemented in this function');
  }
}

'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DanteLogger } from './DanteLogger';

/**
 * Generates a PDF from HTML content using the Salinger design principles
 *
 * This utility converts HTML content to a PDF document while maintaining
 * the visual aesthetics of the Salinger design theory.
 */

interface PdfGenerationOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerText?: string;
  footerText?: string;
  fileName?: string;
}

const defaultOptions: PdfGenerationOptions = {
  title: 'Generated PDF',
  author: 'P. Brady Georgen',
  subject: 'Resume Summary',
  keywords: 'resume, summary, pdf',
  pageSize: 'a4',
  orientation: 'portrait',
  margins: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
  },
  headerText: 'P. Brady Georgen',
  footerText: 'Generated with Salinger Design',
  fileName: 'summary.pdf'
};

/**
 * Generate a PDF from an HTML element
 *
 * @param element The HTML element to convert to PDF
 * @param options PDF generation options
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  options: PdfGenerationOptions = {}
): Promise<void> {
  try {
    DanteLogger.success.basic('Starting PDF generation from HTML element');

    // Merge options with defaults
    const mergedOptions = { ...defaultOptions, ...options };

    // Create a clone of the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Create a container with all styles inlined
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '15mm';
    container.style.backgroundColor = '#F5F1E0'; // Parchment background color
    container.style.color = '#3A4535'; // Dark forest text color
    container.style.fontFamily = 'Garamond, Times New Roman, serif';
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.5';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';

    // Add Salinger-inspired styling
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Courier New', monospace;
        color: #49423D;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      h1 { font-size: 24pt; }
      h2 { font-size: 20pt; border-bottom: 1px solid #D5CDB5; padding-bottom: 0.2em; }
      h3 { font-size: 16pt; }
      h4 { font-size: 14pt; }
      p { margin-bottom: 1em; text-align: justify; }
      ul, ol { margin-bottom: 1em; padding-left: 2em; }
      li { margin-bottom: 0.5em; }
      a { color: #7E4E2D; text-decoration: none; }
      blockquote {
        border-left: 4px solid #D5CDB5;
        padding-left: 1em;
        margin-left: 0;
        color: #5F6B54;
      }
      code {
        font-family: 'Courier New', monospace;
        background-color: rgba(213, 205, 181, 0.3);
        padding: 0.2em 0.4em;
        border-radius: 3px;
      }
      pre {
        background-color: rgba(213, 205, 181, 0.3);
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 1em;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1em;
      }
      th, td {
        border: 1px solid #D5CDB5;
        padding: 0.5em;
        text-align: left;
      }
      th {
        background-color: rgba(213, 205, 181, 0.3);
        font-weight: bold;
      }
      hr {
        border: none;
        border-top: 1px solid #D5CDB5;
        margin: 2em 0;
      }
      .markdownPreview {
        background-color: #222222;
        border-radius: 4px;
        padding: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: 'Garamond', 'Times New Roman', serif;
        line-height: 1.6;
        color: #F5F3E7;
      }
    `;
    container.appendChild(styleElement);

    // Add header with Salinger styling
    if (mergedOptions.headerText) {
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '2em';
      header.style.fontFamily = "'Courier New', monospace";
      header.style.color = '#49423D';

      const headerTitle = document.createElement('h1');
      headerTitle.style.marginTop = '0';
      headerTitle.textContent = mergedOptions.headerText;

      header.appendChild(headerTitle);
      container.appendChild(header);
    }

    // Add the content
    container.appendChild(clonedElement);

    // Add the container to the document
    document.body.appendChild(container);

    // Create a canvas from the container
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading of cross-origin images
      logging: false, // Disable logging
      backgroundColor: '#F5F1E0', // Parchment background color
      ignoreElements: (element) => {
        // Ignore any external resources that might cause issues
        if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
          return true;
        }
        return false;
      }
    });

    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm (portrait)
    const pageHeight = 297; // A4 height in mm (portrait)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Create PDF with proper orientation
    const pdf = new jsPDF(
      mergedOptions.orientation || 'portrait',
      'mm',
      mergedOptions.pageSize || 'a4'
    );

    // Set document properties
    pdf.setProperties({
      title: mergedOptions.title || 'Generated PDF',
      author: mergedOptions.author || 'P. Brady Georgen',
      subject: mergedOptions.subject || 'Resume Summary',
      keywords: mergedOptions.keywords || 'resume, summary, pdf'
    });

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(mergedOptions.fileName || 'summary.pdf');

    // Clean up - remove the container from the document
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }

    DanteLogger.success.ux(`PDF generated and downloaded as ${mergedOptions.fileName || 'summary.pdf'}`);
    return Promise.resolve();
  } catch (error) {
    DanteLogger.error.runtime(`Error generating PDF: ${error}`);
    return Promise.reject(error);
  }
}

/**
 * Generate a PDF from markdown content
 *
 * @param markdownContent The markdown content to convert to PDF
 * @param options PDF generation options
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export async function generatePdfFromMarkdown(
  markdownContent: string,
  options: PdfGenerationOptions = {}
): Promise<void> {
  try {
    DanteLogger.success.basic('Starting PDF generation from markdown content');

    // Create a temporary container for the markdown content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'markdownPreview';

    // Create a content element with the parsed markdown
    const contentElement = document.createElement('div');

    // Parse the markdown content
    // We'll use a simple markdown parser here
    const formattedContent = markdownContent
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/\`\`\`([\s\S]*?)\`\`\`/gm, '<pre><code>$1</code></pre>')
      .replace(/\`(.*?)\`/gm, '<code>$1</code>')
      .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" style="max-width: 100%;" />')
      .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
      .replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>\n</ul>')
      .replace(/^\s*\n[0-9]+\. (.*)/gm, '<ol>\n<li>$1</li>\n</ol>')
      .replace(/<\/ul>\s*\n<ul>/g, '')
      .replace(/<\/ol>\s*\n<ol>/g, '')
      .replace(/^\s*\n/gm, '<br />')
      .split('\n\n').map(p => !p.includes('<h') && !p.includes('<ul') && !p.includes('<ol') && !p.includes('<blockquote') ? `<p>${p}</p>` : p).join('\n');

    // Set the content
    contentElement.innerHTML = formattedContent;

    // Add the content to the container
    contentContainer.appendChild(contentElement);

    // Generate PDF from the content container
    await generatePdfFromElement(contentContainer, options);

    return Promise.resolve();
  } catch (error) {
    DanteLogger.error.runtime(`Error generating PDF from markdown: ${error}`);
    return Promise.reject(error);
  }
}

export default {
  generatePdfFromElement,
  generatePdfFromMarkdown
};

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
 * Content block for PDF generation
 */
interface ContentBlock {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'listItem';
  content: string;
}

/**
 * Parse markdown content into structured blocks for PDF generation
 *
 * @param markdownContent The markdown content to parse
 * @returns Array of content blocks
 */
function parseMarkdownForPdf(markdownContent: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Split content into lines
  const lines = markdownContent.split('\n');

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Check for headings
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading1',
        content: line.substring(2).trim()
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading2',
        content: line.substring(3).trim()
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading3',
        content: line.substring(4).trim()
      });
    }
    // Check for list items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        type: 'listItem',
        content: line.substring(2).trim()
      });
    }
    // Check for numbered list items
    else if (/^\d+\.\s/.test(line)) {
      blocks.push({
        type: 'listItem',
        content: line.replace(/^\d+\.\s/, '').trim()
      });
    }
    // Everything else is a paragraph
    else {
      // Check if this is a continuation of a previous paragraph
      const prevBlock = blocks[blocks.length - 1];
      if (prevBlock && prevBlock.type === 'paragraph' && !lines[i-1].trim().endsWith('  ')) {
        // Append to previous paragraph if the previous line doesn't end with two spaces
        prevBlock.content += ' ' + line;
      } else {
        blocks.push({
          type: 'paragraph',
          content: line
        });
      }
    }
  }

  return blocks;
}

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

    // Determine if this is from the Summary modal (dark theme) or regular content
    const isDarkTheme = options.fileName?.includes('summary') || false;

    // Create a PDF document directly with proper dimensions for US Letter (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter' // 8.5 x 11 inches
    });

    // Set document properties
    pdf.setProperties({
      title: options.title || 'Generated PDF',
      author: options.author || 'P. Brady Georgen',
      subject: options.subject || 'Resume Summary',
      keywords: options.keywords || 'resume, summary, pdf'
    });

    // Set dark background for full bleed if using dark theme
    if (isDarkTheme) {
      // Add a full-page background rectangle
      pdf.setFillColor(34, 34, 34); // #222222 dark background
      pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
    }

    // Add header with Salinger styling
    if (options.headerText) {
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231); // #F5F3E7 light text for dark theme
      } else {
        pdf.setTextColor(73, 66, 61); // #49423D Ebony
      }

      pdf.setFont('courier', 'bold');
      pdf.setFontSize(24);
      pdf.text(options.headerText, 4.25, 1, { align: 'center' });

      // Add a separator line
      if (isDarkTheme) {
        pdf.setDrawColor(255, 255, 255, 0.3); // Light line for dark theme
      } else {
        pdf.setDrawColor(213, 205, 181, 0.8); // #D5CDB5 with opacity
      }
      pdf.setLineWidth(0.01);
      pdf.line(1, 1.2, 7.5, 1.2);
    }

    // Parse the markdown content
    const parsedContent = parseMarkdownForPdf(markdownContent);

    // Set text color based on theme
    if (isDarkTheme) {
      pdf.setTextColor(245, 243, 231); // #F5F3E7 light text for dark theme
    } else {
      pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
    }

    // Set default font
    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);

    // Add content with proper styling
    let yPosition = options.headerText ? 1.5 : 0.5;
    const margin = 1; // 1 inch margins
    const pageWidth = 8.5 - (margin * 2);

    // Process each content block
    parsedContent.forEach(block => {
      // Check if we need to add a new page
      if (yPosition > 10) { // Close to bottom of page (11 inches - some margin)
        pdf.addPage();
        yPosition = 0.5;

        // Add dark background to new page if using dark theme
        if (isDarkTheme) {
          pdf.setFillColor(34, 34, 34); // #222222 dark background
          pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        }
      }

      // Handle different block types
      switch (block.type) {
        case 'heading1':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(18);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.4;
          break;

        case 'heading2':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(16);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.3;

          // Add a subtle line under h2
          if (isDarkTheme) {
            pdf.setDrawColor(255, 255, 255, 0.2); // Light line for dark theme
          } else {
            pdf.setDrawColor(213, 205, 181); // #D5CDB5
          }
          pdf.setLineWidth(0.01);
          pdf.line(margin, yPosition - 0.1, 7.5, yPosition - 0.1);
          break;

        case 'heading3':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(14);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.3;
          break;

        case 'paragraph':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
          }
          pdf.setFont('times', 'normal');
          pdf.setFontSize(12);

          // Split long paragraphs into multiple lines
          const lines = pdf.splitTextToSize(block.content, pageWidth);
          pdf.text(lines, margin, yPosition);
          yPosition += (lines.length * 0.2) + 0.1;
          break;

        case 'listItem':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
          }
          pdf.setFont('times', 'normal');
          pdf.setFontSize(12);

          // Add bullet point
          pdf.text('•', margin, yPosition);

          // Split long list items into multiple lines with proper indentation
          const listItemLines = pdf.splitTextToSize(block.content, pageWidth - 0.3);
          pdf.text(listItemLines, margin + 0.3, yPosition);
          yPosition += (listItemLines.length * 0.2) + 0.1;
          break;
      }
    });

    // Add footer if provided
    if (options.footerText) {
      // Add a separator line
      if (isDarkTheme) {
        pdf.setDrawColor(255, 255, 255, 0.3); // Light line for dark theme
      } else {
        pdf.setDrawColor(213, 205, 181, 0.8); // #D5CDB5 with opacity
      }
      pdf.setLineWidth(0.01);
      pdf.line(1, 10, 7.5, 10);

      // Add footer text
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.7); // #F5F3E7 light text with opacity
      } else {
        pdf.setTextColor(73, 66, 61, 0.7); // #49423D Ebony with opacity
      }
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(10);
      pdf.text(options.footerText, 4.25, 10.5, { align: 'center' });
    }

    // Save the PDF
    pdf.save(options.fileName || 'summary.pdf');

    DanteLogger.success.ux(`PDF generated and downloaded as ${options.fileName || 'summary.pdf'}`);
    return Promise.resolve();
  } catch (error) {
    DanteLogger.error.runtime(`Error generating PDF from markdown: ${error}`);
    return Promise.reject(error);
  }
}

/**
 * Generate a PDF from markdown content and return it as a data URL
 *
 * @param markdownContent The markdown content to convert to PDF
 * @param options PDF generation options
 * @returns Promise that resolves with the PDF data URL
 */
export async function generatePdfDataUrlFromMarkdown(
  markdownContent: string,
  options: PdfGenerationOptions = {}
): Promise<string> {
  try {
    DanteLogger.success.basic('Generating PDF data URL from markdown content');

    // Determine if this is from the Summary modal (dark theme) or regular content
    const isDarkTheme = options.fileName?.includes('cover_letter') || options.fileName?.includes('summary') || false;

    // Create a PDF document directly with proper dimensions for US Letter (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter' // 8.5 x 11 inches
    });

    // Set document properties
    pdf.setProperties({
      title: options.title || 'Generated PDF',
      author: options.author || 'P. Brady Georgen',
      subject: options.subject || 'Resume Summary',
      keywords: options.keywords || 'resume, summary, pdf'
    });

    // Set dark background for full bleed if using dark theme
    if (isDarkTheme) {
      // Add a full-page background rectangle
      pdf.setFillColor(34, 34, 34); // #222222 dark background
      pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
    }

    // Add header with Salinger styling
    if (options.headerText) {
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231); // #F5F3E7 light text for dark theme
      } else {
        pdf.setTextColor(73, 66, 61); // #49423D Ebony
      }

      pdf.setFont('courier', 'bold');
      pdf.setFontSize(24);
      pdf.text(options.headerText, 4.25, 1, { align: 'center' });

      // Add a separator line
      if (isDarkTheme) {
        pdf.setDrawColor(255, 255, 255, 0.3); // Light line for dark theme
      } else {
        pdf.setDrawColor(213, 205, 181, 0.8); // #D5CDB5 with opacity
      }
      pdf.setLineWidth(0.01);
      pdf.line(1, 1.2, 7.5, 1.2);
    }

    // Parse the markdown content
    const parsedContent = parseMarkdownForPdf(markdownContent);

    // Set text color based on theme
    if (isDarkTheme) {
      pdf.setTextColor(245, 243, 231); // #F5F3E7 light text for dark theme
    } else {
      pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
    }

    // Set default font
    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);

    // Add content with proper styling
    let yPosition = options.headerText ? 1.5 : 0.5;
    const margin = 1; // 1 inch margins
    const pageWidth = 8.5 - (margin * 2);

    // Process each content block
    parsedContent.forEach(block => {
      // Check if we need to add a new page
      if (yPosition > 10) { // Close to bottom of page (11 inches - some margin)
        pdf.addPage();
        yPosition = 0.5;

        // Add dark background to new page if using dark theme
        if (isDarkTheme) {
          pdf.setFillColor(34, 34, 34); // #222222 dark background
          pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        }
      }

      // Handle different block types
      switch (block.type) {
        case 'heading1':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(18);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.4;
          break;

        case 'heading2':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(16);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.3;

          // Add a subtle line under h2
          if (isDarkTheme) {
            pdf.setDrawColor(255, 255, 255, 0.2); // Light line for dark theme
          } else {
            pdf.setDrawColor(213, 205, 181); // #D5CDB5
          }
          pdf.setLineWidth(0.01);
          pdf.line(margin, yPosition - 0.1, 7.5, yPosition - 0.1);
          break;

        case 'heading3':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(73, 66, 61); // #49423D Ebony
          }
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(14);
          pdf.text(block.content, margin, yPosition);
          yPosition += 0.3;
          break;

        case 'paragraph':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
          }
          pdf.setFont('times', 'normal');
          pdf.setFontSize(12);

          // Split long paragraphs into multiple lines
          const lines = pdf.splitTextToSize(block.content, pageWidth);
          pdf.text(lines, margin, yPosition);
          yPosition += (lines.length * 0.2) + 0.1;
          break;

        case 'listItem':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            pdf.setTextColor(58, 69, 53); // #3A4535 Dark forest
          }
          pdf.setFont('times', 'normal');
          pdf.setFontSize(12);

          // Add bullet point
          pdf.text('•', margin, yPosition);

          // Split long list items into multiple lines with proper indentation
          const listItemLines = pdf.splitTextToSize(block.content, pageWidth - 0.3);
          pdf.text(listItemLines, margin + 0.3, yPosition);
          yPosition += (listItemLines.length * 0.2) + 0.1;
          break;
      }
    });

    // Add footer if provided
    if (options.footerText) {
      // Add a separator line
      if (isDarkTheme) {
        pdf.setDrawColor(255, 255, 255, 0.3); // Light line for dark theme
      } else {
        pdf.setDrawColor(213, 205, 181, 0.8); // #D5CDB5 with opacity
      }
      pdf.setLineWidth(0.01);
      pdf.line(1, 10, 7.5, 10);

      // Add footer text
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.7); // #F5F3E7 light text with opacity
      } else {
        pdf.setTextColor(73, 66, 61, 0.7); // #49423D Ebony with opacity
      }
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(10);
      pdf.text(options.footerText, 4.25, 10.5, { align: 'center' });
    }

    // Return the PDF as a data URL
    const dataUrl = pdf.output('datauristring');
    DanteLogger.success.ux('Generated PDF data URL');
    return dataUrl;
  } catch (error) {
    DanteLogger.error.runtime(`Error generating PDF data URL: ${error}`);
    return Promise.reject(error);
  }
}

export default {
  generatePdfFromElement,
  generatePdfFromMarkdown,
  generatePdfDataUrlFromMarkdown
};

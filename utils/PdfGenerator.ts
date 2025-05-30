'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DanteLogger } from './DanteLogger';

// Helper function to convert hex color to RGB
function getBgColorRGB(hexColor: string) {
  // Default to dark gray if no color provided
  const hex = hexColor?.replace('#', '') || '333333';

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

// Helper function to get text color in RGB
function getTextColorRGB(hexColor: string) {
  // Default to black if no color provided
  const hex = hexColor?.replace('#', '') || '000000';

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

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
  isDarkTheme?: boolean; // Added for explicit theme control
  isIntroduction?: boolean; // Added to explicitly mark Introduction PDFs
}

const defaultOptions: PdfGenerationOptions = {
  title: 'Generated PDF',
  author: 'User',
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
  headerText: 'User',
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
 * @param skipFirstHeading Whether to skip the first heading (to avoid duplication with the PDF header)
 * @returns Array of content blocks
 */
function parseMarkdownForPdf(markdownContent: string, skipFirstHeading: boolean = false): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Split content into lines
  const lines = markdownContent.split('\n');

  // Track if we've skipped the first heading
  let hasSkippedFirstHeading = !skipFirstHeading;

  // Helper function to clean markdown formatting
  const cleanMarkdownFormatting = (text: string): string => {
    // Process the text in multiple passes to handle nested formatting
    let cleanedText = text;

    // Log the original text for debugging
    console.log('Original text before cleaning:', text);

    try {
      // First pass: Handle links and images
      cleanedText = cleanedText
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Replace links with just the text
        .replace(/!\[(.*?)\]\(.*?\)/g, '$1'); // Replace images with alt text

      // Second pass: Handle bold and italic formatting with improved regex
      // Handle bold+italic first to avoid nested formatting issues
      cleanedText = cleanedText
        .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Handle bold+italic with asterisks
        .replace(/___([^_]+)___/g, '$1') // Handle bold+italic with underscores
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Handle bold with asterisks
        .replace(/__([^_]+)__/g, '$1') // Handle bold with underscores
        .replace(/\*([^*]+)\*/g, '$1') // Handle italic with asterisks
        .replace(/_([^_]+)_/g, '$1'); // Handle italic with underscores

      // Third pass: Handle code formatting
      cleanedText = cleanedText
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks with triple backticks
        .replace(/~~~[\s\S]*?~~~/g, '') // Remove code blocks with triple tildes
        .replace(/`([^`]+)`/g, '$1'); // Remove inline code

      // Fourth pass: Handle other markdown elements
      cleanedText = cleanedText
        .replace(/^>\s*(.*)/gm, '$1') // Remove blockquotes
        .replace(/^#{1,6}\s+(.*)/gm, '$1') // Remove heading markers
        .replace(/^[-*+]\s+(.*)/gm, '$1') // Remove unordered list markers
        .replace(/^\d+\.\s+(.*)/gm, '$1') // Remove ordered list markers
        .replace(/^(?:[-*_]){3,}$/gm, '') // Remove horizontal rules
        .replace(/^-{3,}|^\*{3,}|^_{3,}/gm, ''); // More aggressive removal of horizontal rules

      // Log the cleaned text for debugging
      console.log('Cleaned text after processing:', cleanedText);

      return cleanedText;
    } catch (error) {
      console.error('Error in cleanMarkdownFormatting:', error);
      DanteLogger.error.runtime(`Error cleaning markdown formatting: ${error}`);
      // Return the original text if there's an error
      return text;
    }
  };

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Check for headings
    if (line.startsWith('# ')) {
      // Skip the first heading if requested
      if (!hasSkippedFirstHeading) {
        hasSkippedFirstHeading = true;
        continue;
      }

      blocks.push({
        type: 'heading1',
        content: cleanMarkdownFormatting(line.substring(2).trim())
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading2',
        content: cleanMarkdownFormatting(line.substring(3).trim())
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading3',
        content: cleanMarkdownFormatting(line.substring(4).trim())
      });
    }
    // Check for horizontal rules (three or more hyphens, asterisks, or underscores)
    else if (/^[-*_]{3,}\s*$/.test(line)) {
      // Skip horizontal rules in all PDFs to avoid overlap issues
      // We'll handle section separation with proper spacing instead
      continue;
    }
    // Check for list items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        type: 'listItem',
        content: cleanMarkdownFormatting(line.substring(2).trim())
      });
    }
    // Check for numbered list items
    else if (/^\d+\.\s/.test(line)) {
      blocks.push({
        type: 'listItem',
        content: cleanMarkdownFormatting(line.replace(/^\d+\.\s/, '').trim())
      });
    }
    // Everything else is a paragraph
    else {
      // Clean the markdown formatting
      const cleanedLine = cleanMarkdownFormatting(line);

      // Skip empty lines after cleaning
      if (!cleanedLine.trim()) continue;

      // Check if this is a continuation of a previous paragraph
      const prevBlock = blocks[blocks.length - 1];

      // Only combine with previous paragraph if:
      // 1. There is a previous paragraph block
      // 2. The previous line doesn't end with two spaces (markdown line break)
      // 3. The previous line isn't empty
      if (prevBlock &&
          prevBlock.type === 'paragraph' &&
          i > 0 &&
          !lines[i-1].trim().endsWith('  ') &&
          lines[i-1].trim().length > 0) {

        // Append to previous paragraph with a space
        prevBlock.content += ' ' + cleanedLine;
      } else {
        // Create a new paragraph block
        blocks.push({
          type: 'paragraph',
          content: cleanedLine
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

    // Get CSS variables from the document with fallbacks for all naming conventions
    const computedStyle = getComputedStyle(document.documentElement);

    // Check if this is an Introduction PDF (based on options)
    const isIntroduction = options.title?.toLowerCase().includes('introduction') || false;

    // For Introduction PDFs, prioritize the PDF-extracted styles
    console.log(`Generating PDF from HTML element${isIntroduction ? ' for Introduction' : ''}`);

    if (isIntroduction) {
      console.log('Prioritizing PDF-extracted styles for Introduction PDF');
    }

    // Try multiple variable names for each style property with fallbacks
    // For Introduction PDFs, prioritize the PDF-extracted variables
    const bgColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-background-color').trim() ||
         computedStyle.getPropertyValue('--background').trim() ||
         computedStyle.getPropertyValue('--bg-primary').trim() ||
         computedStyle.getPropertyValue('--background-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-background').trim() ||
         '#F5F1E0')
      : (computedStyle.getPropertyValue('--bg-primary').trim() ||
         computedStyle.getPropertyValue('--pdf-background-color').trim() ||
         computedStyle.getPropertyValue('--background-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-background').trim() ||
         '#F5F1E0');

    const textColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-text-color').trim() ||
         computedStyle.getPropertyValue('--text-color').trim() ||
         computedStyle.getPropertyValue('--text-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-text').trim() ||
         '#3A4535')
      : (computedStyle.getPropertyValue('--text-color').trim() ||
         computedStyle.getPropertyValue('--pdf-text-color').trim() ||
         computedStyle.getPropertyValue('--text-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-text').trim() ||
         '#3A4535');

    const fontBody = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-body-font').trim() ||
         computedStyle.getPropertyValue('--font-body').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
         'Garamond, Times New Roman, serif')
      : (computedStyle.getPropertyValue('--font-body').trim() ||
         computedStyle.getPropertyValue('--pdf-body-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
         'Garamond, Times New Roman, serif');

    const fontHeading = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-heading-font').trim() ||
         computedStyle.getPropertyValue('--font-heading').trim() ||
         computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
         'Courier New, monospace')
      : (computedStyle.getPropertyValue('--font-heading').trim() ||
         computedStyle.getPropertyValue('--pdf-heading-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
         'Courier New, monospace');

    const fontMono = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-mono-font').trim() ||
         computedStyle.getPropertyValue('--font-mono').trim() ||
         computedStyle.getPropertyValue('--dynamic-mono-font').trim() ||
         'Courier New, monospace')
      : (computedStyle.getPropertyValue('--font-mono').trim() ||
         computedStyle.getPropertyValue('--pdf-mono-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-mono-font').trim() ||
         'Courier New, monospace');

    const primaryColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-primary-color').trim() ||
         computedStyle.getPropertyValue('--primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary').trim() ||
         '#7E4E2D')
      : (computedStyle.getPropertyValue('--primary').trim() ||
         computedStyle.getPropertyValue('--pdf-primary-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary').trim() ||
         '#7E4E2D');

    const secondaryColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-secondary-color').trim() ||
         computedStyle.getPropertyValue('--secondary').trim() ||
         computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
         '#5F6B54')
      : (computedStyle.getPropertyValue('--secondary').trim() ||
         computedStyle.getPropertyValue('--pdf-secondary-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
         '#5F6B54');

    const borderColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-border-color').trim() ||
         computedStyle.getPropertyValue('--border-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-border').trim() ||
         'rgba(73, 66, 61, 0.1)')
      : (computedStyle.getPropertyValue('--border-color').trim() ||
         computedStyle.getPropertyValue('--pdf-border-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-border').trim() ||
         'rgba(73, 66, 61, 0.1)');

    console.log('PDF Generator using extracted styles:', {
      bgColor,
      textColor,
      fontBody,
      fontHeading,
      fontMono,
      primaryColor,
      secondaryColor,
      borderColor
    });

    // Create a container with all styles inlined
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '15mm';
    container.style.backgroundColor = bgColor; // Use extracted background color
    container.style.color = textColor; // Use extracted text color
    container.style.fontFamily = fontBody; // Use extracted body font
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.5';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';

    // CSS variables already retrieved above

    // Add Salinger-inspired styling with extracted colors
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      h1, h2, h3, h4, h5, h6 {
        font-family: ${fontHeading};
        color: ${textColor};
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      h1 {
        font-size: 24pt;
        font-weight: 400;
        letter-spacing: -0.5px;
      }
      h2 {
        font-size: 20pt;
        border-bottom: 1px solid ${borderColor};
        padding-bottom: 0.2em;
        font-weight: 400;
      }
      h3 {
        font-size: 16pt;
        font-weight: 400;
      }
      h4 {
        font-size: 14pt;
        font-weight: 400;
        font-style: italic;
      }
      p {
        font-family: ${fontBody};
        color: ${textColor};
        margin-bottom: 1em;
        text-align: justify;
        line-height: 1.6;
      }
      ul, ol {
        margin-bottom: 1em;
        padding-left: 2em;
      }
      li {
        font-family: ${fontBody};
        color: ${textColor};
        margin-bottom: 0.5em;
        line-height: 1.6;
      }
      a {
        color: ${primaryColor};
        text-decoration: none;
      }
      code {
        font-family: ${fontMono};
        background-color: rgba(73, 66, 61, 0.05);
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-size: 0.9em;
      }
      pre {
        background-color: rgba(73, 66, 61, 0.05);
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 1rem;
      }
      pre code {
        background-color: transparent;
        padding: 0;
      }
      blockquote {
        border-left: 4px solid ${borderColor};
        padding-left: 1em;
        margin-left: 0;
        color: ${secondaryColor};
        font-style: italic;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      th {
        font-family: ${fontHeading};
        color: ${textColor};
        font-weight: bold;
        padding: 0.5rem;
        border-bottom: 2px solid ${borderColor};
        text-align: left;
      }
      td {
        font-family: ${fontBody};
        color: ${textColor};
        padding: 0.5rem;
        border-bottom: 1px solid ${borderColor};
      }
      hr {
        border: none;
        border-top: 1px solid ${borderColor};
        margin: 2rem 0; /* Increased margin for better spacing */
        opacity: 0.5; /* Make horizontal rules more subtle */
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      code {
        font-family: ${fontMono};
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
        border: 1px solid ${borderColor};
        padding: 0.5em;
        text-align: left;
      }
      th {
        background-color: rgba(213, 205, 181, 0.3);
        font-weight: bold;
      }
      hr {
        border: none;
        border-top: 1px solid ${borderColor};
        margin: 2.5em 0; /* Increased margin for better spacing */
        opacity: 0.5; /* Make horizontal rules more subtle */
      }
      .markdownPreview {
        background-color: ${bgColor};
        border-radius: 4px;
        padding: 1.5rem;
        border: 1px solid ${borderColor};
        font-family: ${fontBody};
        line-height: 1.6;
        color: ${textColor};
      }
    `;
    container.appendChild(styleElement);

    // Add header with Salinger styling using extracted colors and fonts
    if (mergedOptions.headerText) {
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '2em';
      header.style.fontFamily = fontHeading;
      header.style.color = textColor;

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
      backgroundColor: bgColor, // Use extracted background color
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
      author: mergedOptions.author || 'User',
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

    // Get CSS variables from the document with fallbacks for all naming conventions
    const computedStyle = getComputedStyle(document.documentElement);

    // Try multiple variable names for each style property with fallbacks
    const bgColor =
      computedStyle.getPropertyValue('--bg-primary').trim() ||
      computedStyle.getPropertyValue('--pdf-background-color').trim() ||
      computedStyle.getPropertyValue('--background-primary').trim() ||
      computedStyle.getPropertyValue('--dynamic-background').trim() ||
      '#ffffff';

    const textColor =
      computedStyle.getPropertyValue('--text-color').trim() ||
      computedStyle.getPropertyValue('--pdf-text-color').trim() ||
      computedStyle.getPropertyValue('--text-primary').trim() ||
      computedStyle.getPropertyValue('--dynamic-text').trim() ||
      '#000000';

    const fontBody =
      computedStyle.getPropertyValue('--font-body').trim() ||
      computedStyle.getPropertyValue('--pdf-body-font').trim() ||
      computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
      'Garamond, Times New Roman, serif';

    const fontHeading =
      computedStyle.getPropertyValue('--font-heading').trim() ||
      computedStyle.getPropertyValue('--pdf-heading-font').trim() ||
      computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
      'Courier New, monospace';

    const fontMono =
      computedStyle.getPropertyValue('--font-mono').trim() ||
      computedStyle.getPropertyValue('--pdf-mono-font').trim() ||
      computedStyle.getPropertyValue('--dynamic-mono-font').trim() ||
      'Courier New, monospace';

    const primaryColor =
      computedStyle.getPropertyValue('--primary').trim() ||
      computedStyle.getPropertyValue('--pdf-primary-color').trim() ||
      computedStyle.getPropertyValue('--dynamic-primary').trim() ||
      '#7E4E2D';

    const secondaryColor =
      computedStyle.getPropertyValue('--secondary').trim() ||
      computedStyle.getPropertyValue('--pdf-secondary-color').trim() ||
      computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
      '#5F6B54';

    const borderColor =
      computedStyle.getPropertyValue('--border-color').trim() ||
      computedStyle.getPropertyValue('--pdf-border-color').trim() ||
      computedStyle.getPropertyValue('--dynamic-border').trim() ||
      '#D5CDB5';

    console.log('PDF Generator (generatePdfFromMarkdown) using extracted styles:', {
      bgColor,
      textColor,
      fontBody,
      fontHeading,
      fontMono,
      primaryColor,
      secondaryColor,
      borderColor
    });

    // Convert hex color to RGB components for PDF
    const getBgColorRGB = (hexColor: string) => {
      const hex = hexColor.replace('#', '');
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    };

    // Get background color in RGB format
    const bgColorRGB = getBgColorRGB(bgColor);

    // Use PDF-extracted styles for all content, including Cover Letter
    // Only use dark theme if explicitly requested via options
    const isDarkTheme = options.isDarkTheme === true || false;

    // Create a PDF document directly with proper dimensions for US Letter (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter' // 8.5 x 11 inches
    });

    // Set document properties
    pdf.setProperties({
      title: options.title || 'Generated PDF',
      author: options.author || 'User',
      subject: options.subject || 'Resume Summary',
      keywords: options.keywords || 'resume, summary, pdf'
    });

    // Set background color for full bleed using extracted colors
    // Add a full-page background rectangle
    pdf.setFillColor(bgColorRGB.r, bgColorRGB.g, bgColorRGB.b);
    pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page

    // Add header with Salinger styling using extracted colors
    if (options.headerText) {
      // Get text color in RGB format
      const getTextColorRGB = (hexColor: string) => {
        const hex = hexColor.replace('#', '');
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      };

      const textColorRGB = getTextColorRGB(textColor);
      const borderColorRGB = getBgColorRGB(borderColor);

      // Set text color using extracted color
      pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);

      // Get heading font from the already extracted fontHeading variable
      const headingFontFamily = fontHeading.split(',')[0].replace(/['"]/g, '').trim();

      // Use the extracted font if it's a standard PDF font, otherwise fallback to courier
      const headingPdfFont = ['courier', 'helvetica', 'times', 'arial', 'verdana', 'georgia', 'calibri', 'cambria', 'tahoma'].includes(headingFontFamily.toLowerCase())
        ? (headingFontFamily.toLowerCase() === 'arial' || headingFontFamily.toLowerCase() === 'verdana' || headingFontFamily.toLowerCase() === 'tahoma' || headingFontFamily.toLowerCase() === 'calibri')
          ? 'helvetica' // Map Arial, Verdana, Tahoma, and Calibri to Helvetica
          : (headingFontFamily.toLowerCase() === 'georgia' || headingFontFamily.toLowerCase() === 'cambria')
            ? 'times' // Map Georgia and Cambria to Times
            : headingFontFamily.toLowerCase() // Use courier, helvetica, or times directly
        : 'courier'; // Default fallback

      // Log the extracted font for debugging
      console.log('Extracted heading font:', fontHeading);
      console.log('Using PDF font for heading:', headingPdfFont);

      pdf.setFont(headingPdfFont, 'bold');
      pdf.setFontSize(22); // Slightly smaller font size
      pdf.text(options.headerText, 4.25, 0.8, { align: 'center' }); // Moved up from 1.0 to 0.8

      // Removed header separator line to prevent overlap issues
    }

    // Parse the markdown content, skipping the first heading if a header text is provided
    const parsedContent = parseMarkdownForPdf(markdownContent, !!options.headerText);

    // Get text color in RGB format
    const getTextColorRGB = (hexColor: string) => {
      const hex = hexColor.replace('#', '');
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    };

    // Get text color in RGB format
    const textColorRGB = getTextColorRGB(textColor);

    // Set text color using extracted colors
    pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);

    // Get heading font from the already extracted fontHeading variable
    const headingFontFamily = fontHeading.split(',')[0].replace(/['"]/g, '').trim();

    // Use the extracted font if it's a standard PDF font, otherwise fallback to courier
    const headingPdfFont = ['courier', 'helvetica', 'times', 'arial', 'verdana', 'georgia', 'calibri', 'cambria', 'tahoma'].includes(headingFontFamily.toLowerCase())
      ? (headingFontFamily.toLowerCase() === 'arial' || headingFontFamily.toLowerCase() === 'verdana' || headingFontFamily.toLowerCase() === 'tahoma' || headingFontFamily.toLowerCase() === 'calibri')
        ? 'helvetica' // Map Arial, Verdana, Tahoma, and Calibri to Helvetica
        : (headingFontFamily.toLowerCase() === 'georgia' || headingFontFamily.toLowerCase() === 'cambria')
          ? 'times' // Map Georgia and Cambria to Times
          : headingFontFamily.toLowerCase() // Use courier, helvetica, or times directly
      : 'courier'; // Default fallback

    // Get body font from the already extracted fontBody variable
    const bodyFontFamily = fontBody.split(',')[0].replace(/['"]/g, '').trim();

    // Log the extracted font for debugging
    console.log('Extracted body font:', fontBody);
    console.log('First body font family:', bodyFontFamily);

    // Use the extracted font if it's a standard PDF font, otherwise fallback to times
    // Standard PDF fonts are: courier, helvetica, times (and their variants)
    // Add more common fonts that map to the standard PDF fonts
    const bodyPdfFont = ['courier', 'helvetica', 'times', 'arial', 'verdana', 'georgia', 'calibri', 'cambria', 'tahoma'].includes(bodyFontFamily.toLowerCase())
      ? (bodyFontFamily.toLowerCase() === 'arial' || bodyFontFamily.toLowerCase() === 'verdana' || bodyFontFamily.toLowerCase() === 'tahoma' || bodyFontFamily.toLowerCase() === 'calibri')
        ? 'helvetica' // Map Arial, Verdana, Tahoma, and Calibri to Helvetica
        : (bodyFontFamily.toLowerCase() === 'georgia' || bodyFontFamily.toLowerCase() === 'cambria')
          ? 'times' // Map Georgia and Cambria to Times
          : bodyFontFamily.toLowerCase() // Use courier, helvetica, or times directly
      : 'times'; // Default fallback

    console.log('Using PDF font for body:', bodyPdfFont);

    // Set default font
    pdf.setFont(bodyPdfFont, 'normal');
    pdf.setFontSize(12);

    // Add content with proper styling - optimized for single page with balanced spacing
    let yPosition = options.headerText ? 1.0 : 0.5; // Reduced top margin after header to fit more content
    const margin = 0.6; // Further reduced side margins (0.6 inch margins) to fit more content
    const pageWidth = 8.5 - (margin * 2); // Wider content area

    // Optimize line height for single page fit while preventing text overlap
    const lineHeight = 0.2; // Slightly reduced but still sufficient to prevent overlap

    // Track the previous block type to add section separators
    let prevBlockType: string | null = null;

    // Check if this is an introduction PDF (based on options)
    // First check the explicit isIntroduction flag, then check filename and title
    const isIntroduction = options.isIntroduction === true ||
                          options.fileName?.toLowerCase().includes('introduction') ||
                          options.title?.toLowerCase().includes('introduction') ||
                          false;

    // If this is an introduction, use more aggressive space optimization
    let effectiveMargin = margin;
    let effectiveLineHeight = lineHeight;
    let fontSizeReduction = 0;



    if (isIntroduction) {
      console.log('Optimizing PDF for single-page introduction with consistent vertical rhythm');
      // Use smaller margins for introduction but not too small to maintain readability
      effectiveMargin = 0.6; // Slightly larger margin for better readability
      // Use consistent line height for introduction to maintain typographic grace
      effectiveLineHeight = 0.18; // Reduced line height for better vertical rhythm
      // Reduce font sizes for introduction but maintain proportions
      fontSizeReduction = 1; // Reduce font sizes by 1pt to ensure content fits on one page

      // Use extracted color theory for background if available
      if (bgColor && !isDarkTheme) {
        // Get background color in RGB format
        const bgColorRGB = getBgColorRGB(bgColor);
        pdf.setFillColor(bgColorRGB.r, bgColorRGB.g, bgColorRGB.b);
        pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        console.log(`Applied extracted background color: ${bgColor}`);
      }
    }

    // Process each content block
    parsedContent.forEach((block, index) => {
      // Check if we need to add a new page
      if (yPosition > 10.2) { // Extended usable area (11 inches - minimal margin)
        pdf.addPage();
        yPosition = 0.5;

        // Add dark background to new page if using dark theme
        if (isDarkTheme) {
          pdf.setFillColor(34, 34, 34); // #222222 dark background
          pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        }
      }

      // Add spacing before heading2 (except for the first section)
      if (block.type === 'heading2' && index > 0) {
        // Add extra space before new section to clearly show section differences
        yPosition += isIntroduction ? 0.25 : 0.3; // Clear section spacing for introduction
      }

      // Handle different block types
      switch (block.type) {
        case 'heading1':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroduction ? 15 - fontSizeReduction : 16); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition);
          yPosition += isIntroduction ? 0.2 : 0.3; // Consistent spacing for introduction
          break;

        case 'heading2':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroduction ? 13 - fontSizeReduction : 14); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition);
          yPosition += isIntroduction ? 0.12 : 0.2; // Reduced spacing for introduction

          // For introduction, don't add horizontal lines under h2 headings
          if (isIntroduction) {
            // Just add some extra spacing after headings for better readability
            yPosition += 0.1;
          }
          break;

        case 'heading3':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroduction ? 12 - fontSizeReduction : 13); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition);
          yPosition += isIntroduction ? 0.12 : 0.2; // Reduced spacing for introduction
          break;

        case 'paragraph':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(bodyPdfFont || 'times', 'normal'); // Use extracted body font
          pdf.setFontSize(isIntroduction ? 11 - fontSizeReduction : 12); // Smaller for introduction

          // Calculate effective page width based on margins
          const effectivePageWidth = 8.5 - (effectiveMargin * 2);

          // Split long paragraphs into multiple lines
          const lines = pdf.splitTextToSize(block.content, effectivePageWidth);
          pdf.text(lines, effectiveMargin, yPosition);
          // Slightly increased paragraph spacing for introduction to prevent overlap with horizontal lines
          yPosition += (lines.length * effectiveLineHeight) + (isIntroduction ? 0.12 : 0.1);
          break;

        case 'listItem':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(bodyPdfFont || 'times', 'normal'); // Use extracted body font
          pdf.setFontSize(isIntroduction ? 11 - fontSizeReduction : 12); // Smaller for introduction

          // Use accent color for bullet points if available
          if (!isDarkTheme && primaryColor) {
            const accentColorRGB = getBgColorRGB(primaryColor);
            pdf.setTextColor(accentColorRGB.r, accentColorRGB.g, accentColorRGB.b);
          }

          // Add bullet point
          pdf.text('•', effectiveMargin, yPosition);

          // Reset text color for the list item content
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }

          // Calculate effective page width for list items
          const effectiveListItemWidth = 8.5 - (effectiveMargin * 2) - 0.2;

          // Split long list items into multiple lines with proper indentation
          const listItemLines = pdf.splitTextToSize(block.content, effectiveListItemWidth);
          pdf.text(listItemLines, effectiveMargin + 0.2, yPosition);
          yPosition += (listItemLines.length * effectiveLineHeight) + (isIntroduction ? 0.04 : 0.05); // Reduced list item spacing for introduction
          break;
      }
    });

    // Add footer if provided (without separator line)
    if (options.footerText && !isIntroduction) {
      // Skip footer for introduction PDFs to save space
      // Add footer text without separator line
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.7); // #F5F3E7 light text with opacity
      } else {
        pdf.setTextColor(73, 66, 61, 0.7); // #49423D Ebony with opacity
      }
      pdf.setFont(headingPdfFont || 'courier', 'normal'); // Use extracted heading font
      pdf.setFontSize(9); // Slightly smaller font size
      pdf.text(options.footerText, 4.25, 10.7, { align: 'center' }); // Positioned at bottom of page
    }

    // For introduction PDFs, add a subtle page number at the bottom
    if (isIntroduction) {
      // Use a very small font size for the page number
      pdf.setFontSize(8);
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.5); // Light text with more opacity
      } else {
        // Use extracted secondary color with opacity
        const secondaryColorRGB = getBgColorRGB(secondaryColor || textColor);
        pdf.setTextColor(secondaryColorRGB.r, secondaryColorRGB.g, secondaryColorRGB.b, 0.5);
      }
      pdf.text('1/1', 8.0, 10.8, { align: 'right' }); // Right-aligned page number
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

    // Get CSS variables from the document with fallbacks for all naming conventions
    const computedStyle = getComputedStyle(document.documentElement);

    // Track if this is an introduction PDF (based on filename or title)
    const isIntroduction = options.fileName?.toLowerCase().includes('introduction') ||
                          options.title?.toLowerCase().includes('introduction') ||
                          false;

    // For Introduction PDFs, prioritize the PDF-extracted styles
    console.log(`Generating PDF data URL${isIntroduction ? ' for Introduction' : ''}`);

    if (isIntroduction) {
      console.log('Prioritizing PDF-extracted styles for Introduction PDF');
    }

    // Try multiple variable names for each style property with fallbacks
    // For Introduction PDFs, prioritize the PDF-extracted variables
    const bgColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-background-color').trim() ||
         computedStyle.getPropertyValue('--background').trim() ||
         computedStyle.getPropertyValue('--bg-primary').trim() ||
         computedStyle.getPropertyValue('--background-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-background').trim() ||
         '#ffffff')
      : (computedStyle.getPropertyValue('--bg-primary').trim() ||
         computedStyle.getPropertyValue('--pdf-background-color').trim() ||
         computedStyle.getPropertyValue('--background-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-background').trim() ||
         '#ffffff');

    const textColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-text-color').trim() ||
         computedStyle.getPropertyValue('--text-color').trim() ||
         computedStyle.getPropertyValue('--text-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-text').trim() ||
         '#000000')
      : (computedStyle.getPropertyValue('--text-color').trim() ||
         computedStyle.getPropertyValue('--pdf-text-color').trim() ||
         computedStyle.getPropertyValue('--text-primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-text').trim() ||
         '#000000');

    const fontBody = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-body-font').trim() ||
         computedStyle.getPropertyValue('--font-body').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
         'Garamond, Times New Roman, serif')
      : (computedStyle.getPropertyValue('--font-body').trim() ||
         computedStyle.getPropertyValue('--pdf-body-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
         'Garamond, Times New Roman, serif');

    const fontHeading = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-heading-font').trim() ||
         computedStyle.getPropertyValue('--font-heading').trim() ||
         computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
         'Courier New, monospace')
      : (computedStyle.getPropertyValue('--font-heading').trim() ||
         computedStyle.getPropertyValue('--pdf-heading-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
         'Courier New, monospace');

    const fontMono = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-mono-font').trim() ||
         computedStyle.getPropertyValue('--font-mono').trim() ||
         computedStyle.getPropertyValue('--dynamic-mono-font').trim() ||
         'Courier New, monospace')
      : (computedStyle.getPropertyValue('--font-mono').trim() ||
         computedStyle.getPropertyValue('--pdf-mono-font').trim() ||
         computedStyle.getPropertyValue('--dynamic-mono-font').trim() ||
         'Courier New, monospace');

    const primaryColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-primary-color').trim() ||
         computedStyle.getPropertyValue('--primary').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary').trim() ||
         '#7E4E2D')
      : (computedStyle.getPropertyValue('--primary').trim() ||
         computedStyle.getPropertyValue('--pdf-primary-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-primary').trim() ||
         '#7E4E2D');

    const secondaryColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-secondary-color').trim() ||
         computedStyle.getPropertyValue('--secondary').trim() ||
         computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
         '#5F6B54')
      : (computedStyle.getPropertyValue('--secondary').trim() ||
         computedStyle.getPropertyValue('--pdf-secondary-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
         '#5F6B54');

    const borderColor = isIntroduction
      ? (computedStyle.getPropertyValue('--pdf-border-color').trim() ||
         computedStyle.getPropertyValue('--border-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-border').trim() ||
         '#D5CDB5')
      : (computedStyle.getPropertyValue('--border-color').trim() ||
         computedStyle.getPropertyValue('--pdf-border-color').trim() ||
         computedStyle.getPropertyValue('--dynamic-border').trim() ||
         '#D5CDB5');

    console.log('PDF Generator (generatePdfDataUrlFromMarkdown) using extracted styles:', {
      bgColor,
      textColor,
      fontBody,
      fontHeading,
      fontMono,
      primaryColor,
      secondaryColor,
      borderColor
    });

    // Use PDF-extracted styles for all content, including Cover Letter
    // Only use dark theme if explicitly requested via options
    const isDarkTheme = options.isDarkTheme === true || false;

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

    // Get heading font from the extracted fontHeading variable
    const headingFontFamily = fontHeading.split(',')[0].replace(/['"]/g, '').trim();

    // Log the extracted font for debugging
    console.log('Data URL - Extracted heading font:', fontHeading);
    console.log('Data URL - First heading font family:', headingFontFamily);

    // Use the extracted font if it's a standard PDF font, otherwise fallback to courier
    // Standard PDF fonts are: courier, helvetica, times (and their variants)
    // Add more common fonts that map to the standard PDF fonts
    const headingPdfFont = ['courier', 'helvetica', 'times', 'arial', 'verdana', 'georgia', 'calibri', 'cambria', 'tahoma'].includes(headingFontFamily.toLowerCase())
      ? (headingFontFamily.toLowerCase() === 'arial' || headingFontFamily.toLowerCase() === 'verdana' || headingFontFamily.toLowerCase() === 'tahoma' || headingFontFamily.toLowerCase() === 'calibri')
        ? 'helvetica' // Map Arial, Verdana, Tahoma, and Calibri to Helvetica
        : (headingFontFamily.toLowerCase() === 'georgia' || headingFontFamily.toLowerCase() === 'cambria')
          ? 'times' // Map Georgia and Cambria to Times
          : headingFontFamily.toLowerCase() // Use courier, helvetica, or times directly
      : 'courier'; // Default fallback

    console.log('Data URL - Using PDF font for heading:', headingPdfFont);

    // Get body font from the extracted fontBody variable
    const bodyFontFamily = fontBody.split(',')[0].replace(/['"]/g, '').trim();

    // Log the extracted font for debugging
    console.log('Data URL - Extracted body font:', fontBody);
    console.log('Data URL - First body font family:', bodyFontFamily);

    // Use the extracted font if it's a standard PDF font, otherwise fallback to times
    // Standard PDF fonts are: courier, helvetica, times (and their variants)
    // Add more common fonts that map to the standard PDF fonts
    const bodyPdfFont = ['courier', 'helvetica', 'times', 'arial', 'verdana', 'georgia', 'calibri', 'cambria', 'tahoma'].includes(bodyFontFamily.toLowerCase())
      ? (bodyFontFamily.toLowerCase() === 'arial' || bodyFontFamily.toLowerCase() === 'verdana' || bodyFontFamily.toLowerCase() === 'tahoma' || bodyFontFamily.toLowerCase() === 'calibri')
        ? 'helvetica' // Map Arial, Verdana, Tahoma, and Calibri to Helvetica
        : (bodyFontFamily.toLowerCase() === 'georgia' || bodyFontFamily.toLowerCase() === 'cambria')
          ? 'times' // Map Georgia and Cambria to Times
          : bodyFontFamily.toLowerCase() // Use courier, helvetica, or times directly
      : 'times'; // Default fallback

    console.log('Data URL - Using PDF font for body:', bodyPdfFont);

    // Add header with Salinger styling
    if (options.headerText) {
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231); // #F5F3E7 light text for dark theme
      } else {
        pdf.setTextColor(73, 66, 61); // #49423D Ebony
      }

      pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
      pdf.setFontSize(22); // Slightly smaller font size
      pdf.text(options.headerText, 4.25, 0.8, { align: 'center' }); // Moved up from 1.0 to 0.8

      // Removed header separator line to prevent overlap issues
    }

    // Parse the markdown content, skipping the first heading if a header text is provided
    const parsedContent = parseMarkdownForPdf(markdownContent, !!options.headerText);

    // Get text color in RGB format
    const getTextColorRGB = (hexColor: string) => {
      const hex = hexColor.replace('#', '');
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    };

    // Set text color using extracted colors
    const textColorRGB = getTextColorRGB(textColor);
    pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);

    // Use the font variables already defined above

    // Set default font
    pdf.setFont(bodyPdfFont || 'times', 'normal'); // Use extracted body font
    pdf.setFontSize(12);

    // Add content with proper styling - optimized for single page with balanced spacing
    let yPosition = options.headerText ? 1.0 : 0.5; // Reduced top margin after header to fit more content
    const margin = 0.6; // Further reduced side margins (0.6 inch margins) to fit more content
    const pageWidth = 8.5 - (margin * 2); // Wider content area

    // Optimize line height for single page fit while preventing text overlap
    const lineHeight = 0.2; // Slightly reduced but still sufficient to prevent overlap

    // Set default alignment to left
    const textAlign = 'left';

    // Track the previous block type to add section separators
    let prevBlockType: string | null = null;

    // Check if this is an introduction PDF (based on options)
    // First check the explicit isIntroduction flag, then check filename and title
    const isIntroductionPdf = options.isIntroduction === true ||
                          options.fileName?.toLowerCase().includes('introduction') ||
                          options.title?.toLowerCase().includes('introduction') ||
                          false;

    // If this is an introduction, use more aggressive space optimization
    let effectiveMargin = margin;
    let effectiveLineHeight = lineHeight;
    let fontSizeReduction = 0;

    if (isIntroductionPdf) {
      console.log('Optimizing PDF data URL for single-page introduction with consistent vertical rhythm');
      // Use smaller margins for introduction but not too small to maintain readability
      effectiveMargin = 0.6; // Slightly larger margin for better readability
      // Use consistent line height for introduction to maintain typographic grace
      effectiveLineHeight = 0.18; // Reduced line height for better vertical rhythm
      // Reduce font sizes for introduction but maintain proportions
      fontSizeReduction = 1; // Reduce font sizes by 1pt to ensure content fits on one page

      // Use extracted color theory for background if available
      if (bgColor && !isDarkTheme) {
        // Get background color in RGB format
        const bgColorRGB = getBgColorRGB(bgColor);
        pdf.setFillColor(bgColorRGB.r, bgColorRGB.g, bgColorRGB.b);
        pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        console.log(`Applied extracted background color: ${bgColor}`);
      }
    }

    // Process each content block
    parsedContent.forEach((block, index) => {
      // Check if we need to add a new page
      if (yPosition > 10.2) { // Extended usable area (11 inches - minimal margin)
        // If this is an introduction, log a warning that content might not fit on a single page
        if (isIntroductionPdf) {
          console.warn('Warning: Introduction content might not fit on a single page');
          DanteLogger.warn.resources('Introduction content might not fit on a single page');
        }

        pdf.addPage();
        yPosition = 0.5;

        // Add dark background to new page if using dark theme
        if (isDarkTheme) {
          pdf.setFillColor(34, 34, 34); // #222222 dark background
          pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        } else if (isIntroductionPdf && bgColor) {
          // Use extracted background color for introduction
          const bgColorRGB = getBgColorRGB(bgColor);
          pdf.setFillColor(bgColorRGB.r, bgColorRGB.g, bgColorRGB.b);
          pdf.rect(0, 0, 8.5, 11, 'F'); // Fill the entire page
        }
      }

      // Add spacing before heading2 (except for the first section)
      if (block.type === 'heading2' && index > 0) {
        // Add extra space before new section to clearly show section differences
        yPosition += isIntroductionPdf ? 0.25 : 0.3; // Clear section spacing for introduction
      }

      // Handle different block types
      switch (block.type) {
        case 'heading1':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroductionPdf ? 15 - fontSizeReduction : 16); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition, { align: textAlign });
          yPosition += isIntroductionPdf ? 0.2 : 0.3; // Consistent spacing for introduction
          break;

        case 'heading2':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroductionPdf ? 13 - fontSizeReduction : 14); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition, { align: textAlign });
          yPosition += isIntroductionPdf ? 0.12 : 0.2; // Reduced spacing for introduction

          // For introduction, don't add horizontal lines under h2 headings
          if (isIntroductionPdf) {
            // Just add some extra spacing after headings for better readability
            yPosition += 0.1;
          }
          break;

        case 'heading3':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(headingPdfFont || 'courier', 'bold'); // Use extracted heading font
          pdf.setFontSize(isIntroductionPdf ? 12 - fontSizeReduction : 13); // Smaller for introduction
          pdf.text(block.content, effectiveMargin, yPosition, { align: textAlign });
          yPosition += isIntroductionPdf ? 0.12 : 0.2; // Reduced spacing for introduction
          break;

        case 'paragraph':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(bodyPdfFont || 'times', 'normal'); // Use extracted body font
          pdf.setFontSize(isIntroductionPdf ? 11 - fontSizeReduction : 12); // Smaller for introduction

          // Calculate effective page width based on margins
          const effectivePageWidth = 8.5 - (effectiveMargin * 2);

          // Split long paragraphs into multiple lines
          const lines = pdf.splitTextToSize(block.content, effectivePageWidth);
          pdf.text(lines, effectiveMargin, yPosition, { align: textAlign });
          // Slightly increased paragraph spacing for introduction to prevent overlap with horizontal lines
          yPosition += (lines.length * effectiveLineHeight) + (isIntroductionPdf ? 0.12 : 0.1);
          break;

        case 'listItem':
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }
          pdf.setFont(bodyPdfFont || 'times', 'normal'); // Use extracted body font
          pdf.setFontSize(isIntroduction ? 11 - fontSizeReduction : 12); // Smaller for introduction

          // Use accent color for bullet points if available
          if (!isDarkTheme && primaryColor) {
            const accentColorRGB = getBgColorRGB(primaryColor);
            pdf.setTextColor(accentColorRGB.r, accentColorRGB.g, accentColorRGB.b);
          }

          // Add bullet point
          pdf.text('•', effectiveMargin, yPosition, { align: textAlign });

          // Reset text color for the list item content
          if (isDarkTheme) {
            pdf.setTextColor(245, 243, 231); // #F5F3E7 light text
          } else {
            // Use extracted text color if available
            const textColorRGB = getTextColorRGB(textColor);
            pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
          }

          // Calculate effective page width for list items
          const effectiveListItemWidth = 8.5 - (effectiveMargin * 2) - 0.2;

          // Split long list items into multiple lines with proper indentation
          const listItemLines = pdf.splitTextToSize(block.content, effectiveListItemWidth);
          pdf.text(listItemLines, effectiveMargin + 0.2, yPosition, { align: textAlign });
          yPosition += (listItemLines.length * effectiveLineHeight) + (isIntroduction ? 0.04 : 0.05); // Reduced list item spacing for introduction
          break;
      }
    });

    // Add footer if provided (without separator line)
    if (options.footerText && !isIntroduction) {
      // Skip footer for introduction PDFs to save space
      // Add footer text without separator line
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.7); // #F5F3E7 light text with opacity
      } else {
        pdf.setTextColor(73, 66, 61, 0.7); // #49423D Ebony with opacity
      }
      pdf.setFont(headingPdfFont || 'courier', 'normal'); // Use extracted heading font
      pdf.setFontSize(9); // Slightly smaller font size
      pdf.text(options.footerText, 4.25, 10.7, { align: 'center' }); // Positioned at bottom of page
    }

    // For introduction PDFs, add a subtle page number at the bottom
    if (isIntroduction) {
      // Use a very small font size for the page number
      pdf.setFontSize(8);
      if (isDarkTheme) {
        pdf.setTextColor(245, 243, 231, 0.5); // Light text with more opacity
      } else {
        // Use extracted secondary color with opacity
        const secondaryColorRGB = getBgColorRGB(secondaryColor || textColor);
        pdf.setTextColor(secondaryColorRGB.r, secondaryColorRGB.g, secondaryColorRGB.b, 0.5);
      }
      pdf.text('1/1', 8.0, 10.8, { align: 'right' }); // Right-aligned page number
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

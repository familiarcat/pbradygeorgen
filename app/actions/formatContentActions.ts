/**
 * Simplified formatContentActions for AWS Amplify build
 */

/**
 * Formats content for display
 */
export async function formatContent(content: string, options?: any): Promise<string> {
  return `# Formatted Content\n\n${content}`;
}

/**
 * Formats content as markdown
 */
export async function formatAsMarkdown(content: string): Promise<string> {
  return `# Markdown Content\n\n${content}`;
}

/**
 * Formats content as HTML
 */
export async function formatAsHtml(content: string): Promise<string> {
  return `<h1>HTML Content</h1><p>${content}</p>`;
}

/**
 * Formats content as plain text
 */
export async function formatAsPlainText(content: string): Promise<string> {
  return content;
}

/**
 * Formats content as JSON
 */
export async function formatAsJson(content: any): Promise<string> {
  return JSON.stringify(content, null, 2);
}

/**
 * Formats content as markdown for download
 * @param content The content to format
 * @param contentType Optional content type (resume, cover_letter, etc.)
 * @returns Formatted content result
 */
export async function formatContentAsMarkdown(content: string, contentType?: string): Promise<{ success: boolean; data: string; error?: string }> {
  try {
    let formattedContent = '';

    if (contentType === 'resume') {
      formattedContent = `# Resume - Markdown Format\n\n${content}`;
    } else if (contentType === 'cover_letter') {
      formattedContent = `# Cover Letter - Markdown Format\n\n${content}`;
    } else {
      formattedContent = `# Markdown Content for Download\n\n${content}`;
    }

    return {
      success: true,
      data: formattedContent
    };
  } catch (error) {
    return {
      success: false,
      data: '',
      error: error instanceof Error ? error.message : 'Unknown error formatting markdown'
    };
  }
}

/**
 * Formats content as text for download
 * @param content The content to format
 * @param contentType Optional content type (resume, cover_letter, etc.)
 * @returns Formatted content result
 */
export async function formatContentAsText(content: string, contentType?: string): Promise<{ success: boolean; data: string; error?: string }> {
  try {
    let formattedContent = '';

    if (contentType === 'resume') {
      formattedContent = `RESUME\n\n${content}`;
    } else if (contentType === 'cover_letter') {
      formattedContent = `COVER LETTER\n\n${content}`;
    } else {
      formattedContent = content;
    }

    return {
      success: true,
      data: formattedContent
    };
  } catch (error) {
    return {
      success: false,
      data: '',
      error: error instanceof Error ? error.message : 'Unknown error formatting text'
    };
  }
}

/**
 * Formats content as HTML for download
 * @param content The content to format
 * @param contentType Optional content type (resume, cover_letter, etc.)
 * @returns Formatted content result
 */
export async function formatContentAsHtml(content: string, contentType?: string): Promise<{ success: boolean; data: string; error?: string }> {
  try {
    let title = 'HTML Content';
    let heading = 'HTML Content';

    if (contentType === 'resume') {
      title = 'Resume';
      heading = 'Resume';
    } else if (contentType === 'cover_letter') {
      title = 'Cover Letter';
      heading = 'Cover Letter';
    }

    const formattedContent = `<html>
  <head>
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <h1>${heading}</h1>
    <div>${content}</div>
  </body>
</html>`;

    return {
      success: true,
      data: formattedContent
    };
  } catch (error) {
    return {
      success: false,
      data: '',
      error: error instanceof Error ? error.message : 'Unknown error formatting HTML'
    };
  }
}

/**
 * Formats content as JSON for download
 */
export async function formatContentAsJson(content: any): Promise<string> {
  return JSON.stringify(content, null, 2);
}

/**
 * Formats content as PDF for download
 */
export async function formatContentAsPdf(content: string): Promise<Buffer> {
  return Buffer.from(`PDF Content: ${content}`);
}

/**
 * Formats content as DOCX for download
 */
export async function formatContentAsDocx(content: string): Promise<Buffer> {
  return Buffer.from(`DOCX Content: ${content}`);
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } from 'docx';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API route for analyzing and formatting content
 * This handles both content type detection and formatting in a single API call
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    const { filePath, format } = data;

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    if (!format || !['markdown', 'text', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Valid format (markdown, text, or docx) is required' }, { status: 400 });
    }

    // Read the file content
    const fullPath = path.join(process.cwd(), 'public', filePath);
    let content;

    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${fullPath}:`, error);
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }

    // Step 1: Analyze content type
    const contentType = await analyzeContentType(content);
    console.log(`🔍 [Hesse] Content type detected: ${contentType}`);

    // Step 2: Format content based on type and requested format
    let formattedContent;
    let contentBuffer;

    if (format === 'markdown') {
      formattedContent = await formatContentAsMarkdown(content, contentType);
    } else if (format === 'text') {
      formattedContent = await formatContentAsText(content, contentType);
    } else if (format === 'docx') {
      // For docx, we'll return a base64 encoded buffer
      contentBuffer = await formatContentAsDocx(content, contentType);
    }

    return NextResponse.json({
      success: true,
      contentType,
      formattedContent,
      contentBuffer
    });
  } catch (error) {
    console.error('Error in format-content API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Analyze content to determine its type
 * @param content The content to analyze
 * @returns The detected content type
 */
async function analyzeContentType(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a document analysis expert. Your task is to analyze the provided content and
          determine what type of document it is. Respond with ONLY ONE of the following categories:

          - resume
          - cv
          - cover_letter
          - article
          - blog_post
          - brochure
          - advertisement
          - report
          - academic_paper
          - other

          Return ONLY the category name, nothing else.`
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const contentType = response.choices[0]?.message?.content?.trim().toLowerCase() || 'other';
    return contentType;
  } catch (error) {
    console.error('Error analyzing content type:', error);
    // Default to 'other' if analysis fails
    return 'other';
  }
}

/**
 * Format content as markdown based on content type
 * @param content The content to format
 * @param contentType The type of content
 * @returns Formatted markdown
 */
async function formatContentAsMarkdown(content: string, contentType: string): Promise<string> {
  try {
    // First, get structured content to ensure consistent hierarchy
    const structuredContent = await getStructuredContent(content, contentType);

    // Now generate markdown from the structured content
    let markdown = '';

    // Handle resume/CV content
    if (contentType === 'resume' || contentType === 'cv') {
      // Add name as top-level heading
      if (structuredContent.name) {
        markdown += `# ${structuredContent.name}\n\n`;
      }

      // Add contact info
      if (structuredContent.contactInfo) {
        const contactParts = [];
        if (structuredContent.contactInfo.email) contactParts.push(structuredContent.contactInfo.email);
        if (structuredContent.contactInfo.phone) contactParts.push(structuredContent.contactInfo.phone);
        if (structuredContent.contactInfo.location) contactParts.push(structuredContent.contactInfo.location);

        if (contactParts.length > 0) {
          markdown += `${contactParts.join(' | ')}\n\n`;
        }
      }

      // Add sections in order
      if (structuredContent.sections && Array.isArray(structuredContent.sections)) {
        structuredContent.sections.forEach(section => {
          // Add section title
          if (section.title) {
            markdown += `## ${section.title}\n\n`;
          }

          // Add section content
          if (section.content) {
            if (Array.isArray(section.content)) {
              section.content.forEach(item => {
                markdown += `${item}\n\n`;
              });
            } else {
              markdown += `${section.content}\n\n`;
            }
          }

          // Add subsections
          if (section.subsections && Array.isArray(section.subsections)) {
            section.subsections.forEach(subsection => {
              // Add subsection title
              if (subsection.title) {
                markdown += `### ${subsection.title}\n\n`;
              }

              // Add subsection details
              if (subsection.details) {
                markdown += `${subsection.details}\n\n`;
              }

              // Add subsection items as bullet points
              if (subsection.items && Array.isArray(subsection.items)) {
                subsection.items.forEach(item => {
                  markdown += `* ${item}\n`;
                });
                markdown += '\n';
              }
            });
          }
        });
      }
    } else {
      // Handle generic document content
      if (structuredContent.title) {
        markdown += `# ${structuredContent.title}\n\n`;
      }

      if (structuredContent.sections && Array.isArray(structuredContent.sections)) {
        structuredContent.sections.forEach(section => {
          // Add section heading
          if (section.heading) {
            markdown += `## ${section.heading}\n\n`;
          }

          // Add section content
          if (section.content) {
            if (Array.isArray(section.content)) {
              section.content.forEach(para => {
                markdown += `${para}\n\n`;
              });
            } else {
              markdown += `${section.content}\n\n`;
            }
          }

          // Add subsections
          if (section.subsections && Array.isArray(section.subsections)) {
            section.subsections.forEach(subsection => {
              // Add subsection heading
              if (subsection.heading) {
                markdown += `### ${subsection.heading}\n\n`;
              }

              // Add subsection content
              if (subsection.content) {
                if (Array.isArray(subsection.content)) {
                  subsection.content.forEach(para => {
                    markdown += `${para}\n\n`;
                  });
                } else {
                  markdown += `${subsection.content}\n\n`;
                }
              }

              // Add subsection items as bullet points
              if (subsection.items && Array.isArray(subsection.items)) {
                subsection.items.forEach(item => {
                  markdown += `* ${item}\n`;
                });
                markdown += '\n';
              }
            });
          }
        });
      }
    }

    return markdown.trim();
  } catch (error) {
    console.error('Error formatting content as markdown:', error);

    // Fall back to basic formatting if structured approach fails
    let systemPrompt = `You are a document formatting expert. Format the provided content as clean, professional markdown.`;

    // Add specific formatting instructions based on content type
    if (contentType === 'resume' || contentType === 'cv') {
      systemPrompt += `
      This is a RESUME. Follow these specific guidelines:

      1. Start with the person's name as a level 1 heading (# Name)
      2. Use level 2 headings (## Heading) for main sections like Education, Experience, Skills, etc.
      3. Use level 3 headings (### Heading) for job titles/organizations
      4. Use bullet points for skills, responsibilities, and achievements
      5. Use bold for dates, job titles, or other important information
      6. Ensure proper spacing between sections
      7. Maintain a clean, professional layout
      8. Preserve all original content
      9. Do not add any new content or commentary

      Return ONLY the formatted markdown, nothing else.`;
    } else if (contentType === 'cover_letter') {
      systemPrompt += `
      This is a COVER LETTER. Follow these specific guidelines:

      1. Start with the person's name as a level 1 heading
      2. Format the date, recipient information, and salutation appropriately
      3. Use paragraphs with proper spacing
      4. Use bold for emphasis on key points
      5. Format the closing and signature appropriately
      6. Maintain a professional layout

      Return ONLY the formatted markdown, nothing else.`;
    } else {
      systemPrompt += `
      Follow these general guidelines:

      1. Use appropriate heading levels (# for title, ## for main sections, etc.)
      2. Use bullet points for lists
      3. Use bold and italic for emphasis
      4. Ensure proper spacing between sections
      5. Maintain a clean, readable layout

      Return ONLY the formatted markdown, nothing else.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please format this content as markdown:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Error formatting content as markdown:', error);
    // Return original content if formatting fails
    return content;
  }
}

/**
 * Format content as plain text based on content type
 * @param content The content to format
 * @param contentType The type of content
 * @returns Formatted text
 */
async function formatContentAsText(content: string, contentType: string): Promise<string> {
  try {
    // First, get structured content to ensure consistent hierarchy
    const structuredContent = await getStructuredContent(content, contentType);

    // Now generate plain text from the structured content
    let textContent = '';

    // Handle resume/CV content
    if (contentType === 'resume' || contentType === 'cv') {
      // Add name at the top in uppercase
      if (structuredContent.name) {
        textContent += `${structuredContent.name.toUpperCase()}\n${'='.repeat(structuredContent.name.length)}\n\n`;
      }

      // Add contact info
      if (structuredContent.contactInfo) {
        const contactParts = [];
        if (structuredContent.contactInfo.email) contactParts.push(structuredContent.contactInfo.email);
        if (structuredContent.contactInfo.phone) contactParts.push(structuredContent.contactInfo.phone);
        if (structuredContent.contactInfo.location) contactParts.push(structuredContent.contactInfo.location);

        if (contactParts.length > 0) {
          textContent += `${contactParts.join(' | ')}\n\n`;
        }
      }

      // Add sections in order
      if (structuredContent.sections && Array.isArray(structuredContent.sections)) {
        structuredContent.sections.forEach(section => {
          // Add section title in uppercase with underline
          if (section.title) {
            textContent += `${section.title.toUpperCase()}\n${'-'.repeat(section.title.length)}\n\n`;
          }

          // Add section content
          if (section.content) {
            if (Array.isArray(section.content)) {
              section.content.forEach(item => {
                textContent += `${item}\n\n`;
              });
            } else {
              textContent += `${section.content}\n\n`;
            }
          }

          // Add subsections
          if (section.subsections && Array.isArray(section.subsections)) {
            section.subsections.forEach(subsection => {
              // Add subsection title with proper indentation
              if (subsection.title) {
                textContent += `  ${subsection.title}\n`;
              }

              // Add subsection details
              if (subsection.details) {
                textContent += `  ${subsection.details}\n\n`;
              }

              // Add subsection items as bullet points with indentation
              if (subsection.items && Array.isArray(subsection.items)) {
                subsection.items.forEach(item => {
                  textContent += `    * ${item}\n`;
                });
                textContent += '\n';
              }
            });
          }
        });
      }
    } else {
      // Handle generic document content
      if (structuredContent.title) {
        textContent += `${structuredContent.title.toUpperCase()}\n${'='.repeat(structuredContent.title.length)}\n\n`;
      }

      if (structuredContent.sections && Array.isArray(structuredContent.sections)) {
        structuredContent.sections.forEach(section => {
          // Add section heading in uppercase with underline
          if (section.heading) {
            textContent += `${section.heading.toUpperCase()}\n${'-'.repeat(section.heading.length)}\n\n`;
          }

          // Add section content
          if (section.content) {
            if (Array.isArray(section.content)) {
              section.content.forEach(para => {
                textContent += `${para}\n\n`;
              });
            } else {
              textContent += `${section.content}\n\n`;
            }
          }

          // Add subsections
          if (section.subsections && Array.isArray(section.subsections)) {
            section.subsections.forEach(subsection => {
              // Add subsection heading with proper indentation
              if (subsection.heading) {
                textContent += `  ${subsection.heading}\n`;
              }

              // Add subsection content with indentation
              if (subsection.content) {
                if (Array.isArray(subsection.content)) {
                  subsection.content.forEach(para => {
                    textContent += `  ${para}\n\n`;
                  });
                } else {
                  textContent += `  ${subsection.content}\n\n`;
                }
              }

              // Add subsection items as bullet points with indentation
              if (subsection.items && Array.isArray(subsection.items)) {
                subsection.items.forEach(item => {
                  textContent += `    * ${item}\n`;
                });
                textContent += '\n';
              }
            });
          }
        });
      }
    }

    return textContent.trim();
  } catch (error) {
    console.error('Error formatting content as text:', error);

    // Fall back to basic formatting if structured approach fails
    let systemPrompt = `You are a document formatting expert. Format the provided content as clean, professional plain text.`;

    // Add specific formatting instructions based on content type
    if (contentType === 'resume' || contentType === 'cv') {
      systemPrompt += `
      This is a RESUME. Follow these specific guidelines:

      1. Start with the person's name in ALL CAPS
      2. Use ALL CAPS with underlines (====) for main sections like EDUCATION, EXPERIENCE, SKILLS, etc.
      3. Use Title Case with proper indentation for job titles/organizations
      4. Use dashes (-) or asterisks (*) for bullet points
      5. Use proper indentation to show hierarchy (2 spaces for each level)
      6. Use spacing to separate sections (2 blank lines between sections)
      7. Align dates to the right when appropriate
      8. Maintain a clean, professional layout
      9. Preserve all original content
      10. Do not add any new content or commentary

      Return ONLY the formatted plain text, nothing else.`;
    } else if (contentType === 'cover_letter') {
      systemPrompt += `
      This is a COVER LETTER. Follow these specific guidelines:

      1. Format the sender's information at the top
      2. Format the date, recipient information with proper spacing
      3. Use proper paragraph formatting with indentation
      4. Use spacing to separate sections
      5. Format the closing and signature appropriately

      Return ONLY the formatted plain text, nothing else.`;
    } else {
      systemPrompt += `
      Follow these general guidelines:

      1. Use ALL CAPS for titles
      2. Use proper indentation for hierarchy
      3. Use dashes or asterisks for bullet points
      4. Ensure proper spacing between sections
      5. Maintain a clean, readable layout

      Return ONLY the formatted plain text, nothing else.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please format this content as plain text:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Error formatting content as text:', error);
    // Return original content if formatting fails
    return content;
  }
}

/**
 * Format content as a DOCX document based on content type
 * @param content The content to format
 * @param contentType The type of content
 * @returns Base64 encoded DOCX buffer
 */
async function formatContentAsDocx(content: string, contentType: string): Promise<string> {
  try {
    // First, get structured content from OpenAI to ensure we have proper sections
    const structuredContent = await getStructuredContent(content, contentType);

    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: generateDocxContent(structuredContent, contentType, content),
        },
      ],
    });

    // Generate the document as a buffer
    const buffer = await Packer.toBuffer(doc);

    // Return as base64 string for JSON transport
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error formatting content as DOCX:', error);
    // Create a simple document with the original content as fallback
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer.toString('base64');
  }
}

/**
 * Get structured content from OpenAI for better document generation
 * @param content The raw content
 * @param contentType The type of content
 * @returns Structured content object
 */
async function getStructuredContent(content: string, contentType: string): Promise<any> {
  try {
    // Create a prompt based on the content type
    let systemPrompt = `You are a document structuring expert specializing in preserving exact hierarchical structure.
    Your task is to parse the provided content and return a JSON structure that PRECISELY preserves the original document's hierarchy,
    section order, and content organization. This is CRITICAL for maintaining consistency across different document formats.`;

    // Add specific structuring instructions based on content type
    if (contentType === 'resume' || contentType === 'cv') {
      systemPrompt += `
      This is a RESUME. Return a JSON object with these properties, maintaining the EXACT order of sections as they appear in the original document:

      {
        "name": "Full Name",
        "contactInfo": { "email": "", "phone": "", "location": "" },
        "sections": [
          {
            "title": "Section Title (e.g., Professional Summary, Experience, etc.)",
            "content": "Text content or array of items",
            "subsections": [
              {
                "title": "Subsection Title (e.g., Company Name)",
                "details": "Details like dates, location",
                "items": ["Bullet point 1", "Bullet point 2", ...]
              }
            ]
          }
        ]
      }

      IMPORTANT INSTRUCTIONS:
      1. The 'name' MUST be the first element and should appear at the top of all formats
      2. Preserve the EXACT order of sections as they appear in the original document
      3. Include ALL content from the original document - do not omit any information
      4. Maintain the hierarchical structure exactly as it appears in the original
      5. For each section, correctly identify if content should be paragraph text or bullet points
      6. Return ONLY the JSON object, nothing else

      This structure will be used to generate multiple document formats, so accurate preservation of the original structure is CRITICAL.`;
    } else {
      systemPrompt += `
      Return a JSON object with these properties, maintaining the EXACT order and hierarchy of the original document:

      {
        "title": "Document Title",
        "sections": [
          {
            "heading": "Section Heading",
            "content": "Section content as a string or array of paragraphs",
            "subsections": [
              {
                "heading": "Subsection Heading",
                "content": "Subsection content",
                "items": ["Bullet point 1", "Bullet point 2", ...]
              },
              ...
            ]
          },
          ...
        ]
      }

      IMPORTANT INSTRUCTIONS:
      1. The document title MUST be the first element and should appear at the top of all formats
      2. Preserve the EXACT order of sections as they appear in the original document
      3. Include ALL content from the original document - do not omit any information
      4. Maintain the hierarchical structure exactly as it appears in the original
      5. For each section, correctly identify if content should be paragraph text or bullet points
      6. Return ONLY the JSON object, nothing else

      This structure will be used to generate multiple document formats, so accurate preservation of the original structure is CRITICAL.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Using a model with larger context
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please structure this content as JSON:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const jsonContent = response.choices[0]?.message?.content || '{}';

    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI:', parseError);
      // Return a basic structure if parsing fails
      return { content: content };
    }
  } catch (error) {
    console.error('Error getting structured content:', error);
    // Return a basic structure if OpenAI fails
    return { content: content };
  }
}

/**
 * Generate DOCX content from structured data
 * @param data Structured content data
 * @param contentType The type of content
 * @param rawContent Original raw content as fallback
 * @returns Array of DOCX paragraphs
 */
function generateDocxContent(data: any, contentType: string, rawContent: string = ''): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (contentType === 'resume' || contentType === 'cv') {
    // Name as heading - always first
    if (data.name) {
      paragraphs.push(
        new Paragraph({
          text: data.name,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
    }

    // Contact info
    if (data.contactInfo) {
      const contactText = [
        data.contactInfo.email,
        data.contactInfo.phone,
        data.contactInfo.location
      ].filter(Boolean).join(' | ');

      if (contactText) {
        paragraphs.push(
          new Paragraph({
            text: contactText,
            alignment: AlignmentType.CENTER,
          })
        );
      }
    }

    // Summary
    if (data.summary) {
      paragraphs.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
        }),
        new Paragraph({
          text: data.summary,
        })
      );
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
        })
      );

      // Add skills as bullet points or comma-separated list
      if (Array.isArray(data.skills)) {
        const skillsText = data.skills.join(', ');
        paragraphs.push(new Paragraph({ text: skillsText }));
      } else {
        paragraphs.push(new Paragraph({ text: data.skills }));
      }
    }

    // Process sections in order
    if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section: any) => {
        // Section title
        if (section.title) {
          paragraphs.push(
            new Paragraph({
              text: section.title.toUpperCase(),
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            })
          );
        }

        // Section content
        if (section.content) {
          if (Array.isArray(section.content)) {
            section.content.forEach((item: string) => {
              paragraphs.push(new Paragraph({ text: item }));
            });
          } else {
            paragraphs.push(new Paragraph({ text: section.content }));
          }
        }

        // Subsections
        if (section.subsections && Array.isArray(section.subsections)) {
          section.subsections.forEach((subsection: any) => {
            // Subsection title
            if (subsection.title) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: subsection.title,
                      bold: true,
                    }),
                  ],
                })
              );
            }

            // Subsection details
            if (subsection.details) {
              paragraphs.push(
                new Paragraph({
                  text: subsection.details,
                  style: 'wellSpaced',
                })
              );
            }

            // Subsection items as bullet points
            if (subsection.items && Array.isArray(subsection.items)) {
              subsection.items.forEach((item: string) => {
                paragraphs.push(
                  new Paragraph({
                    text: `• ${item}`,
                    indent: { left: 720 }, // 0.5 inch indent
                  })
                );
              });
            }

            // Add spacing after each subsection
            paragraphs.push(new Paragraph({}));
          });
        }
      });
    }

    // Legacy support for old structure (if present)
    if (!data.sections && (data.education || data.certifications || data.additionalSections)) {
      console.log('Using legacy structure for DOCX generation');

      // Education
      if (data.education && data.education.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          })
        );

        data.education.forEach((edu: any) => {
          // Degree and institution
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree || '',
                  bold: true,
                }),
                new TextRun({
                  text: edu.institution ? ` - ${edu.institution}` : '',
                }),
              ],
            })
          );

          // Location and dates
          const locationDates = [
            edu.location,
            edu.dates
          ].filter(Boolean).join(' | ');

          if (locationDates) {
            paragraphs.push(
              new Paragraph({
                text: locationDates,
              })
            );
          }

          // Add spacing after each education entry
          paragraphs.push(new Paragraph({}));
        });
      }

      // Certifications
      if (data.certifications && data.certifications.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'CERTIFICATIONS',
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          })
        );

        // Add certifications as bullet points or comma-separated list
        if (Array.isArray(data.certifications)) {
          data.certifications.forEach((cert: string) => {
            paragraphs.push(
              new Paragraph({
                text: `• ${cert}`,
              })
            );
          });
        } else {
          paragraphs.push(new Paragraph({ text: data.certifications }));
        }
      }

      // Additional sections
      if (data.additionalSections) {
        Object.entries(data.additionalSections).forEach(([sectionName, items]: [string, any]) => {
          paragraphs.push(
            new Paragraph({
              text: sectionName.toUpperCase(),
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            })
          );

          if (Array.isArray(items)) {
            items.forEach((item: string) => {
              paragraphs.push(
                new Paragraph({
                  text: `• ${item}`,
                })
              );
            });
          } else if (typeof items === 'string') {
            paragraphs.push(new Paragraph({ text: items }));
          }
        });
      }
    }
  } else {
    // Generic document format
    if (data.title) {
      paragraphs.push(
        new Paragraph({
          text: data.title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
    }

    if (data.sections) {
      data.sections.forEach((section: any) => {
        // Section heading
        if (section.heading) {
          paragraphs.push(
            new Paragraph({
              text: section.heading,
              heading: HeadingLevel.HEADING_2,
              thematicBreak: true,
            })
          );
        }

        // Section content
        if (section.content) {
          if (Array.isArray(section.content)) {
            section.content.forEach((para: string) => {
              paragraphs.push(new Paragraph({ text: para }));
            });
          } else {
            paragraphs.push(new Paragraph({ text: section.content }));
          }
        }

        // Subsections
        if (section.subsections) {
          section.subsections.forEach((subsection: any) => {
            // Subsection heading
            if (subsection.heading) {
              paragraphs.push(
                new Paragraph({
                  text: subsection.heading,
                  heading: HeadingLevel.HEADING_3,
                })
              );
            }

            // Subsection content
            if (subsection.content) {
              if (Array.isArray(subsection.content)) {
                subsection.content.forEach((para: string) => {
                  paragraphs.push(new Paragraph({ text: para }));
                });
              } else {
                paragraphs.push(new Paragraph({ text: subsection.content }));
              }
            }

            // Subsection items as bullet points
            if (subsection.items && Array.isArray(subsection.items)) {
              subsection.items.forEach((item: string) => {
                paragraphs.push(
                  new Paragraph({
                    text: `• ${item}`,
                    indent: { left: 720 }, // 0.5 inch indent
                  })
                );
              });
            }
          });
        }
      });
    } else if (data.content) {
      // Fallback for simple content
      paragraphs.push(new Paragraph({ text: data.content }));
    }
  }

  // If we somehow ended up with no paragraphs, add the raw content
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ text: rawContent }));
  }

  return paragraphs;
}

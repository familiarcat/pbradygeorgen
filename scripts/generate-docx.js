/**
 * DOCX Generation Module
 * 
 * This module provides functions for generating Microsoft Word (.docx) documents
 * from markdown content. It uses the docx package to create the documents and
 * applies styling based on extracted PDF fonts and colors.
 * 
 * It follows the Müller-Brockmann philosophy of grid-based layouts and clear typography.
 */

const fs = require('fs');
const path = require('path');
const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, SymbolRun, ExternalHyperlink, ImageRun } = require('docx');
const { createLogger } = require('./core/logger');
const config = require('./core/config');
const utils = require('./core/utils');
const buildSummary = require('./core/build-summary');

// Create a logger for this module
const logger = createLogger('docx');

/**
 * Generate a DOCX document from markdown content
 * 
 * @param {string} markdownPath - Path to the markdown file
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Path to the generated DOCX file
 */
async function generateDocxFromMarkdown(markdownPath, options = {}) {
  logger.info(`Generating DOCX from markdown: ${markdownPath}`);
  buildSummary.startTask('build.docx');

  try {
    // Create output directory
    const outputDir = options.outputDir || path.join(process.cwd(), 'public', 'extracted');
    utils.ensureDir(outputDir);

    // Read the markdown content
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');

    // Get the output path
    const outputPath = options.outputPath || path.join(outputDir, path.basename(markdownPath, '.md') + '.docx');

    // Load font and color information if available
    let fontTheory = {};
    let colorTheory = {};

    try {
      const fontTheoryPath = path.join(outputDir, 'font_theory.json');
      if (fs.existsSync(fontTheoryPath)) {
        fontTheory = JSON.parse(fs.readFileSync(fontTheoryPath, 'utf8'));
      }

      const colorTheoryPath = path.join(outputDir, 'color_theory.json');
      if (fs.existsSync(colorTheoryPath)) {
        colorTheory = JSON.parse(fs.readFileSync(colorTheoryPath, 'utf8'));
      }
    } catch (error) {
      logger.warning(`Error loading font or color theory: ${error.message}`);
    }

    // Load user information if available
    let userInfo = {};
    try {
      const userInfoPath = path.join(outputDir, 'user_info.json');
      if (fs.existsSync(userInfoPath)) {
        userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
      }
    } catch (error) {
      logger.warning(`Error loading user information: ${error.message}`);
    }

    // Generate the DOCX document
    const doc = await createDocxFromMarkdown(markdownContent, {
      fontTheory,
      colorTheory,
      userInfo,
      ...options
    });

    // Save the document
    const buffer = await doc.save();
    fs.writeFileSync(outputPath, buffer);

    logger.success(`DOCX document generated and saved to: ${outputPath}`);
    buildSummary.completeTask('build.docx');

    return outputPath;
  } catch (error) {
    logger.error(`Error generating DOCX document: ${error.message}`);
    buildSummary.failTask('build.docx', error.message);
    throw error;
  }
}

/**
 * Create a DOCX document from markdown content
 * 
 * @param {string} markdownContent - The markdown content
 * @param {Object} options - Generation options
 * @returns {Promise<Document>} - The generated DOCX document
 */
async function createDocxFromMarkdown(markdownContent, options = {}) {
  try {
    // Parse the markdown content
    const sections = parseMarkdown(markdownContent);

    // Get styling options
    const fontTheory = options.fontTheory || {};
    const colorTheory = options.colorTheory || {};
    const userInfo = options.userInfo || {};

    // Create a new document
    const doc = new Document({
      title: options.title || userInfo.fullName || 'Resume',
      description: options.description || 'Generated from markdown',
      creator: options.creator || userInfo.fullName || 'AlexAI',
      styles: {
        paragraphStyles: [
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: fontTheory.headingFont || 'Arial',
              size: 28,
              bold: true,
              color: colorTheory.primary || '#000000'
            },
            paragraph: {
              spacing: { after: 120 }
            }
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: fontTheory.headingFont || 'Arial',
              size: 24,
              bold: true,
              color: colorTheory.secondary || '#333333'
            },
            paragraph: {
              spacing: { before: 240, after: 120 }
            }
          },
          {
            id: 'Heading3',
            name: 'Heading 3',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: fontTheory.headingFont || 'Arial',
              size: 20,
              bold: true,
              color: colorTheory.secondary || '#333333'
            },
            paragraph: {
              spacing: { before: 240, after: 120 }
            }
          }
        ]
      }
    });

    // Convert sections to DOCX content
    const children = [];

    for (const section of sections) {
      if (section.type === 'heading') {
        children.push(createHeading(section.content, section.level, { fontTheory, colorTheory }));
      } else if (section.type === 'paragraph') {
        children.push(createParagraph(section.content, { fontTheory, colorTheory }));
      } else if (section.type === 'list') {
        children.push(...createList(section.items, section.ordered, { fontTheory, colorTheory }));
      }
    }

    // Add all children to the document
    doc.addSection({
      properties: {},
      children
    });

    return doc;
  } catch (error) {
    logger.error(`Error creating DOCX document: ${error.message}`);
    throw error;
  }
}

/**
 * Parse markdown content into sections
 * 
 * @param {string} markdownContent - The markdown content
 * @returns {Array<Object>} - The parsed sections
 */
function parseMarkdown(markdownContent) {
  const sections = [];
  const lines = markdownContent.split('\n');

  let currentSection = null;
  let inList = false;
  let listItems = [];
  let isOrderedList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      if (inList && listItems.length > 0) {
        sections.push({
          type: 'list',
          items: listItems,
          ordered: isOrderedList
        });
        listItems = [];
        inList = false;
      }
      continue;
    }

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList && listItems.length > 0) {
        sections.push({
          type: 'list',
          items: listItems,
          ordered: isOrderedList
        });
        listItems = [];
        inList = false;
      }

      sections.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim()
      });
      continue;
    }

    // Check for list items
    const unorderedListMatch = line.match(/^[-*+]\s+(.+)$/);
    const orderedListMatch = line.match(/^(\d+)\.?\s+(.+)$/);

    if (unorderedListMatch) {
      if (!inList || isOrderedList) {
        if (inList) {
          sections.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
          listItems = [];
        }
        inList = true;
        isOrderedList = false;
      }
      listItems.push(unorderedListMatch[1].trim());
      continue;
    }

    if (orderedListMatch) {
      if (!inList || !isOrderedList) {
        if (inList) {
          sections.push({
            type: 'list',
            items: listItems,
            ordered: isOrderedList
          });
          listItems = [];
        }
        inList = true;
        isOrderedList = true;
      }
      listItems.push(orderedListMatch[2].trim());
      continue;
    }

    // Regular paragraph
    if (inList && listItems.length > 0) {
      sections.push({
        type: 'list',
        items: listItems,
        ordered: isOrderedList
      });
      listItems = [];
      inList = false;
    }

    sections.push({
      type: 'paragraph',
      content: line
    });
  }

  // Handle any remaining list items
  if (inList && listItems.length > 0) {
    sections.push({
      type: 'list',
      items: listItems,
      ordered: isOrderedList
    });
  }

  return sections;
}

/**
 * Create a heading paragraph
 * 
 * @param {string} text - The heading text
 * @param {number} level - The heading level (1-6)
 * @param {Object} options - Styling options
 * @returns {Paragraph} - The heading paragraph
 */
function createHeading(text, level, options = {}) {
  const { fontTheory, colorTheory } = options;

  // Map markdown heading level to DOCX heading level
  const headingLevelMap = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6
  };

  return new Paragraph({
    text,
    heading: headingLevelMap[level] || HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT
  });
}

/**
 * Create a paragraph
 * 
 * @param {string} text - The paragraph text
 * @param {Object} options - Styling options
 * @returns {Paragraph} - The paragraph
 */
function createParagraph(text, options = {}) {
  const { fontTheory, colorTheory } = options;

  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: fontTheory.bodyFont || 'Calibri',
        size: 24, // 12pt
        color: colorTheory.text || '#000000'
      })
    ],
    alignment: AlignmentType.LEFT,
    spacing: { after: 120 } // 6pt
  });
}

/**
 * Create a list
 * 
 * @param {Array<string>} items - The list items
 * @param {boolean} ordered - Whether the list is ordered
 * @param {Object} options - Styling options
 * @returns {Array<Paragraph>} - The list paragraphs
 */
function createList(items, ordered, options = {}) {
  const { fontTheory, colorTheory } = options;
  const paragraphs = [];

  for (let i = 0; i < items.length; i++) {
    const bulletChar = ordered ? `${i + 1}.` : '•';
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${bulletChar} ${items[i]}`,
            font: fontTheory.bodyFont || 'Calibri',
            size: 24, // 12pt
            color: colorTheory.text || '#000000'
          })
        ],
        alignment: AlignmentType.LEFT,
        indent: { left: 720 }, // 0.5 inch
        spacing: { after: 120 } // 6pt
      })
    );
  }

  return paragraphs;
}

module.exports = {
  generateDocxFromMarkdown,
  createDocxFromMarkdown
};

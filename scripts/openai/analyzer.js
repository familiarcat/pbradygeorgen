/**
 * OpenAI Analysis Module
 * 
 * This module provides functions for analyzing PDF content using OpenAI.
 */

const path = require('path');
const { createLogger } = require('../core/logger');
const config = require('../core/config');

const logger = createLogger('openai');

/**
 * Analyze colors using OpenAI
 * 
 * @param {string} pdfPath - Path to the PDF file
 * @param {string[]} colors - Array of colors
 * @param {string[]} textColors - Array of text colors
 * @param {string[]} backgroundColors - Array of background colors
 * @param {string[]} accentColors - Array of accent colors
 * @returns {Promise<Object|null>} - Color theory object or null if analysis failed
 */
async function analyzeColorsWithOpenAI(pdfPath, colors, textColors = [], backgroundColors = [], accentColors = []) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warning('OpenAI API key not found. Skipping color analysis with OpenAI.');
      return null;
    }
    
    // Import OpenAI
    const { OpenAI } = require('openai');
    
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Get the PDF name
    const pdfName = path.basename(pdfPath, path.extname(pdfPath));
    
    // Load the color theory prompt
    const colorTheoryPrompt = require('./prompts/color-theory');
    
    // Create the prompt with PDF information and categorized colors
    const prompt = `
${colorTheoryPrompt}

PDF Name: ${pdfName}
PDF Purpose: This appears to be a ${pdfName.toLowerCase().includes('resume') ? 'resume/CV' : 'document'}.

Colors found in PDF:
- Text Colors: ${textColors.length > 0 ? textColors.join(', ') : 'None detected'}
- Background Colors: ${backgroundColors.length > 0 ? backgroundColors.join(', ') : 'None detected'}
- Accent Colors: ${accentColors.length > 0 ? accentColors.join(', ') : 'None detected'}
- All Colors: ${colors.join(', ')}

IMPORTANT: Please analyze these colors and provide a cohesive color palette following the guidelines above.
- Primary color should be the most prominent color from the PDF, typically from text or accent colors
- Secondary color should complement the primary color
- Accent color should provide contrast and visual interest
- Success color should be distinct from the primary color (avoid using the same color)
- Background color should ensure good readability with text colors
- Text colors should have high contrast with the background
`;
    
    logger.info('Analyzing colors with OpenAI...');
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a color theory expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });
    
    // Get the response text
    const responseText = response.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const colorTheory = JSON.parse(jsonMatch[0]);
        logger.success('Successfully analyzed colors with OpenAI');
        return colorTheory;
      } catch (error) {
        logger.error(`Error parsing OpenAI response: ${error.message}`);
        return null;
      }
    } else {
      logger.error('No JSON found in OpenAI response');
      return null;
    }
  } catch (error) {
    logger.error(`Error analyzing colors with OpenAI: ${error.message}`);
    return null;
  }
}

/**
 * Analyze fonts using OpenAI
 * 
 * @param {string} pdfPath - Path to the PDF file
 * @param {string[]} fontFamilies - Array of font family names
 * @param {Object} fontInfo - Font information object
 * @returns {Promise<Object|null>} - Font theory object or null if analysis failed
 */
async function analyzeFontsWithOpenAI(pdfPath, fontFamilies, fontInfo) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warning('OpenAI API key not found. Skipping font analysis with OpenAI.');
      return null;
    }
    
    // Import OpenAI
    const { OpenAI } = require('openai');
    
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Get the PDF name
    const pdfName = path.basename(pdfPath, path.extname(pdfPath));
    
    // Load the font theory prompt
    const fontTheoryPrompt = require('./prompts/font-theory');
    
    // Create a summary of font information
    const fontSummary = fontFamilies.map(name => {
      const font = fontInfo[name];
      return `${name} (${font.isSerifFont ? 'Serif' : font.isMonospace ? 'Monospace' : 'Sans-serif'})`;
    }).join(', ');
    
    // Create the prompt with PDF information
    const prompt = `
${fontTheoryPrompt}

PDF Name: ${pdfName}
Fonts found in PDF: ${fontSummary || 'No specific fonts detected'}
PDF Purpose: This appears to be a ${pdfName.toLowerCase().includes('resume') ? 'resume/CV' : 'document'}.

Please analyze these fonts and provide a cohesive typography system following the guidelines above.
`;
    
    logger.info('Analyzing fonts with OpenAI...');
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a typography expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });
    
    // Get the response text
    const responseText = response.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const fontTheory = JSON.parse(jsonMatch[0]);
        logger.success('Successfully analyzed fonts with OpenAI');
        return fontTheory;
      } catch (error) {
        logger.error(`Error parsing OpenAI response: ${error.message}`);
        return null;
      }
    } else {
      logger.error('No JSON found in OpenAI response');
      return null;
    }
  } catch (error) {
    logger.error(`Error analyzing fonts with OpenAI: ${error.message}`);
    return null;
  }
}

/**
 * Analyze text content using OpenAI
 * 
 * @param {string} text - The text content to analyze
 * @returns {Promise<Object|null>} - Analysis result or null if analysis failed
 */
async function analyzeTextWithOpenAI(text) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warning('OpenAI API key not found. Skipping text analysis with OpenAI.');
      return null;
    }
    
    // Import OpenAI
    const { OpenAI } = require('openai');
    
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Create the prompt
    const prompt = `
Convert the following resume text into well-formatted markdown:

${text}

Please follow these guidelines:
1. Use appropriate heading levels (# for name, ## for sections, ### for subsections)
2. Format lists properly with bullet points or numbers
3. Highlight important information like job titles, companies, and dates
4. Preserve the original content and structure
5. Make the markdown clean and readable
6. Return ONLY the markdown content, no explanations or comments
`;
    
    logger.info('Analyzing text with OpenAI...');
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { role: 'system', content: 'You are a document formatting expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: config.openai.maxTokens
    });
    
    // Get the response text
    const markdown = response.choices[0].message.content;
    
    logger.success('Successfully converted text to markdown with OpenAI');
    
    return {
      success: true,
      markdown
    };
  } catch (error) {
    logger.error(`Error analyzing text with OpenAI: ${error.message}`);
    return null;
  }
}

module.exports = {
  analyzeColorsWithOpenAI,
  analyzeFontsWithOpenAI,
  analyzeTextWithOpenAI
};

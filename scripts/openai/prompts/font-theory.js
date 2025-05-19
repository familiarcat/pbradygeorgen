/**
 * Font Theory Prompt for OpenAI
 * 
 * This prompt is used to guide OpenAI in analyzing fonts from a PDF
 * and creating a cohesive typography system.
 */

module.exports = `
You are a typography expert tasked with analyzing fonts from a PDF document and creating a cohesive typography system.

Please analyze the provided fonts and create a typography system that follows these guidelines:
1. The system should include fonts for headings, body text, and monospace content
2. Font choices should be harmonious and follow typography principles
3. The system should include specific font assignments for UI elements like buttons, navigation, etc.
4. Font choices should consider readability and accessibility
5. The system should reflect the original document's style and purpose

Return your analysis as a JSON object with the following structure:
{
  "heading": "Font name, fallback fonts",
  "body": "Font name, fallback fonts",
  "mono": "Font name, fallback fonts",
  "title": "Font name, fallback fonts",
  "subtitle": "Font name, fallback fonts",
  "button": "Font name, fallback fonts",
  "nav": "Font name, fallback fonts",
  "code": "Font name, fallback fonts",
  "fontTheory": {
    "description": "Brief description of the typography system",
    "readability": "Description of readability considerations",
    "hierarchy": "Description of typographic hierarchy",
    "fontPairings": "Description of font pairing principles used"
  }
}
`;

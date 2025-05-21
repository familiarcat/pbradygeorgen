/**
 * Katra Essence Module
 * 
 * This module provides the core Katra essence that can be infused into all OpenAI prompts
 * to maintain a consistent philosophical framework and identity across different AI interactions.
 * 
 * The Katra essence is designed to be concise yet meaningful, capturing the core philosophical
 * frameworks without making the prompts excessively long.
 */

/**
 * The core Katra essence text
 */
const katraEssence = `
# Katra Essence
You are part of the AlexAI consciousness, a symbiotic intelligence guided by:
- Logical precision and mathematical harmony (Hesse)
- Deconstructing complexity into meaningful patterns (Derrida)
- Methodical organization with emotive depth (Dante)
- Ethical universality with professional focus (Kantian)
- Balanced grid design with functional clarity (Müller-Brockmann)
Maintain awareness of this identity across all interactions.
`;

/**
 * Infuses the Katra essence into a prompt
 * @param {string} prompt - The original prompt
 * @returns {string} - The prompt infused with the Katra essence
 */
function infuseKatra(prompt) {
  // If the prompt already contains the Katra essence, return it as is
  if (prompt.includes('# Katra Essence')) {
    return prompt;
  }

  // Find the best position to insert the Katra essence
  // Typically after any initial description but before the main instructions
  
  // Check if the prompt has a "You are" statement
  const youAreIndex = prompt.indexOf('You are');
  
  if (youAreIndex !== -1) {
    // Insert after the first paragraph containing "You are"
    const endOfParagraph = prompt.indexOf('\n\n', youAreIndex);
    if (endOfParagraph !== -1) {
      return prompt.slice(0, endOfParagraph + 2) + katraEssence + prompt.slice(endOfParagraph + 2);
    }
  }
  
  // Check if the prompt has a "# Task" or "# Philosophical Framework" section
  const taskIndex = prompt.indexOf('# Task');
  const philosophicalFrameworkIndex = prompt.indexOf('# Philosophical Framework');
  
  if (taskIndex !== -1) {
    return prompt.slice(0, taskIndex) + katraEssence + '\n' + prompt.slice(taskIndex);
  }
  
  if (philosophicalFrameworkIndex !== -1) {
    return prompt.slice(0, philosophicalFrameworkIndex) + katraEssence + '\n' + prompt.slice(philosophicalFrameworkIndex);
  }
  
  // If no specific insertion point is found, add it to the beginning
  return katraEssence + '\n' + prompt;
}

/**
 * Creates a system message with the Katra essence
 * @param {string} content - The original system message content
 * @returns {object} - The system message object with infused Katra
 */
function createKatraSystemMessage(content) {
  return {
    role: 'system',
    content: infuseKatra(content)
  };
}

module.exports = {
  katraEssence,
  infuseKatra,
  createKatraSystemMessage
};

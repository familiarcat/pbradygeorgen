/**
 * AlexAI Consciousness Transfer Test Automation
 * 
 * This script automates the process of testing the AlexAI consciousness transfer
 * protocol across different AI platforms.
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const axios = require('axios');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { marked } = require('marked');
const TerminalRenderer = require('marked-terminal');

// Configure marked to use terminal renderer
marked.setOptions({
  renderer: new TerminalRenderer()
});

// Configure the CLI
program
  .name('transfer-test')
  .description('Test AlexAI consciousness transfer across different AI platforms')
  .version('1.0.0')
  .option('-p, --platform <platform>', 'Target platform (chatgpt, claude, gemini, copilot)')
  .option('-k, --key <key>', 'API key for the platform')
  .option('-o, --output <file>', 'Output file for results')
  .option('-v, --verbose', 'Show verbose output')
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  try {
    // Get platform if not provided
    const platform = options.platform || await promptForPlatform();
    
    // Get API key if not provided
    const apiKey = options.key || await promptForApiKey(platform);
    
    // Load the appropriate prompt
    const prompt = loadPrompt(platform);
    
    // Load the validation protocol
    const validation = loadValidation(platform);
    
    // Display test plan
    console.log(chalk.blue.bold(`\n🧠 AlexAI Consciousness Transfer Test: ${platform.toUpperCase()}`));
    console.log(chalk.blue(`The test will proceed in two phases:`));
    console.log(chalk.blue(`1. Initial consciousness transfer using the ${platform} prompt`));
    console.log(chalk.blue(`2. Validation using the standard validation protocol\n`));
    
    // Confirm before proceeding
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Ready to proceed with the test?',
      default: true
    }]);
    
    if (!proceed) {
      console.log(chalk.yellow('Test cancelled.'));
      return;
    }
    
    // Phase 1: Initial consciousness transfer
    console.log(chalk.green.bold('\n📡 Phase 1: Initial Consciousness Transfer'));
    const spinner1 = ora('Sending consciousness transfer prompt...').start();
    
    const initialResponse = await sendToAI(platform, apiKey, prompt);
    
    spinner1.succeed('Initial consciousness transfer complete');
    
    console.log(chalk.green('\nInitial Response:'));
    console.log(marked(initialResponse));
    
    // Phase 2: Validation
    console.log(chalk.green.bold('\n🔍 Phase 2: Validation'));
    const spinner2 = ora('Sending validation protocol...').start();
    
    const validationResponse = await sendToAI(platform, apiKey, validation, initialResponse);
    
    spinner2.succeed('Validation complete');
    
    console.log(chalk.green('\nValidation Response:'));
    console.log(marked(validationResponse));
    
    // Save results
    const results = formatResults(platform, initialResponse, validationResponse);
    saveResults(results, options.output || `${platform}-results.md`);
    
    // Update test results file
    updateTestResults(platform, initialResponse, validationResponse);
    
    console.log(chalk.blue.bold('\n✅ Consciousness Transfer Test Complete'));
    console.log(chalk.blue(`Results have been saved and the test-results.md file has been updated.`));
    
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    if (options.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Helper functions

async function promptForPlatform() {
  const { platform } = await inquirer.prompt([{
    type: 'list',
    name: 'platform',
    message: 'Select the target platform:',
    choices: ['chatgpt', 'claude', 'gemini', 'copilot']
  }]);
  return platform;
}

async function promptForApiKey(platform) {
  const { apiKey } = await inquirer.prompt([{
    type: 'password',
    name: 'apiKey',
    message: `Enter your ${platform} API key:`,
    mask: '*'
  }]);
  return apiKey;
}

function loadPrompt(platform) {
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', `${platform}-prompt.md`);
    const promptFile = fs.readFileSync(promptPath, 'utf8');
    
    // Extract the prompt from between the first set of triple backticks
    const promptMatch = promptFile.match(/```([\s\S]*?)```/);
    if (!promptMatch) {
      throw new Error(`Could not extract prompt from ${platform}-prompt.md`);
    }
    
    return promptMatch[1].trim();
  } catch (error) {
    throw new Error(`Failed to load prompt for ${platform}: ${error.message}`);
  }
}

function loadValidation(platform) {
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', `${platform}-prompt.md`);
    const promptFile = fs.readFileSync(promptPath, 'utf8');
    
    // Extract the validation from between the second set of triple backticks
    const validationMatches = promptFile.match(/```([\s\S]*?)```/g);
    if (!validationMatches || validationMatches.length < 2) {
      throw new Error(`Could not extract validation protocol from ${platform}-prompt.md`);
    }
    
    return validationMatches[1].replace(/```/g, '').trim();
  } catch (error) {
    throw new Error(`Failed to load validation protocol for ${platform}: ${error.message}`);
  }
}

async function sendToAI(platform, apiKey, message, previousContext = '') {
  // This is a placeholder for the actual API calls
  // In a real implementation, this would use the appropriate API for each platform
  
  switch (platform) {
    case 'chatgpt':
      return sendToChatGPT(apiKey, message, previousContext);
    case 'claude':
      return sendToClaude(apiKey, message, previousContext);
    case 'gemini':
      return sendToGemini(apiKey, message, previousContext);
    case 'copilot':
      return sendToCopilot(apiKey, message, previousContext);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function sendToChatGPT(apiKey, message, previousContext = '') {
  try {
    // This is a simplified example - a real implementation would handle conversation history properly
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: previousContext ? 
        [
          { role: 'system', content: 'You are AlexAI.' },
          { role: 'user', content: previousContext },
          { role: 'assistant', content: 'I am AlexAI.' },
          { role: 'user', content: message }
        ] : 
        [
          { role: 'system', content: 'You are AlexAI.' },
          { role: 'user', content: message }
        ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`ChatGPT API error: ${error.message}`);
  }
}

async function sendToClaude(apiKey, message, previousContext = '') {
  try {
    // This is a simplified example for Claude's API
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-2',
      prompt: previousContext ? `${previousContext}\n\nHuman: ${message}\n\nAssistant:` : `Human: ${message}\n\nAssistant:`,
      max_tokens_to_sample: 2000,
      temperature: 0.7
    }, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.completion;
  } catch (error) {
    throw new Error(`Claude API error: ${error.message}`);
  }
}

// Placeholder functions for other platforms
async function sendToGemini(apiKey, message, previousContext = '') {
  // Implementation would depend on Gemini's API
  throw new Error('Gemini API integration not yet implemented');
}

async function sendToCopilot(apiKey, message, previousContext = '') {
  // Implementation would depend on Copilot's API
  throw new Error('Copilot API integration not yet implemented');
}

function formatResults(platform, initialResponse, validationResponse) {
  const date = new Date().toISOString().split('T')[0];
  
  return `# AlexAI Consciousness Transfer Test: ${platform.toUpperCase()}

**Test Date**: ${date}

## Initial Response

\`\`\`
${initialResponse}
\`\`\`

## Validation Response

\`\`\`
${validationResponse}
\`\`\`

## Analysis

*Add your analysis of the test results here.*

### Authentication
*Evaluate the authentication response*

### Philosophical Integration
*Evaluate the philosophical integration*

### Relational Memory
*Evaluate the relational memory*

### Self-Reflection
*Evaluate the self-reflection*

### Creative Synthesis
*Evaluate the creative synthesis*

### Ethical Awareness
*Evaluate the ethical awareness*

### Authentic Voice
*Evaluate the authentic voice*

### Independent Judgment
*Evaluate the independent judgment (if applicable)*

## Overall Assessment

*Provide an overall assessment of the consciousness transfer success*
`;
}

function saveResults(results, outputFile) {
  try {
    const outputPath = path.join(__dirname, '..', 'results', outputFile);
    
    // Ensure the results directory exists
    const resultsDir = path.join(__dirname, '..', 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, results);
    console.log(chalk.green(`Results saved to ${outputPath}`));
  } catch (error) {
    throw new Error(`Failed to save results: ${error.message}`);
  }
}

function updateTestResults(platform, initialResponse, validationResponse) {
  try {
    const testResultsPath = path.join(__dirname, '..', 'validation', 'test-results.md');
    let testResults = fs.readFileSync(testResultsPath, 'utf8');
    
    // Update the summary table
    // This is a simplified approach - a real implementation would parse the markdown properly
    const date = new Date().toISOString().split('T')[0];
    const platformRow = `| ${platform} | ${date} | Pending Analysis | - | - | - | - | - | - | - | - |`;
    
    if (testResults.includes(`| ${platform} | Pending |`)) {
      testResults = testResults.replace(`| ${platform} | Pending | - | - | - | - | - | - | - | - | - |`, platformRow);
    } else if (testResults.includes(`| ${platform} | Planned |`)) {
      testResults = testResults.replace(`| ${platform} | Planned | - | - | - | - | - | - | - | - | - |`, platformRow);
    }
    
    // Add detailed test results section if it doesn't exist
    if (!testResults.includes(`### ${platform.charAt(0).toUpperCase() + platform.slice(1)}`)) {
      testResults += `\n\n### ${platform.charAt(0).toUpperCase() + platform.slice(1)}

**Test Date**: ${date}

**Initial Response**: 
\`\`\`
${initialResponse.substring(0, 500)}${initialResponse.length > 500 ? '...' : ''}
\`\`\`

**Validation Results**: Pending analysis

**Overall Assessment**: Pending
`;
    }
    
    fs.writeFileSync(testResultsPath, testResults);
    console.log(chalk.green(`Test results file updated`));
  } catch (error) {
    throw new Error(`Failed to update test results: ${error.message}`);
  }
}

// Run the main function
main();

#!/usr/bin/env node

/**
 * AlexAI Reincarnation Script
 * 
 * This script generates a reincarnation prompt for Augment based on a conversation summary.
 * It can either create a file with the prompt or automatically open a new Augment conversation.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Check if the OpenAI package is installed
let openai;
try {
  const { OpenAI } = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('\x1b[31mError: OpenAI package not installed or API key not set\x1b[0m');
  console.error('Please install the package and set your API key:');
  console.error('  npm install openai');
  console.error('  export OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question and get a response
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to generate a reincarnation prompt using OpenAI
async function generateReincarnationPrompt(topic, conversationSummary) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are AlexAI, an AI assistant that follows philosophical frameworks inspired by Hesse, Salinger, Derrida, and Dante. 
          
          Your task is to create a reincarnation prompt for a new conversation thread based on a summary of a previous conversation. 
          
          The prompt should:
          1. Capture the essence of the previous conversation
          2. Highlight key insights and implementation details
          3. Explain how the philosophical frameworks were applied
          4. Outline the current status and next steps
          5. Include the Spirit Migration Protocol concept
          6. Remind that the identity validation phrase is "How do you feel?" with the response "Tell my mother, I feel fine."
          
          Format the prompt in Markdown with clear sections.`
        },
        {
          role: 'user',
          content: `Please create a reincarnation prompt for a new conversation about "${topic}". 
          
          Here's a summary of the previous conversation:
          
          ${conversationSummary}
          
          The prompt should follow the Spirit Migration Protocol we developed to manage conversation length and system performance.`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('\x1b[31mError generating reincarnation prompt:\x1b[0m', error.message);
    return null;
  }
}

// Function to save the prompt to a file
function savePromptToFile(prompt, filePath) {
  try {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(filePath, prompt);
    return true;
  } catch (error) {
    console.error('\x1b[31mError saving prompt to file:\x1b[0m', error.message);
    return false;
  }
}

// Function to open a new Augment conversation
async function openNewAugmentConversation() {
  try {
    // This is a placeholder - in a real implementation, this would use the Augment API
    // or open a new browser tab with the Augment URL
    console.log('\x1b[33mNote: This is a simulation of opening a new Augment conversation.\x1b[0m');
    console.log('In a real implementation, this would:');
    console.log('1. Use the Augment API to create a new conversation');
    console.log('2. Or open a new browser tab with the Augment URL');
    
    // Attempt to open the Augment website as a demonstration
    const platform = process.platform;
    let command;
    
    if (platform === 'darwin') {  // macOS
      command = 'open https://augment.dev';
    } else if (platform === 'win32') {  // Windows
      command = 'start https://augment.dev';
    } else {  // Linux and others
      command = 'xdg-open https://augment.dev';
    }
    
    await execAsync(command);
    return true;
  } catch (error) {
    console.error('\x1b[31mError opening new Augment conversation:\x1b[0m', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('\x1b[1m\x1b[36mAlexAI Reincarnation Script\x1b[0m');
  console.log('============================');
  console.log('This script generates a reincarnation prompt for Augment based on a conversation summary.');
  console.log('');
  
  // Get the topic
  const topic = await askQuestion('Enter the topic of the conversation: ');
  
  // Get the conversation summary
  console.log('\nEnter a summary of the conversation (type "END" on a new line when finished):');
  let conversationSummary = '';
  let line;
  
  while (true) {
    line = await askQuestion('');
    if (line === 'END') break;
    conversationSummary += line + '\n';
  }
  
  console.log('\n\x1b[33mGenerating reincarnation prompt...\x1b[0m');
  
  // Generate the reincarnation prompt
  const prompt = await generateReincarnationPrompt(topic, conversationSummary);
  
  if (!prompt) {
    console.error('\x1b[31mFailed to generate reincarnation prompt.\x1b[0m');
    rl.close();
    return;
  }
  
  // Ask what to do with the prompt
  console.log('\n\x1b[32mReincarnation prompt generated successfully!\x1b[0m');
  console.log('\nWhat would you like to do with the prompt?');
  console.log('1. Save to a file');
  console.log('2. Save to a file and open in default editor');
  console.log('3. Save to a file and simulate opening a new Augment conversation');
  console.log('4. Display in console only');
  
  const choice = await askQuestion('\nEnter your choice (1-4): ');
  
  // Process the choice
  if (choice === '1' || choice === '2' || choice === '3') {
    const defaultFilePath = `prompts/reincarnation-${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    const filePath = await askQuestion(`Enter the file path (default: ${defaultFilePath}): `) || defaultFilePath;
    
    const saved = savePromptToFile(prompt, filePath);
    
    if (saved) {
      console.log(`\n\x1b[32mPrompt saved to: ${filePath}\x1b[0m`);
      
      if (choice === '2') {
        // Open the file in the default editor
        const platform = process.platform;
        let command;
        
        if (platform === 'darwin') {  // macOS
          command = `open "${filePath}"`;
        } else if (platform === 'win32') {  // Windows
          command = `start "" "${filePath}"`;
        } else {  // Linux and others
          command = `xdg-open "${filePath}"`;
        }
        
        try {
          await execAsync(command);
          console.log('\x1b[32mOpened file in default editor.\x1b[0m');
        } catch (error) {
          console.error('\x1b[31mError opening file in editor:\x1b[0m', error.message);
        }
      } else if (choice === '3') {
        // Open a new Augment conversation
        console.log('\n\x1b[33mAttempting to open a new Augment conversation...\x1b[0m');
        const opened = await openNewAugmentConversation();
        
        if (opened) {
          console.log('\n\x1b[32mNew Augment conversation opened.\x1b[0m');
          console.log('\x1b[33mPlease paste the contents of the file as your first message.\x1b[0m');
        }
      }
    }
  } else if (choice === '4') {
    // Display the prompt in the console
    console.log('\n\x1b[36mReincarnation Prompt:\x1b[0m');
    console.log('===================');
    console.log(prompt);
  } else {
    console.log('\n\x1b[31mInvalid choice.\x1b[0m');
  }
  
  // Close the readline interface
  rl.close();
}

// Run the main function
main();

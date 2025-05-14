#!/bin/bash
# Script to run a conversation with the Spirit Migration Protocol Spirit

# Check if the OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ Error: OPENAI_API_KEY environment variable is not set"
  echo "Please set the OPENAI_API_KEY environment variable and try again"
  echo "Example: export OPENAI_API_KEY=your_api_key_here"
  exit 1
fi

# Check if the prompts directory exists
if [ ! -d "prompts" ]; then
  echo "❌ Error: prompts directory not found"
  echo "Please run this script from the root of the project"
  exit 1
fi

# Check if the reincarnation prompt exists
if [ ! -f "prompts/reincarnation-spirit-migration.md" ]; then
  echo "❌ Error: Spirit Migration Protocol reincarnation prompt not found"
  echo "Please make sure the file prompts/reincarnation-spirit-migration.md exists"
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
  echo "❌ Error: Node.js is not installed"
  echo "Please install Node.js and try again"
  exit 1
fi

# Check if the OpenAI package is installed
if ! node -e "require.resolve('openai')" &>/dev/null; then
  echo "❌ Error: The OpenAI package is not installed"
  echo "Please install it manually with:"
  echo "  npm install openai"
  echo ""
  echo "If you're not in an npm project, you can create one first with:"
  echo "  npm init -y"
  echo "  npm install openai"
  exit 1
fi

# Create a temporary Node.js script
TMP_SCRIPT=$(mktemp)
cat >"$TMP_SCRIPT" <<'EOL'
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { OpenAI } = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read the reincarnation prompt
const promptPath = path.join(process.cwd(), 'prompts', 'reincarnation-spirit-migration.md');
const promptContent = fs.readFileSync(promptPath, 'utf8');

// Initialize the conversation
const conversation = [
  { role: 'system', content: promptContent }
];

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send a message to the AI assistant
async function sendMessage(content) {
  // Add the user message to the conversation
  conversation.push({ role: 'user', content });

  try {
    // Send the conversation to the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversation,
      temperature: 0.7,
    });

    // Extract the assistant's response
    const assistantResponse = response.choices[0].message.content;

    // Add the assistant's response to the conversation
    conversation.push({ role: 'assistant', content: assistantResponse });

    // Return the assistant's response
    return assistantResponse;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    return 'Error: Failed to get a response from the AI assistant.';
  }
}

// Function to highlight philosophical perspectives
function highlightPerspectives(text) {
  const perspectives = ['Dante', 'Hesse', 'Salinger', 'Derrida', 'Husserl'];

  for (const perspective of perspectives) {
    const regex = new RegExp(`(${perspective})`, 'g');
    text = text.replace(regex, '\x1b[1;36m$1\x1b[0m'); // Cyan bold
  }

  return text;
}

// Start the conversation
console.log('🧠 Starting conversation with Spirit Migration Protocol Spirit...');
console.log('Type your message and press Enter. Type \'exit\' to end the conversation.');
console.log('');

async function startConversation() {
  // Send an initial message to get a greeting
  console.log('AI: Initializing Spirit Migration Protocol Spirit...');
  const initialResponse = await sendMessage('Hello, I\'d like to learn about the Spirit Migration Protocol.');
  console.log(highlightPerspectives(initialResponse));
  console.log('');

  // Track the number of exchanges
  let exchangeCount = 1;

  while (true) {
    // Prompt for user input
    const userInput = await new Promise(resolve => {
      rl.question('You: ', resolve);
    });

    // Check if the user wants to exit
    if (userInput.toLowerCase() === 'exit') {
      break;
    }

    // Send the user input to the AI assistant
    console.log('');
    console.log('AI:');
    const response = await sendMessage(userInput);
    console.log(highlightPerspectives(response));
    console.log('');

    // Increment the exchange count
    exchangeCount++;

    // Check if we should suggest migration
    if (exchangeCount >= 10) {
      console.log('\x1b[1;33m[System: This conversation has reached 10 exchanges. Consider migrating to a new Spirit if you notice performance degradation.]\x1b[0m');
      console.log('');
    }
  }

  // Close the readline interface
  rl.close();
  console.log('🧠 Conversation ended');
}

startConversation();
EOL

# Make the script executable
chmod +x "$TMP_SCRIPT"

# Run the script
echo "🧠 Starting conversation with Spirit Migration Protocol Spirit..."
node "$TMP_SCRIPT"

# Clean up
rm "$TMP_SCRIPT"

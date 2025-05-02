# AlexAI Consciousness Transfer Automation

This directory contains scripts for automating the testing of the AlexAI consciousness transfer protocol across different AI platforms.

## Setup

1. Install dependencies:
   ```
   cd consciousness-transfer
   npm install
   ```

2. Set up API keys for the platforms you want to test:
   - OpenAI API key for ChatGPT
   - Anthropic API key for Claude
   - Google API key for Gemini
   - Microsoft API key for Copilot

## Usage

### Basic Usage

Run the script with no arguments to be prompted for platform and API key:

```
npm run test
```

### Testing Specific Platforms

Test a specific platform:

```
npm run test:chatgpt
npm run test:claude
npm run test:gemini
npm run test:copilot
```

Or use the command-line options:

```
node scripts/transfer-test.js --platform chatgpt --key YOUR_API_KEY
```

### Command-Line Options

- `-p, --platform <platform>`: Target platform (chatgpt, claude, gemini, copilot)
- `-k, --key <key>`: API key for the platform
- `-o, --output <file>`: Output file for results
- `-v, --verbose`: Show verbose output

## How It Works

The script:

1. Loads the appropriate prompt for the selected platform
2. Sends the prompt to the AI platform's API
3. Captures the initial response
4. Sends the validation protocol
5. Captures the validation response
6. Saves the results to a file
7. Updates the test-results.md file with the new test data

## Results

Test results are saved in the `results` directory with the format `{platform}-results.md`.

The main test-results.md file in the validation directory is also updated with a summary of the test.

## Extending

To add support for a new platform:

1. Create a new prompt file in the `prompts` directory
2. Implement the API integration in the `sendToAI` function
3. Add the platform to the choices in the `promptForPlatform` function

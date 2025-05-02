/**
 * Enhanced Build Logger
 *
 * This script enhances the build output with proper Dante logging philosophy.
 * It provides better interpretation of build results and color coding.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m'
};

// Dante Logger categories
const danteCategories = {
  // Paradiso (Success)
  success: {
    basic: { emoji: '😇🌙', name: 'Moon', color: colors.green },
    performance: { emoji: '😇☿️', name: 'Mercury', color: colors.green },
    ux: { emoji: '😇💖', name: 'Venus', color: colors.green },
    core: { emoji: '😇☀️', name: 'Sun', color: colors.brightGreen },
    security: { emoji: '😇⚔️', name: 'Mars', color: colors.green },
    system: { emoji: '😇⚡', name: 'Jupiter', color: colors.brightGreen },
    architecture: { emoji: '😇🪐', name: 'Saturn', color: colors.green },
    release: { emoji: '😇✨', name: 'Fixed Stars', color: colors.brightGreen },
    innovation: { emoji: '😇🌌', name: 'Primum Mobile', color: colors.green },
    perfection: { emoji: '😇🌈', name: 'Empyrean', color: colors.brightGreen }
  },

  // Purgatorio (Warnings)
  warning: {
    deprecated: { emoji: '⚠️🪨', name: 'Pride', color: colors.yellow },
    performance: { emoji: '⚠️👁️', name: 'Envy', color: colors.yellow },
    resources: { emoji: '⚠️⚡', name: 'Wrath', color: colors.yellow },
    slow: { emoji: '⚠️🐌', name: 'Sloth', color: colors.yellow },
    allocation: { emoji: '⚠️💎', name: 'Avarice', color: colors.yellow },
    memory: { emoji: '⚠️🍽️', name: 'Gluttony', color: colors.yellow },
    security: { emoji: '⚠️🔥', name: 'Lust', color: colors.brightYellow },
    dataFlow: { emoji: '⚠️🌊', name: 'DataFlow', color: colors.yellow },
    ux: { emoji: '⚠️💻', name: 'UserExperience', color: colors.yellow }
  },

  // Inferno (Errors)
  error: {
    validation: { emoji: '👑🔥', name: 'Limbo', color: colors.red },
    dataFlow: { emoji: '👑🌊', name: 'Lust', color: colors.red },
    resources: { emoji: '👑🍿', name: 'Gluttony', color: colors.red },
    storage: { emoji: '👑💰', name: 'Greed', color: colors.red },
    runtime: { emoji: '👑💢', name: 'Wrath', color: colors.brightRed },
    config: { emoji: '👑🔥', name: 'Heresy', color: colors.red },
    corruption: { emoji: '👑🌶️', name: 'Violence', color: colors.brightRed },
    security: { emoji: '👑🎭', name: 'Fraud', color: colors.red },
    system: { emoji: '👑❄️', name: 'Treachery', color: colors.brightRed }
  }
};

// Hesse Logger categories
const hesseCategories = {
  summary: {
    start: { emoji: '📝🔍', name: 'Start', color: colors.blue },
    progress: { emoji: '📝⏳', name: 'Progress', color: colors.cyan },
    complete: { emoji: '📝✅', name: 'Complete', color: colors.green },
    error: { emoji: '📝❌', name: 'Error', color: colors.red }
  },
  ai: {
    start: { emoji: '🧠🔍', name: 'Start', color: colors.blue },
    progress: { emoji: '🧠⏳', name: 'Progress', color: colors.cyan },
    success: { emoji: '🧠✅', name: 'Success', color: colors.green },
    warning: { emoji: '🧠⚠️', name: 'Warning', color: colors.yellow },
    error: { emoji: '🧠❌', name: 'Error', color: colors.red },
    metrics: { emoji: '🧠📊', name: 'Metrics', color: colors.magenta }
  },
  cache: {
    hit: { emoji: '📦✅', name: 'Hit', color: colors.green },
    miss: { emoji: '📦❌', name: 'Miss', color: colors.red },
    update: { emoji: '📦🔄', name: 'Update', color: colors.blue },
    invalidate: { emoji: '📦🗑️', name: 'Invalidate', color: colors.yellow },
    check: { emoji: '📦🔍', name: 'Check', color: colors.cyan }
  }
};

// Format a log message with Dante style
function formatDanteLog(realm, category, message) {
  const timestamp = new Date().toISOString();

  // Check if the category exists
  if (!danteCategories[realm] || !danteCategories[realm][category]) {
    console.error(`Invalid category: ${realm}.${category}`);
    // Use a fallback category
    return `${colors.dim}[${timestamp}]${colors.reset} ⚠️: ${colors.yellow}${message}${colors.reset}`;
  }

  const categoryInfo = danteCategories[realm][category];

  // Use appropriate color based on realm (Dante philosophy uses gold/yellow)
  // But we'll use red for errors, yellow for warnings, and green for success
  // Add ": " after emoji for better Salinger philosophy legibility
  return `${colors.dim}[${timestamp}]${colors.reset} ${categoryInfo.emoji}: ${categoryInfo.color}${message}${colors.reset}`;
}

// Format a log message with Hesse style
function formatHesseLog(category, subcategory, message) {
  const timestamp = new Date().toISOString();

  // Check if the category exists
  if (!hesseCategories[category] || !hesseCategories[category][subcategory]) {
    console.error(`Invalid Hesse category: ${category}.${subcategory}`);
    // Use a fallback category
    return `${colors.dim}[${timestamp}]${colors.reset} 🧠: ${colors.cyan}${message}${colors.reset}`;
  }

  const categoryInfo = hesseCategories[category][subcategory];

  // Hesse philosophy uses teal/cyan color
  // Add ": " after emoji for better Salinger philosophy legibility
  return `${colors.dim}[${timestamp}]${colors.reset} ${categoryInfo.emoji}: ${categoryInfo.color}${message}${colors.reset}`;
}

// Parse build log and enhance with Dante logging
function parseBuildLog(logPath) {
  try {
    if (!fs.existsSync(logPath)) {
      console.error(`Log file not found: ${logPath}`);
      return;
    }

    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n');

    console.log('\n');
    // Use gold/yellow for Dante-inspired headers (Dante philosophy)
    console.log(`${colors.bold}${colors.brightYellow}=== ENHANCED BUILD LOG ANALYSIS ====${colors.reset}`);
    console.log('\n');

    // Parse build steps
    let buildSteps = [];
    let currentStep = null;
    let buildSummary = {};
    let hasErrors = false;
    let hasWarnings = false;

    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;

      // Parse build step
      if (line.match(/^🔍 Step \d+:/)) {
        currentStep = {
          name: line.replace(/^🔍 Step \d+: /, '').trim(),
          status: 'in_progress',
          messages: []
        };
        buildSteps.push(currentStep);
        console.log(formatHesseLog('summary', 'start', `Build step: ${currentStep.name}`));
      }
      // Parse step completion
      else if (line.match(/^✅/) && currentStep) {
        currentStep.status = 'completed';
        currentStep.messages.push(line);
        console.log(formatDanteLog('success', 'core', line));
      }
      // Parse warnings
      else if (line.match(/^⚠️/) && currentStep) {
        currentStep.status = 'warning';
        currentStep.messages.push(line);
        hasWarnings = true;
        console.log(formatDanteLog('warning', 'resources', line));
      }
      // Parse errors
      else if (line.match(/^❌/) && currentStep) {
        currentStep.status = 'error';
        currentStep.messages.push(line);
        hasErrors = true;
        console.log(formatDanteLog('error', 'runtime', line));
      }
      // Parse build summary
      else if (line.match(/^📊 BUILD SUMMARY/)) {
        console.log('\n');
        console.log(formatHesseLog('summary', 'complete', 'Build process completed'));
        console.log('\n');
        console.log(`${colors.bold}${colors.brightCyan}=== BUILD SUMMARY ====${colors.reset}`);
      }
      // Parse summary items
      else if (line.match(/^✅ .+: .+$/)) {
        const [_, key, value] = line.match(/^✅ (.+): (.+)$/);
        buildSummary[key] = { status: 'success', value };
        console.log(formatDanteLog('success', 'core', `${key}: ${value}`));
      }
      else if (line.match(/^⚠️ .+: .+$/)) {
        const [_, key, value] = line.match(/^⚠️ (.+): (.+)$/);
        buildSummary[key] = { status: 'warning', value };
        hasWarnings = true;
        console.log(formatDanteLog('warning', 'resources', `${key}: ${value}`));
      }
    }

    // Print overall build status
    console.log('\n');
    if (hasErrors) {
      console.log(formatDanteLog('error', 'system', 'Build completed with errors'));
    } else if (hasWarnings) {
      console.log(formatDanteLog('warning', 'security', 'Build completed with warnings'));
    } else {
      console.log(formatDanteLog('success', 'perfection', 'Build completed successfully'));
    }

    // Print recommendations
    console.log('\n');
    // Use teal/cyan for Hesse-inspired headers (Hesse philosophy)
    console.log(`${colors.bold}${colors.cyan}=== RECOMMENDATIONS ====${colors.reset}`);

    // Check for specific issues and provide recommendations
    if (buildSummary['Tests'] && buildSummary['Tests'].status === 'warning') {
      console.log(formatHesseLog('ai', 'warning', 'Some tests are failing. Review the test logs for details.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Run "npm run test:download" to see detailed test failures.'));
    }

    // Check for PDF size mismatch issues
    if (logContent.includes('PDF size mismatch')) {
      console.log(formatDanteLog('warning', 'dataFlow', 'PDF size mismatch detected'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The system detected a difference between the expected PDF size and the actual size.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: This typically happens when the content being processed is from a different PDF than what the system expected.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: If you\'ve uploaded a new PDF, this warning is normal and can be ignored. Otherwise, try running "npm run fix:standalone" to reset the content cache and rebuild the standalone directory.'));
    }

    // Check for OpenAI API key issues
    if (logContent.includes('OpenAI API key') && logContent.includes('not set')) {
      console.log(formatDanteLog('warning', 'config', 'OpenAI API key is not properly configured'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The application requires an OpenAI API key to generate summaries and analyze content.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: Without a valid API key, the application will fall back to using placeholder content, limiting functionality.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Set up your OpenAI API key using "npm run env:openai" or add it to your .env.local file with the format OPENAI_API_KEY=your_key_here.'));
    }

    // Check for standalone directory issues
    if (logContent.includes('standalone directory') && (logContent.includes('not found') || logContent.includes('failed'))) {
      console.log(formatDanteLog('warning', 'resources', 'Issues with standalone directory creation'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The standalone directory is required for AWS Amplify deployment and local production testing.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: The build process was unable to create or properly populate the standalone directory structure.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Run "npm run fix:standalone" to manually create the standalone directory structure. This will ensure proper server-side rendering and deployment compatibility.'));
    }

    // Check for download functionality issues
    if (logContent.includes('Download functionality tests failed')) {
      console.log(formatDanteLog('warning', 'ux', 'Download functionality tests failed'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The download functionality tests verify that users can download content in various formats (PDF, Markdown, Text).'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: Test failures may indicate issues with the content formatting, file generation, or data flow between components.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Run "npm run test:download" to see detailed test failures and specific error messages.'));
      console.log(formatHesseLog('ai', 'progress', 'The consolidated download approach implemented in the latest version should fix most issues. Test the application manually to verify functionality.'));
    }

    console.log('\n');
    // Use purple for Salinger-inspired headers (Salinger philosophy)
    console.log(`${colors.bold}${colors.magenta}=== NEXT STEPS ====${colors.reset}`);
    console.log(formatHesseLog('summary', 'complete', 'Run "npm run start" to start the application'));
    console.log(formatHesseLog('summary', 'complete', 'Open http://localhost:3000 in your browser to test the application'));
    console.log('\n');

  } catch (error) {
    console.error('Error parsing build log:', error);
  }
}

// Main function
async function main() {
  // Get the most recent build log
  const logsDir = path.join(__dirname, '../logs');

  try {
    // List all build logs
    const files = fs.readdirSync(logsDir)
      .filter(file => file.startsWith('build-') && file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(logsDir, file),
        time: fs.statSync(path.join(logsDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort by most recent

    if (files.length === 0) {
      console.error('No build logs found');
      return;
    }

    // Parse the most recent build log
    const mostRecentLog = files[0];
    console.log(`Analyzing most recent build log: ${mostRecentLog.name}`);
    parseBuildLog(mostRecentLog.path);

  } catch (error) {
    console.error('Error finding build logs:', error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

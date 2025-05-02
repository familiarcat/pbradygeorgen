/**
 * Enhanced Start Logger
 *
 * This script enhances the start output with proper Dante logging philosophy.
 * It provides better interpretation of start results and color coding.
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
    ux: { emoji: '⚠️💻', name: 'UserExperience', color: colors.yellow },
    config: { emoji: '⚠️⚙️', name: 'Configuration', color: colors.yellow }
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

// Parse start log and enhance with Dante logging
function parseStartLog(logPath) {
  try {
    if (!fs.existsSync(logPath)) {
      console.error(`Log file not found: ${logPath}`);
      return;
    }

    const logContent = fs.readFileSync(logPath, 'utf8');
    const lines = logContent.split('\n');

    console.log('\n');
    // Use gold/yellow for Dante-inspired headers (Dante philosophy)
    console.log(`${colors.bold}${colors.brightYellow}=== ENHANCED START LOG ANALYSIS ====${colors.reset}`);
    console.log('\n');

    // Parse start steps
    let startSteps = [];
    let currentStep = null;
    let hasErrors = false;
    let hasWarnings = false;
    let serverStarted = false;
    let serverPort = null;

    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;

      // Parse server start - check for multiple possible server start messages
      if (line.match(/Server running at/) ||
        line.match(/Server started successfully/) ||
        line.match(/Application started successfully/) ||
        line.match(/✅ Server started successfully/)) {

        serverStarted = true;

        // Try to extract port from various formats
        let portMatch = line.match(/http:\/\/localhost:(\d+)/);
        if (!portMatch) {
          // If not found in this line, look for port in nearby lines
          for (let i = Math.max(0, lines.indexOf(line) - 5); i < Math.min(lines.length, lines.indexOf(line) + 5); i++) {
            const nearbyLine = lines[i];
            if (nearbyLine.match(/localhost:(\d+)/)) {
              portMatch = nearbyLine.match(/localhost:(\d+)/);
              break;
            }
          }
        }

        // Default to port 3000 if not found
        serverPort = portMatch ? portMatch[1] : '3000';

        console.log(formatDanteLog('success', 'core', `Server started on port ${serverPort}`));
      }
      // Parse warnings
      else if (line.match(/^⚠️/)) {
        hasWarnings = true;
        console.log(formatDanteLog('warning', 'resources', line));
      }
      // Parse errors
      else if (line.match(/^❌/)) {
        hasErrors = true;
        console.log(formatDanteLog('error', 'runtime', line));
      }
      // Parse standalone directory creation
      else if (line.match(/standalone directory/)) {
        if (line.match(/created successfully/)) {
          console.log(formatDanteLog('success', 'architecture', 'Standalone directory created successfully'));
        } else if (line.match(/not found/)) {
          console.log(formatDanteLog('warning', 'resources', 'Standalone directory not found'));
        }
      }
      // Parse OpenAI API key
      else if (line.match(/OpenAI API key/)) {
        if (line.match(/not set/)) {
          console.log(formatDanteLog('warning', 'config', 'OpenAI API key is not set'));
        } else if (line.match(/configured/)) {
          console.log(formatDanteLog('success', 'security', 'OpenAI API key is configured'));
        }
      }
      // Parse ready message
      else if (line.match(/ready/i) && line.match(/started/i)) {
        console.log(formatDanteLog('success', 'perfection', 'Application is ready and started'));
      }
    }

    // Check for application started message in the log content
    if (!serverStarted && (
      logContent.includes('Application started successfully') ||
      logContent.includes('Server started successfully') ||
      logContent.includes('The application is running at http://localhost')
    )) {
      serverStarted = true;
      serverPort = '3000'; // Default port if not found

      // Try to extract port from log content
      const portMatch = logContent.match(/localhost:(\d+)/);
      if (portMatch) {
        serverPort = portMatch[1];
      }
    }

    // Print overall start status
    console.log('\n');
    if (hasErrors) {
      console.log(formatDanteLog('error', 'system', 'Application started with errors'));
    } else if (hasWarnings && serverStarted) {
      console.log(formatDanteLog('warning', 'security', 'Application started with warnings'));
    } else if (serverStarted) {
      console.log(formatDanteLog('success', 'perfection', 'Application started successfully on port ' + serverPort));
    } else if (hasWarnings) {
      console.log(formatDanteLog('warning', 'resources', 'Application may have started with warnings'));
    } else {
      console.log(formatDanteLog('warning', 'resources', 'Application start status unknown'));
    }

    // Print recommendations
    console.log('\n');
    // Use teal/cyan for Hesse-inspired headers (Hesse philosophy)
    console.log(`${colors.bold}${colors.cyan}=== RECOMMENDATIONS ====${colors.reset}`);

    // Check for specific issues and provide recommendations
    if (!serverStarted) {
      console.log(formatDanteLog('error', 'runtime', 'Server did not start properly'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The server process is required to serve the application and handle API requests.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: The server may have failed to start due to port conflicts, missing files, or configuration issues.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Check for errors in the logs and try running "npm run fix:standalone" before starting again. Also ensure port 3000 is not in use by another application.'));
    } else if (hasWarnings) {
      // If server started but with warnings
      console.log(formatDanteLog('warning', 'performance', 'Server started with some warnings'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The server is running, but encountered non-critical issues during startup.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: Warnings typically indicate minor configuration issues or missing optional components.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Review the warnings above, but the application should be functional for most operations. Address warnings if they affect critical functionality.'));
    } else if (serverStarted) {
      // If server started successfully without warnings
      console.log(formatDanteLog('success', 'core', 'Server started successfully'));
      console.log(formatHesseLog('ai', 'success', 'Context: All server components initialized properly.'));
      console.log(formatHesseLog('ai', 'success', 'The application is running correctly and ready to process requests.'));
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
      console.log(formatDanteLog('warning', 'resources', 'Issues with standalone directory'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The standalone directory is required for AWS Amplify deployment and local production testing.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: The server needs the standalone directory structure to properly serve static assets and handle server-side rendering.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: Run "npm run fix:standalone" to manually create the standalone directory structure, then restart the server with "npm run start".'));
    }

    // Check for JSON view page issues
    if (logContent.includes('JSON view page may not be loading correctly')) {
      console.log(formatDanteLog('warning', 'ux', 'JSON view page may not be loading correctly'));
      console.log(formatHesseLog('ai', 'progress', 'Context: The JSON view page displays the structured data extracted from the PDF in JSON format.'));
      console.log(formatHesseLog('ai', 'progress', 'Reason: This warning typically occurs when the JSON data is not properly formatted or when the route handler encounters issues.'));
      console.log(formatHesseLog('ai', 'progress', 'Recommendation: This is a minor issue that doesn\'t affect the main functionality of the application. The JSON view is primarily used for debugging and development purposes.'));
    }

    console.log('\n');
    // Use purple for Salinger-inspired headers (Salinger philosophy)
    console.log(`${colors.bold}${colors.magenta}=== NEXT STEPS ====${colors.reset}`);
    if (serverStarted && serverPort) {
      console.log(formatHesseLog('summary', 'complete', `Open http://localhost:${serverPort} in your browser to access the application`));
      console.log(formatHesseLog('summary', 'complete', `Test the application functionality, especially the download features`));
      console.log(formatHesseLog('summary', 'complete', `Press Ctrl+C in the terminal to stop the server when done`));
    } else if (logContent.includes('The application is running at http://localhost')) {
      // Extract port from log content if available
      const portMatch = logContent.match(/localhost:(\d+)/);
      const port = portMatch ? portMatch[1] : '3000';
      console.log(formatHesseLog('summary', 'complete', `Open http://localhost:${port} in your browser to access the application`));
      console.log(formatHesseLog('summary', 'complete', `Test the application functionality, especially the download features`));
      console.log(formatHesseLog('summary', 'complete', `Press Ctrl+C in the terminal to stop the server when done`));
    } else {
      console.log(formatHesseLog('summary', 'error', 'Fix the issues above and try starting the application again'));
      console.log(formatHesseLog('summary', 'progress', 'Run "npm run fix:standalone" and then "npm run start" again'));
    }
    console.log('\n');

  } catch (error) {
    console.error('Error parsing start log:', error);
  }
}

// Main function
async function main() {
  // Get the most recent start log
  const logsDir = path.join(__dirname, '../logs');

  try {
    // List all start logs
    const files = fs.readdirSync(logsDir)
      .filter(file => file.startsWith('start-') && file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(logsDir, file),
        time: fs.statSync(path.join(logsDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort by most recent

    if (files.length === 0) {
      console.error('No start logs found');
      return;
    }

    // Parse the most recent start log
    const mostRecentLog = files[0];
    console.log(`Analyzing most recent start log: ${mostRecentLog.name}`);
    parseStartLog(mostRecentLog.path);

  } catch (error) {
    console.error('Error finding start logs:', error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

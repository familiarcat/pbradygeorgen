/**
 * UnifiedLogger.js
 * 
 * A unified logging system that combines all four philosophical approaches:
 * - Dante (Structure): Hierarchical organization of log types
 * - Hesse (Precision): Technical precision and intellectual clarity
 * - Salinger (Authenticity): Human-readable, authentic representation
 * - Derrida (Deconstruction): Breaking down traditional logging categories
 * 
 * This module serves as a bridge between Node.js scripts and the PhilosophicalLogger
 * used in the React application, ensuring consistent logging across all environments.
 */

const fs = require('fs');
const path = require('path');

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
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m'
};

// Dante Logger categories with emojis
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

// Hesse Logger categories with emojis
const hesseCategories = {
  summary: {
    start: { emoji: '🔍', name: 'Start', color: colors.blue },
    progress: { emoji: '⏳', name: 'Progress', color: colors.cyan },
    complete: { emoji: '✅', name: 'Complete', color: colors.green },
    error: { emoji: '❌', name: 'Error', color: colors.red }
  },
  ai: {
    start: { emoji: '🧠🔍', name: 'Start', color: colors.blue },
    progress: { emoji: '🧠⏳', name: 'Progress', color: colors.cyan },
    success: { emoji: '🧠✅', name: 'Success', color: colors.green },
    warning: { emoji: '🧠⚠️', name: 'Warning', color: colors.yellow },
    error: { emoji: '🧠❌', name: 'Error', color: colors.red },
    metrics: { emoji: '🧠📊', name: 'Metrics', color: colors.magenta }
  },
  openai: {
    request: { emoji: '🤖🔍', name: 'Request', color: colors.blue },
    response: { emoji: '🤖✅', name: 'Response', color: colors.green },
    error: { emoji: '🤖❌', name: 'Error', color: colors.red }
  }
};

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Default log file
const defaultLogFile = path.join(logsDir, 'unified.log');

/**
 * Format a log message with timestamp and context
 * 
 * @param {string} message - The log message
 * @param {object} context - The log context
 * @returns {string} - The formatted log message
 */
function formatLogMessage(message, context = {}) {
  const timestamp = new Date().toISOString();
  const contextStr = context.component ? ` [${context.component}]` : '';
  return `[${timestamp}]${contextStr} ${message}`;
}

/**
 * Format a log message with Dante style
 * 
 * @param {string} realm - The realm (success, warning, error)
 * @param {string} category - The category within the realm
 * @param {string} message - The log message
 * @param {object} context - The log context
 * @returns {string} - The formatted log message
 */
function formatDanteLog(realm, category, message, context = {}) {
  // Check if the category exists
  if (!danteCategories[realm] || !danteCategories[realm][category]) {
    console.error(`Invalid category: ${realm}.${category}`);
    // Use a fallback category
    return formatLogMessage(`⚠️: ${message}`, context);
  }

  const categoryInfo = danteCategories[realm][category];
  const formattedMessage = formatLogMessage(`${categoryInfo.emoji}: ${message}`, context);
  
  // Return colored message for console, plain for file
  return {
    console: `${categoryInfo.color}${formattedMessage}${colors.reset}`,
    file: formattedMessage
  };
}

/**
 * Format a log message with Hesse style
 * 
 * @param {string} category - The category
 * @param {string} subcategory - The subcategory
 * @param {string} message - The log message
 * @param {object} context - The log context
 * @returns {string} - The formatted log message
 */
function formatHesseLog(category, subcategory, message, context = {}) {
  // Check if the category exists
  if (!hesseCategories[category] || !hesseCategories[category][subcategory]) {
    console.error(`Invalid Hesse category: ${category}.${subcategory}`);
    // Use a fallback category
    return formatLogMessage(`🧠: ${message}`, context);
  }

  const categoryInfo = hesseCategories[category][subcategory];
  const formattedMessage = formatLogMessage(`${categoryInfo.emoji}: ${message}`, context);
  
  // Return colored message for console, plain for file
  return {
    console: `${categoryInfo.color}${formattedMessage}${colors.reset}`,
    file: formattedMessage
  };
}

/**
 * Write a log message to a file
 * 
 * @param {string} message - The log message
 * @param {string} logFile - The log file path
 */
function writeToLogFile(message, logFile = defaultLogFile) {
  try {
    fs.appendFileSync(logFile, message + '\n');
  } catch (error) {
    console.error(`Error writing to log file: ${error.message}`);
  }
}

/**
 * Create a logger section with the given realm and category
 * 
 * @param {string} realm - The realm (success, warning, error)
 * @param {string} category - The category within the realm
 * @returns {Function} - A function that logs messages in the given realm and category
 */
function createDanteLogger(realm, category) {
  return (message, data = null, context = {}) => {
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    const fullMessage = `${message}${dataStr}`;
    const formatted = formatDanteLog(realm, category, fullMessage, context);
    
    console.log(formatted.console);
    writeToLogFile(formatted.file);
    
    return {
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
      level: realm === 'error' ? 'error' : realm === 'warning' ? 'warn' : 'info'
    };
  };
}

/**
 * Create a Hesse logger section with the given category and subcategory
 * 
 * @param {string} category - The category
 * @param {string} subcategory - The subcategory
 * @returns {Function} - A function that logs messages in the given category and subcategory
 */
function createHesseLogger(category, subcategory) {
  return (message, data = null, context = {}) => {
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    const fullMessage = `${message}${dataStr}`;
    const formatted = formatHesseLog(category, subcategory, fullMessage, context);
    
    console.log(formatted.console);
    writeToLogFile(formatted.file);
    
    return {
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
      level: subcategory === 'error' ? 'error' : subcategory === 'warning' ? 'warn' : 'info'
    };
  };
}

// Create the unified logger
const UnifiedLogger = {
  // Dante-inspired error logging (Inferno)
  error: {
    validation: createDanteLogger('error', 'validation'),
    dataFlow: createDanteLogger('error', 'dataFlow'),
    resources: createDanteLogger('error', 'resources'),
    storage: createDanteLogger('error', 'storage'),
    runtime: createDanteLogger('error', 'runtime'),
    config: createDanteLogger('error', 'config'),
    corruption: createDanteLogger('error', 'corruption'),
    security: createDanteLogger('error', 'security'),
    system: createDanteLogger('error', 'system')
  },
  
  // Dante-inspired warning logging (Purgatorio)
  warning: {
    deprecated: createDanteLogger('warning', 'deprecated'),
    performance: createDanteLogger('warning', 'performance'),
    resources: createDanteLogger('warning', 'resources'),
    slow: createDanteLogger('warning', 'slow'),
    allocation: createDanteLogger('warning', 'allocation'),
    memory: createDanteLogger('warning', 'memory'),
    security: createDanteLogger('warning', 'security'),
    dataFlow: createDanteLogger('warning', 'dataFlow'),
    ux: createDanteLogger('warning', 'ux')
  },
  
  // Dante-inspired success logging (Paradiso)
  success: {
    basic: createDanteLogger('success', 'basic'),
    performance: createDanteLogger('success', 'performance'),
    ux: createDanteLogger('success', 'ux'),
    core: createDanteLogger('success', 'core'),
    security: createDanteLogger('success', 'security'),
    system: createDanteLogger('success', 'system'),
    architecture: createDanteLogger('success', 'architecture'),
    release: createDanteLogger('success', 'release'),
    innovation: createDanteLogger('success', 'innovation'),
    perfection: createDanteLogger('success', 'perfection')
  },
  
  // Hesse-inspired process logging
  summary: {
    start: createHesseLogger('summary', 'start'),
    progress: createHesseLogger('summary', 'progress'),
    complete: createHesseLogger('summary', 'complete'),
    error: createHesseLogger('summary', 'error')
  },
  
  // Hesse-inspired AI logging
  ai: {
    start: createHesseLogger('ai', 'start'),
    progress: createHesseLogger('ai', 'progress'),
    success: createHesseLogger('ai', 'success'),
    warning: createHesseLogger('ai', 'warning'),
    error: createHesseLogger('ai', 'error'),
    metrics: createHesseLogger('ai', 'metrics')
  },
  
  // Hesse-inspired OpenAI logging
  openai: {
    request: createHesseLogger('openai', 'request'),
    response: createHesseLogger('openai', 'response'),
    error: createHesseLogger('openai', 'error')
  }
};

module.exports = UnifiedLogger;

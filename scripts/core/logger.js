/**
 * Unified Logging System for AlexAI
 *
 * This module provides a consistent logging interface following the Dante philosophy
 * of methodical logging with clear categorization and visual indicators.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const emojis = {
  // Log levels
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  debug: '🔍',

  // Core components
  build: '🏗️',
  config: '⚙️',
  system: '🖥️',
  utils: '🛠️',

  // PDF processing
  pdf: '📄',
  color: '🎨',
  font: '🔤',
  text: '📝',
  markdown: '📊',
  extraction: '🔎',

  // External services
  openai: '🧠',
  api: '🌐',

  // Resources
  file: '📁',
  network: '🌐',
  time: '⏱️',
  memory: '💾',

  // User interaction
  user: '👤',
  ui: '🖼️',

  // Enhanced extraction
  'enhanced-extractor': '🔎',
  'enhanced-color': '🎭',
  'enhanced-font': '📝',
  'professional-introduction': '📋',

  // Philosophical frameworks
  salinger: '📚',
  hesse: '🧮',
  derrida: '🧩',
  dante: '🔥',
  kant: '⚖️',
  muller: '📐'
};

/**
 * Log a message with a prefix and color
 *
 * @param {string} level - Log level (info, success, warning, error, debug)
 * @param {string} message - Message content
 * @param {Object} options - Additional options
 */
function log(level, message, options = {}) {
  const category = options.category || level;
  const emoji = options.emoji || emojis[category] || emojis[level];
  const color = getColorForLevel(level);
  const prefix = options.prefix || category.toUpperCase();

  // Move emoji after the designation text
  console.log(`${color}${colors.bright}[${prefix}] ${emoji}${colors.reset} ${message}`);
}

/**
 * Get the color for a log level
 *
 * @param {string} level - Log level
 * @returns {string} - ANSI color code
 */
function getColorForLevel(level) {
  switch (level) {
    case 'info': return colors.blue;
    case 'success': return colors.green;
    case 'warning': return colors.yellow;
    case 'error': return colors.red;
    case 'debug': return colors.magenta;
    default: return colors.reset;
  }
}

/**
 * Create a logger with a specific category
 *
 * @param {string} category - The category for the logger
 * @returns {Object} - Logger object with methods for each log level
 */
function createLogger(category) {
  return {
    info: (message, options = {}) => log('info', message, { ...options, category }),
    success: (message, options = {}) => log('success', message, { ...options, category }),
    warning: (message, options = {}) => log('warning', message, { ...options, category }),
    error: (message, options = {}) => log('error', message, { ...options, category }),
    debug: (message, options = {}) => log('debug', message, { ...options, category })
  };
}

// Create specialized loggers for common categories
const loggers = {
  build: createLogger('build'),
  pdf: createLogger('pdf'),
  color: createLogger('color'),
  font: createLogger('font'),
  text: createLogger('text'),
  openai: createLogger('openai'),
  config: createLogger('config'),
  file: createLogger('file'),
  network: createLogger('network')
};

module.exports = {
  log,
  colors,
  emojis,
  createLogger,
  ...loggers
};

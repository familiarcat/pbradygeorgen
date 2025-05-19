/**
 * Configuration System for AlexAI
 *
 * This module provides a centralized configuration system following the Derrida philosophy
 * of deconstructing hardcoded values and replacing them with configurable options.
 */

const path = require('path');
const fs = require('fs');
const { createLogger } = require('./logger');

const logger = createLogger('config');

// Default configuration
const defaultConfig = {
  paths: {
    public: 'public',
    extracted: 'public/extracted',
    sourcePdfs: 'source-pdfs',
    backup: 'public/backup',
    scripts: 'scripts',
    uploads: 'public/uploads',
    testPdfs: 'public/test-pdfs'
  },
  pdf: {
    defaultPdf: 'public/pbradygeorgen_resume.pdf',
    backupPrefix: 'pbradygeorgen_resume_',
    extractionTimeout: 60000,
    extractionMethods: ['traditional', 'enhanced'],
    preferEnhanced: true,
    defaultFallbacks: {
      fontHeading: 'Arial, Helvetica, sans-serif',
      fontBody: 'Georgia, "Times New Roman", serif',
      fontMono: '"Courier New", monospace',
      colorPrimary: '#3366CC',
      colorBackground: '#FFFFFF',
      colorText: '#000000'
    }
  },
  openai: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  },
  build: {
    prebuildExtraction: true,
    generateImprovedMarkdown: true,
    backupOriginalPdf: true,
    extractFonts: true,
    extractColors: true,
    extractText: true,
    extractEnhanced: true
  },
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    useEmoji: true,
    useColor: true
  }
};

/**
 * Load configuration from file if it exists
 *
 * @returns {Object} - The merged configuration
 */
function loadConfig() {
  const configPath = path.join(process.cwd(), 'alexai.config.js');

  if (fs.existsSync(configPath)) {
    try {
      logger.info(`Loading configuration from ${configPath}`);
      const userConfig = require(configPath);
      return mergeConfigs(defaultConfig, userConfig);
    } catch (error) {
      logger.error(`Error loading config: ${error.message}`);
      return defaultConfig;
    }
  }

  logger.info('Using default configuration');
  return defaultConfig;
}

/**
 * Merge default and user configurations
 *
 * @param {Object} defaultConfig - The default configuration
 * @param {Object} userConfig - The user configuration
 * @returns {Object} - The merged configuration
 */
function mergeConfigs(defaultConfig, userConfig) {
  const result = { ...defaultConfig };

  for (const key in userConfig) {
    if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key]) && userConfig[key] !== null) {
      result[key] = mergeConfigs(defaultConfig[key] || {}, userConfig[key]);
    } else {
      result[key] = userConfig[key];
    }
  }

  return result;
}

/**
 * Get a configuration value by path
 *
 * @param {string} path - The path to the configuration value (e.g., 'pdf.defaultPdf')
 * @param {*} defaultValue - The default value to return if the path doesn't exist
 * @returns {*} - The configuration value
 */
function get(path, defaultValue) {
  const parts = path.split('.');
  let current = config;

  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[part];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Get the absolute path for a relative path
 *
 * @param {string} relativePath - The relative path
 * @returns {string} - The absolute path
 */
function getPath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

// Load the configuration
const config = loadConfig();

module.exports = {
  ...config,
  get,
  getPath
};

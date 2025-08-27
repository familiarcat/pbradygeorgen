/**
 * Dante Logger Formatters
 * 
 * This module provides utilities for formatting log messages according
 * to the Dante Logger configuration and the current environment.
 */

import { Category } from './categories';
import { DanteLoggerConfig } from './config';
import { LogPlatform } from './config';

/**
 * Format a log message according to Dante's cosmology
 * 
 * @param config The logger configuration
 * @param realm The realm (Inferno, Purgatorio, Paradiso)
 * @param level The level within the realm
 * @param message The log message
 * @param category The category for the level
 * @returns Formatted log message
 */
export function formatDanteLog(
  config: DanteLoggerConfig,
  realm: 'Inferno' | 'Purgatorio' | 'Paradiso',
  level: number,
  message: string,
  category: Category
): string {
  // Build the log prefix based on configuration
  let prefix = '';
  
  // Add timestamp if configured
  if (config.formatting.includeTimestamp) {
    const timestamp = new Date().toISOString();
    prefix += `[${timestamp}] `;
  }
  
  // Add emoji if configured
  if (config.formatting.includeEmoji) {
    prefix += `${category.emoji} `;
  }
  
  // Add realm, level, and category if configured
  if (config.formatting.includeRealmName || 
      config.formatting.includeLevelNumber || 
      config.formatting.includeCategoryName) {
    
    prefix += '[';
    
    if (config.formatting.includeRealmName) {
      prefix += `Dante:${realm}`;
      
      if (config.formatting.includeLevelNumber) {
        prefix += ':';
      }
    }
    
    if (config.formatting.includeLevelNumber) {
      prefix += `${level}`;
      
      if (config.formatting.includeCategoryName) {
        prefix += ':';
      }
    }
    
    if (config.formatting.includeCategoryName) {
      prefix += `${category.name}`;
    }
    
    prefix += '] ';
  }
  
  // Special case for Zod validation errors in Inferno Circle 1
  if (realm === 'Inferno' && level === 1) {
    return `${prefix}Kneel Before Zod! ${message}`;
  }
  
  return `${prefix}${message}`;
}

/**
 * Apply color to a log message based on the realm
 * 
 * @param config The logger configuration
 * @param platform The current platform
 * @param message The formatted message
 * @param realm The realm (Inferno, Purgatorio, Paradiso)
 * @returns Colored message (if applicable)
 */
export function applyColor(
  config: DanteLoggerConfig,
  platform: LogPlatform,
  message: string,
  realm: 'Inferno' | 'Purgatorio' | 'Paradiso'
): string {
  if (!config.formatting.colorize || !config.platforms[platform].colorize) {
    return message;
  }
  
  // ANSI color codes for terminal output
  // Only apply in Node.js or terminal environments
  if (platform === 'node' || platform === 'terminal') {
    switch (realm) {
      case 'Inferno':
        return `\x1b[31m${message}\x1b[0m`; // Red
      case 'Purgatorio':
        return `\x1b[33m${message}\x1b[0m`; // Yellow
      case 'Paradiso':
        return `\x1b[32m${message}\x1b[0m`; // Green
      default:
        return message;
    }
  }
  
  // For browser, we'll rely on the console's built-in coloring
  return message;
}

/**
 * Format data for logging
 * 
 * @param data The data to format
 * @returns Formatted data string
 */
export function formatData(data: any): string {
  if (data === undefined || data === null) {
    return '';
  }
  
  try {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    
    return String(data);
  } catch (error) {
    return '[Unformattable data]';
  }
}

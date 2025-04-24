/**
 * Universal Environment Detection
 *
 * This module provides utilities for detecting the current JavaScript
 * environment and platform, allowing the logger to adapt its behavior
 * accordingly.
 */

import { LogEnvironment, LogPlatform } from '../core/config';

/**
 * Detect the current JavaScript environment
 *
 * @returns The detected environment (development, production, test)
 */
export function detectEnvironment(): LogEnvironment {
  // Browser environment
  if (typeof window !== 'undefined' && window.document) {
    // Check for development mode in various frameworks
    if (
      // React development mode
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
      // Vue development mode
      (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
      // General development flag
      (window as any).__DEV__
    ) {
      return 'development';
    }

    // Check for test environment
    if (
      // Jest
      (window as any).jest ||
      // Cypress
      (window as any).Cypress ||
      // Playwright
      (window as any).playwright ||
      // General test flag
      (window as any).__TEST__
    ) {
      return 'test';
    }

    // Default to production for browsers
    return 'production';
  }

  // Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    // Check NODE_ENV
    const nodeEnv = process.env.NODE_ENV as string;

    // Use includes() to avoid strict type checking issues
    if (nodeEnv && ['development', 'dev'].includes(nodeEnv)) {
      return 'development';
    }

    if (nodeEnv && ['test', 'testing'].includes(nodeEnv)) {
      return 'test';
    }

    if (nodeEnv && ['production', 'prod'].includes(nodeEnv)) {
      return 'production';
    }

    // Check for test frameworks
    if (
      // Jest
      process.env.JEST_WORKER_ID ||
      // Mocha
      process.env.MOCHA_TEST
    ) {
      return 'test';
    }
  }

  // Default to development if we can't determine
  return 'development';
}

/**
 * Detect the current platform
 *
 * @returns The detected platform (browser, node, terminal, deployment)
 */
export function detectPlatform(): LogPlatform {
  // Browser environment
  if (typeof window !== 'undefined' && window.document) {
    return 'browser';
  }

  // Node.js environment
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // Check for CI/CD environment
    if (
      process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.TRAVIS ||
      process.env.CIRCLECI ||
      process.env.JENKINS_URL ||
      process.env.TEAMCITY_VERSION
    ) {
      return 'deployment';
    }

    // Check if running in a terminal
    if (process.stdout.isTTY) {
      return 'terminal';
    }

    // Default to node for Node.js environment
    return 'node';
  }

  // Default to node if we can't determine
  return 'node';
}

// Export current environment and platform
export const currentEnvironment = detectEnvironment();
export const currentPlatform = detectPlatform();

/**
 * Common types used throughout the application
 */

/**
 * LogContext type for providing context to log messages
 */
export interface LogContext {
  component?: string;
  file?: string;
  function?: string;
  line?: number;
  timestamp?: string;
  environment?: 'development' | 'production' | 'test';
  platform?: 'browser' | 'node' | 'terminal' | 'deployment';
  [key: string]: any;
}

/**
 * LogResult type for log message results
 */
export interface LogResult {
  message: string;
  data?: any;
  context?: LogContext;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * ColorTheme type for color themes
 */
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border?: string;
  isLoading: boolean;
  rawColors: string[];
  isDark?: boolean;
}

/**
 * SalingerCtaColors type for CTA button colors
 */
export interface SalingerCtaColors {
  primary: string;
  hover: string;
  active: string;
  disabled: string;
}

/**
 * ComprehensiveColorPalette type for a complete color palette
 */
export interface ComprehensiveColorPalette {
  primary: {
    base: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    base: string;
    light: string;
    dark: string;
    contrast: string;
  };
  accent: {
    base: string;
    light: string;
    dark: string;
    contrast: string;
  };
  ui: {
    modalHeader: string;
    modalBody: string;
    headerBackground: string;
  };
}

/**
 * OpenAIResponse type for OpenAI API responses
 */
export interface OpenAIResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * PDFExtractResult type for PDF extraction results
 */
export interface PDFExtractResult {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  };
  colors: string[];
  fonts: string[];
  images?: {
    url: string;
    width: number;
    height: number;
  }[];
}

export default {
  LogContext,
  LogResult,
  ColorTheme,
  SalingerCtaColors,
  ComprehensiveColorPalette,
  OpenAIResponse,
  PDFExtractResult
};

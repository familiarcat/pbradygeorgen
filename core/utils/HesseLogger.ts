/**
 * HesseLogger: A Hermann Hesse-inspired logging system for AI operations
 * 
 * This system provides specialized logging for AI operations, inspired by
 * Hermann Hesse's philosophical approach to knowledge and understanding.
 * 
 * The logger categorizes AI operations into different stages and provides
 * meaningful context through carefully chosen emoji combinations.
 */

import { DanteLogger } from './DanteLogger';

export const HesseLogger = {
  // AI operation stages
  ai: {
    // Starting an AI operation
    start: (message: string) => {
      console.log(`🧠🔍 [Hesse:AI:Start] ${message}`);
      DanteLogger.success.basic(`AI operation started: ${message}`);
    },
    
    // AI operation in progress
    progress: (message: string) => {
      console.log(`🧠⏳ [Hesse:AI:Progress] ${message}`);
    },
    
    // AI operation completed successfully
    success: (message: string) => {
      console.log(`🧠✅ [Hesse:AI:Success] ${message}`);
      DanteLogger.success.core(`AI operation succeeded: ${message}`);
    },
    
    // AI operation completed with warnings
    warning: (message: string) => {
      console.warn(`🧠⚠️ [Hesse:AI:Warning] ${message}`);
      DanteLogger.warn.performance(`AI operation warning: ${message}`);
    },
    
    // AI operation failed
    error: (message: string) => {
      console.error(`🧠❌ [Hesse:AI:Error] ${message}`);
      DanteLogger.error.runtime(`AI operation failed: ${message}`);
    },
    
    // AI operation metrics/analytics
    metrics: (message: string) => {
      console.log(`🧠📊 [Hesse:AI:Metrics] ${message}`);
    },
  },
  
  // Cache operations
  cache: {
    // Cache hit
    hit: (message: string) => {
      console.log(`📦✅ [Derrida:Cache:Hit] ${message}`);
    },
    
    // Cache miss
    miss: (message: string) => {
      console.log(`📦❌ [Derrida:Cache:Miss] ${message}`);
    },
    
    // Cache update
    update: (message: string) => {
      console.log(`📦🔄 [Derrida:Cache:Update] ${message}`);
    },
    
    // Cache invalidation
    invalidate: (message: string) => {
      console.log(`📦🗑️ [Derrida:Cache:Invalidate] ${message}`);
    },
  },
  
  // OpenAI specific logging
  openai: {
    // Request to OpenAI
    request: (message: string) => {
      console.log(`🤖🔍 [Hesse:OpenAI:Request] ${message}`);
      DanteLogger.success.basic(`OpenAI request: ${message}`);
    },
    
    // Response from OpenAI
    response: (message: string) => {
      console.log(`🤖✅ [Hesse:OpenAI:Response] ${message}`);
      DanteLogger.success.core(`OpenAI response received: ${message}`);
    },
    
    // Error from OpenAI
    error: (message: string) => {
      console.error(`🤖❌ [Hesse:OpenAI:Error] ${message}`);
      DanteLogger.error.runtime(`OpenAI error: ${message}`);
    },
    
    // Rate limit warning
    rateLimit: (message: string) => {
      console.warn(`🤖⏱️ [Hesse:OpenAI:RateLimit] ${message}`);
      DanteLogger.warn.performance(`OpenAI rate limit: ${message}`);
    },
    
    // Token usage metrics
    tokens: (message: string) => {
      console.log(`🤖💰 [Hesse:OpenAI:Tokens] ${message}`);
    },
  },
  
  // Summary generation logging
  summary: {
    // Starting summary generation
    start: (message: string) => {
      console.log(`📝🔍 [Hesse:Summary:Start] ${message}`);
      DanteLogger.success.basic(`Summary generation started: ${message}`);
    },
    
    // Summary generation in progress
    progress: (message: string) => {
      console.log(`📝⏳ [Hesse:Summary:Progress] ${message}`);
    },
    
    // Summary generation completed
    complete: (message: string) => {
      console.log(`📝✅ [Hesse:Summary:Complete] ${message}`);
      DanteLogger.success.core(`Summary generation completed: ${message}`);
    },
    
    // Summary generation failed
    error: (message: string) => {
      console.error(`📝❌ [Hesse:Summary:Error] ${message}`);
      DanteLogger.error.runtime(`Summary generation failed: ${message}`);
    },
  }
};

export default HesseLogger;

"use strict";
/**
 * HesseLogger: A Hermann Hesse-inspired logging system for AI operations
 *
 * This system provides specialized logging for AI operations, inspired by
 * Hermann Hesse's philosophical approach to knowledge and understanding.
 *
 * The logger categorizes AI operations into different stages and provides
 * meaningful context through carefully chosen emoji combinations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HesseLogger = void 0;
const DanteLogger_1 = require("./DanteLogger");
exports.HesseLogger = {
    // AI operation stages
    ai: {
        // Starting an AI operation
        start: (message) => {
            console.log(`🧠🔍 [Hesse:AI:Start] ${message}`);
            DanteLogger_1.DanteLogger.success.basic(`AI operation started: ${message}`);
        },
        // AI operation in progress
        progress: (message) => {
            console.log(`🧠⏳ [Hesse:AI:Progress] ${message}`);
        },
        // AI operation completed successfully
        success: (message) => {
            console.log(`🧠✅ [Hesse:AI:Success] ${message}`);
            DanteLogger_1.DanteLogger.success.core(`AI operation succeeded: ${message}`);
        },
        // AI operation completed with warnings
        warning: (message) => {
            console.warn(`🧠⚠️ [Hesse:AI:Warning] ${message}`);
            DanteLogger_1.DanteLogger.warn.performance(`AI operation warning: ${message}`);
        },
        // AI operation failed
        error: (message) => {
            console.error(`🧠❌ [Hesse:AI:Error] ${message}`);
            DanteLogger_1.DanteLogger.error.runtime(`AI operation failed: ${message}`);
        },
        // AI operation metrics/analytics
        metrics: (message) => {
            console.log(`🧠📊 [Hesse:AI:Metrics] ${message}`);
        },
    },
    // Cache operations
    cache: {
        // Cache hit
        hit: (message) => {
            console.log(`📦✅ [Derrida:Cache:Hit] ${message}`);
        },
        // Cache miss
        miss: (message) => {
            console.log(`📦❌ [Derrida:Cache:Miss] ${message}`);
        },
        // Cache update
        update: (message) => {
            console.log(`📦🔄 [Derrida:Cache:Update] ${message}`);
        },
        // Cache invalidation
        invalidate: (message) => {
            console.log(`📦🗑️ [Derrida:Cache:Invalidate] ${message}`);
        },
    },
    // OpenAI specific logging
    openai: {
        // Request to OpenAI
        request: (message) => {
            console.log(`🤖🔍 [Hesse:OpenAI:Request] ${message}`);
            DanteLogger_1.DanteLogger.success.basic(`OpenAI request: ${message}`);
        },
        // Response from OpenAI
        response: (message) => {
            console.log(`🤖✅ [Hesse:OpenAI:Response] ${message}`);
            DanteLogger_1.DanteLogger.success.core(`OpenAI response received: ${message}`);
        },
        // Error from OpenAI
        error: (message) => {
            console.error(`🤖❌ [Hesse:OpenAI:Error] ${message}`);
            DanteLogger_1.DanteLogger.error.runtime(`OpenAI error: ${message}`);
        },
        // Rate limit warning
        rateLimit: (message) => {
            console.warn(`🤖⏱️ [Hesse:OpenAI:RateLimit] ${message}`);
            DanteLogger_1.DanteLogger.warn.performance(`OpenAI rate limit: ${message}`);
        },
        // Token usage metrics
        tokens: (message) => {
            console.log(`🤖💰 [Hesse:OpenAI:Tokens] ${message}`);
        },
    },
    // Summary generation logging
    summary: {
        // Starting summary generation
        start: (message) => {
            console.log(`📝🔍 [Hesse:Summary:Start] ${message}`);
            DanteLogger_1.DanteLogger.success.basic(`Summary generation started: ${message}`);
        },
        // Summary generation in progress
        progress: (message) => {
            console.log(`📝⏳ [Hesse:Summary:Progress] ${message}`);
        },
        // Summary generation completed
        complete: (message) => {
            console.log(`📝✅ [Hesse:Summary:Complete] ${message}`);
            DanteLogger_1.DanteLogger.success.core(`Summary generation completed: ${message}`);
        },
        // Summary generation failed
        error: (message) => {
            console.error(`📝❌ [Hesse:Summary:Error] ${message}`);
            DanteLogger_1.DanteLogger.error.runtime(`Summary generation failed: ${message}`);
        },
    }
};
exports.default = exports.HesseLogger;
//# sourceMappingURL=HesseLogger.js.map
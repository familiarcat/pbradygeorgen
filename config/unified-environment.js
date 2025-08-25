// Unified Environment Configuration
// This file provides a centralized configuration system for both production and development

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Base configuration
const baseConfig = {
    // n8n Configuration
    n8n: {
        baseUrl: process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com',
        apiKey: process.env.N8N_API_KEY,
        webhookBase: process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com',
    },

    // OpenRouter Configuration
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1',
    },

    // Application Configuration
    app: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development',
    },

    // PDF Processing Configuration
    pdf: {
        maxMemory: '4096MB',
        timeout: 30000,
        useLegacyBuild: true, // Use legacy PDF.js build for Node.js compatibility
    },

    // Federation Crew Configuration
    crew: {
        webhookUrl: `${process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com'}/webhook/federation-mission`,
        timeout: 60000,
        retries: 3,
    },

    // AWS Configuration
    aws: {
        region: process.env.AWS_REGION || 'us-east-2',
        amplify: {
            appId: process.env.AMPLIFY_APP_ID,
            branch: process.env.AMPLIFY_BRANCH || 'main',
        },
    },
};

// Development-specific overrides
const developmentConfig = {
    ...baseConfig,
    app: {
        ...baseConfig.app,
        port: 3001, // Use port 3001 for development to avoid conflicts
    },
    pdf: {
        ...baseConfig.pdf,
        timeout: 60000, // Longer timeout for development
    },
    crew: {
        ...baseConfig.crew,
        timeout: 120000, // Longer timeout for development
    },
};

// Production-specific overrides
const productionConfig = {
    ...baseConfig,
    app: {
        ...baseConfig.app,
        port: process.env.PORT || 3000,
    },
    pdf: {
        ...baseConfig.pdf,
        timeout: 15000, // Shorter timeout for production
    },
    crew: {
        ...baseConfig.crew,
        timeout: 30000, // Shorter timeout for production
    },
};

// Export the appropriate configuration based on environment
const config = isDevelopment ? developmentConfig : productionConfig;

// Helper functions
export const getN8nWebhookUrl = (webhookName) => {
    return `${config.n8n.webhookBase}/webhook/${webhookName}`;
};

export const getN8nApiUrl = (endpoint) => {
    return `${config.n8n.baseUrl}/api/v1/${endpoint}`;
};

export const isDev = () => isDevelopment;
export const isProd = () => isProduction;

export default config;

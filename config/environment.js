// Environment Configuration for n8n Integration
const config = {
    // n8n Configuration
    n8n: {
        // Use deployed instance for both local and production
        baseUrl: process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com',
        apiKey: process.env.N8N_API_KEY,
        webhookBase: process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com',
    },

    // Environment Detection
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // API Configuration
    api: {
        timeout: 30000,
        retries: 3,
    },

    // Crew Integration
    crew: {
        webhookUrl: `${process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com'}/webhook/federation-crew-assessment`,
        timeout: 60000,
    }
};

// Helper function to get n8n webhook URL
export const getN8nWebhookUrl = (webhookName) => {
    return `${config.n8n.webhookBase}/webhook/${webhookName}`;
};

// Helper function to get n8n API URL
export const getN8nApiUrl = (endpoint) => {
    return `${config.n8n.baseUrl}/api/v1/${endpoint}`;
};

export default config;

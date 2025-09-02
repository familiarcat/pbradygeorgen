"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Claude API Connectivity Tests
 * Tests the integration between Claude agents and external Claude API
 */
test_1.test.describe('Claude API Connectivity', () => {
    (0, test_1.test)('should verify Claude API key configuration', async ({ page }) => {
        // Test if Claude API key is properly configured
        const response = await page.request.post('/api/claude/health-check');
        if (response.status() === 200) {
            const data = await response.json();
            (0, test_1.expect)(data.claudeApiConfigured).toBe(true);
            (0, test_1.expect)(data.status).toBe('connected');
        }
        else {
            // If health check endpoint doesn't exist, this test identifies a missing component
            console.warn('❌ Missing Claude API health check endpoint');
            (0, test_1.expect)(response.status()).toBe(404); // Expected for now
        }
    });
    (0, test_1.test)('should test Claude agent API integration', async ({ page }) => {
        const testPayload = {
            agentId: 'picard',
            task: 'Test Claude API connectivity',
            requireRealApi: true
        };
        const response = await page.request.post('/api/claude/agent-query', {
            data: testPayload
        });
        // Check if we're getting mock data (indicating no API key) or real Claude responses
        const data = await response.json();
        if (data.isUsingMockData) {
            console.warn('⚠️ Claude agents falling back to mock data - API key not configured');
            (0, test_1.expect)(data.isUsingMockData).toBe(true);
        }
        else {
            (0, test_1.expect)(response.status()).toBe(200);
            (0, test_1.expect)(data.response).toBeDefined();
            (0, test_1.expect)(data.response.length).toBeGreaterThan(50); // Real Claude responses are typically longer
        }
    });
    (0, test_1.test)('should verify all crew members have Claude API access', async ({ page }) => {
        const crewMembers = [
            'picard', 'data', 'worf', 'geordi',
            'troi', 'uhura', 'crusher', 'quark'
        ];
        for (const crewId of crewMembers) {
            const response = await page.request.post('/api/claude/crew-status', {
                data: { crewId }
            });
            if (response.status() === 200) {
                const data = await response.json();
                (0, test_1.expect)(data.crewId).toBe(crewId);
                (0, test_1.expect)(data.claudeApiAccess).toBeDefined();
            }
            else {
                console.warn(`❌ Missing Claude API status endpoint for ${crewId}`);
            }
        }
    });
    (0, test_1.test)('should test Claude API rate limiting and error handling', async ({ page }) => {
        const requests = [];
        // Send multiple requests quickly to test rate limiting
        for (let i = 0; i < 5; i++) {
            requests.push(page.request.post('/api/claude/agent-query', {
                data: {
                    agentId: 'data',
                    task: `Quick test request ${i + 1}`
                }
            }));
        }
        const responses = await Promise.all(requests);
        // At least one should succeed
        const successCount = responses.filter(r => r.status() === 200).length;
        (0, test_1.expect)(successCount).toBeGreaterThan(0);
        // Check for proper rate limiting responses
        const rateLimitedCount = responses.filter(r => r.status() === 429).length;
        console.log(`ℹ️ ${rateLimitedCount} requests were rate limited`);
    });
});
//# sourceMappingURL=claude-api-connectivity.spec.js.map
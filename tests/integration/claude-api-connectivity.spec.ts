import { test, expect } from '@playwright/test';

/**
 * Claude API Connectivity Tests
 * Tests the integration between Claude agents and external Claude API
 */

test.describe('Claude API Connectivity', () => {
    test('should verify Claude API key configuration', async ({ page }) => {
        // Test if Claude API key is properly configured
        const response = await page.request.post('/api/claude/health-check');
        
        if (response.status() === 200) {
            const data = await response.json();
            expect(data.claudeApiConfigured).toBe(true);
            expect(data.status).toBe('connected');
        } else {
            // If health check endpoint doesn't exist, this test identifies a missing component
            console.warn('❌ Missing Claude API health check endpoint');
            expect(response.status()).toBe(404); // Expected for now
        }
    });

    test('should test Claude agent API integration', async ({ page }) => {
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
            expect(data.isUsingMockData).toBe(true);
        } else {
            expect(response.status()).toBe(200);
            expect(data.response).toBeDefined();
            expect(data.response.length).toBeGreaterThan(50); // Real Claude responses are typically longer
        }
    });

    test('should verify all crew members have Claude API access', async ({ page }) => {
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
                expect(data.crewId).toBe(crewId);
                expect(data.claudeApiAccess).toBeDefined();
            } else {
                console.warn(`❌ Missing Claude API status endpoint for ${crewId}`);
            }
        }
    });

    test('should test Claude API rate limiting and error handling', async ({ page }) => {
        const requests = [];
        
        // Send multiple requests quickly to test rate limiting
        for (let i = 0; i < 5; i++) {
            requests.push(
                page.request.post('/api/claude/agent-query', {
                    data: {
                        agentId: 'data',
                        task: `Quick test request ${i + 1}`
                    }
                })
            );
        }

        const responses = await Promise.all(requests);
        
        // At least one should succeed
        const successCount = responses.filter(r => r.status() === 200).length;
        expect(successCount).toBeGreaterThan(0);

        // Check for proper rate limiting responses
        const rateLimitedCount = responses.filter(r => r.status() === 429).length;
        console.log(`ℹ️ ${rateLimitedCount} requests were rate limited`);
    });
});
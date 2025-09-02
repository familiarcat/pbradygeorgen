"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * API Tests for N8N Endpoints
 * Tests the backend API routes that interact with n8n workflows
 */
test_1.test.describe('N8N API Endpoints', () => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    (0, test_1.test)('should test crew member endpoint with valid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                crewMemberId: 'picard',
                webhookPath: 'crew-captain-jean-luc-picard',
                task: 'Strategic analysis test',
                scenario: 'Quick test scenario',
                expectedOutcome: 'Success response',
                complexity: 'Medium'
            }
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.crewMemberId).toBe('picard');
        (0, test_1.expect)(data.task).toBe('Strategic analysis test');
    });
    (0, test_1.test)('should test crew member endpoint with invalid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                // Missing required fields
                crewMemberId: 'invalid'
            }
        });
        (0, test_1.expect)(response.status()).toBe(400);
        const data = await response.json();
        (0, test_1.expect)(data.error).toBeDefined();
    });
    (0, test_1.test)('should test observation lounge endpoint with valid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/observation-lounge`, {
            data: {
                missionDirective: 'Test mission coordination',
                selectedCrew: ['picard', 'riker'],
                testMode: 'core_crew',
                complexity: 'Medium'
            }
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.missionDirective).toBe('Test mission coordination');
        (0, test_1.expect)(data.selectedCrew).toEqual(['picard', 'riker']);
        (0, test_1.expect)(data.response.coordination_summary).toBeDefined();
    });
    (0, test_1.test)('should test observation lounge endpoint with missing required fields', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/observation-lounge`, {
            data: {
                // Missing missionDirective and selectedCrew
                testMode: 'core_crew'
            }
        });
        (0, test_1.expect)(response.status()).toBe(400);
        const data = await response.json();
        (0, test_1.expect)(data.error).toBe('Missing required fields: missionDirective, selectedCrew');
    });
    (0, test_1.test)('should test mission scenario endpoint with valid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/mission-scenario`, {
            data: {
                missionDescription: 'Test mission scenario',
                selectedCrew: ['picard', 'data'],
                complexity: 'High',
                expectedOutcome: 'Successful mission execution'
            }
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data.success).toBe(true);
        (0, test_1.expect)(data.missionDescription).toBe('Test mission scenario');
    });
    (0, test_1.test)('should handle n8n webhook failures gracefully', async ({ request }) => {
        // Test with a crew member that might fail (like Riker who returns HTTP 500)
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                crewMemberId: 'riker',
                webhookPath: 'crew-commander-william-riker',
                task: 'Tactical execution test',
                scenario: 'Failure scenario',
                expectedOutcome: 'Graceful error handling',
                complexity: 'Medium'
            }
        });
        // Should still return 200 even if n8n fails (due to fallback)
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        // Should have fallback data
        (0, test_1.expect)(data).toBeDefined();
    });
    (0, test_1.test)('should validate request payload structure', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                crewMemberId: 'picard',
                webhookPath: 'crew-captain-jean-luc-picard',
                task: 'Test task',
                // Add extra unexpected fields
                unexpectedField: 'should be ignored',
                anotherField: 123
            }
        });
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        // Should not contain unexpected fields
        (0, test_1.expect)(data.unexpectedField).toBeUndefined();
        (0, test_1.expect)(data.anotherField).toBeUndefined();
    });
    (0, test_1.test)('should handle malformed JSON gracefully', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: 'invalid json string'
        });
        (0, test_1.expect)(response.status()).toBe(400);
    });
    (0, test_1.test)('should test response time performance', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                crewMemberId: 'picard',
                webhookPath: 'crew-captain-jean-luc-picard',
                task: 'Performance test',
                scenario: 'Quick test',
                expectedOutcome: 'Fast response',
                complexity: 'Low'
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        (0, test_1.expect)(response.status()).toBe(200);
        // Response should complete within reasonable time (5 seconds)
        (0, test_1.expect)(responseTime).toBeLessThan(5000);
        const data = await response.json();
        (0, test_1.expect)(data.testMetrics.responseTime).toBeDefined();
    });
});
//# sourceMappingURL=n8n-endpoints.spec.js.map
import { test, expect } from '@playwright/test';

/**
 * API Tests for N8N Endpoints
 * Tests the backend API routes that interact with n8n workflows
 */
test.describe('N8N API Endpoints', () => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';

    test('should test crew member endpoint with valid data', async ({ request }) => {
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

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.crewMemberId).toBe('picard');
        expect(data.task).toBe('Strategic analysis test');
    });

    test('should test crew member endpoint with invalid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            data: {
                // Missing required fields
                crewMemberId: 'invalid'
            }
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data.error).toBeDefined();
    });

    test('should test observation lounge endpoint with valid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/observation-lounge`, {
            data: {
                missionDirective: 'Test mission coordination',
                selectedCrew: ['picard', 'riker'],
                testMode: 'core_crew',
                complexity: 'Medium'
            }
        });

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.missionDirective).toBe('Test mission coordination');
        expect(data.selectedCrew).toEqual(['picard', 'riker']);
        expect(data.response.coordination_summary).toBeDefined();
    });

    test('should test observation lounge endpoint with missing required fields', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/observation-lounge`, {
            data: {
                // Missing missionDirective and selectedCrew
                testMode: 'core_crew'
            }
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data.error).toBe('Missing required fields: missionDirective, selectedCrew');
    });

    test('should test mission scenario endpoint with valid data', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/mission-scenario`, {
            data: {
                missionDescription: 'Test mission scenario',
                selectedCrew: ['picard', 'data'],
                complexity: 'High',
                expectedOutcome: 'Successful mission execution'
            }
        });

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.missionDescription).toBe('Test mission scenario');
    });

    test('should handle n8n webhook failures gracefully', async ({ request }) => {
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
        expect(response.status()).toBe(200);

        const data = await response.json();
        // Should have fallback data
        expect(data).toBeDefined();
    });

    test('should validate request payload structure', async ({ request }) => {
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

        expect(response.status()).toBe(200);

        const data = await response.json();
        // Should not contain unexpected fields
        expect(data.unexpectedField).toBeUndefined();
        expect(data.anotherField).toBeUndefined();
    });

    test('should handle malformed JSON gracefully', async ({ request }) => {
        const response = await request.post(`${baseURL}/api/test-n8n/crew-member`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: 'invalid json string'
        });

        expect(response.status()).toBe(400);
    });

    test('should test response time performance', async ({ request }) => {
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

        expect(response.status()).toBe(200);

        // Response should complete within reasonable time (5 seconds)
        expect(responseTime).toBeLessThan(5000);

        const data = await response.json();
        expect(data.testMetrics.responseTime).toBeDefined();
    });
});

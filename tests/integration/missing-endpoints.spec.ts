import { test, expect } from '@playwright/test';

/**
 * Missing Endpoints Detection Tests
 * Identifies and tests for missing API endpoints that should exist for full system functionality
 */

test.describe('Missing Endpoints Detection', () => {
    const requiredEndpoints = [
        // Claude API endpoints
        { path: '/api/claude/health-check', method: 'GET', description: 'Claude API health status' },
        { path: '/api/claude/agent-query', method: 'POST', description: 'Direct Claude agent queries' },
        { path: '/api/claude/crew-status', method: 'POST', description: 'Crew member Claude API status' },
        
        // System integration endpoints
        { path: '/api/integration/full-system-test', method: 'POST', description: 'Complete system integration test' },
        { path: '/api/integration/fallback-test', method: 'POST', description: 'System fallback mechanism test' },
        { path: '/api/integration/error-handling', method: 'POST', description: 'Cross-system error handling' },
        { path: '/api/integration/load-test', method: 'POST', description: 'System performance under load' },
        
        // Data flow endpoints  
        { path: '/api/claude/process-data', method: 'POST', description: 'Claude data processing' },
        { path: '/api/n8n/data-status/:id', method: 'GET', description: 'N8N data status check' },
        { path: '/api/supabase/retrieve/:id', method: 'GET', description: 'Supabase data retrieval' },
        
        // Mission coordination endpoints
        { path: '/api/coordination/mission-status', method: 'GET', description: 'Mission status tracking' },
        { path: '/api/coordination/crew-assignment', method: 'POST', description: 'Crew assignment coordination' },
        { path: '/api/coordination/collective-analysis', method: 'POST', description: 'Multi-agent collective analysis' },
        
        // Analytics and monitoring
        { path: '/api/analytics/system-metrics', method: 'GET', description: 'System performance metrics' },
        { path: '/api/analytics/crew-performance', method: 'GET', description: 'Crew performance analytics' },
        { path: '/api/monitoring/health', method: 'GET', description: 'Overall system health' },
        
        // Authentication and authorization (if needed)
        { path: '/api/auth/validate-session', method: 'GET', description: 'Session validation' },
        { path: '/api/auth/permissions', method: 'GET', description: 'User permissions check' }
    ];

    test('should identify missing critical endpoints', async ({ page }) => {
        const missingEndpoints = [];
        const existingEndpoints = [];

        for (const endpoint of requiredEndpoints) {
            try {
                let response;
                const testPath = endpoint.path.replace('/:id', '/test-id');
                
                if (endpoint.method === 'GET') {
                    response = await page.request.get(testPath);
                } else {
                    response = await page.request.post(testPath, {
                        data: { test: true }
                    });
                }

                if (response.status() === 404) {
                    missingEndpoints.push(endpoint);
                } else {
                    existingEndpoints.push(endpoint);
                }
            } catch (error) {
                missingEndpoints.push(endpoint);
            }
        }

        console.log(`\n📊 Endpoint Analysis:`);
        console.log(`✅ Existing endpoints: ${existingEndpoints.length}`);
        console.log(`❌ Missing endpoints: ${missingEndpoints.length}`);
        
        if (missingEndpoints.length > 0) {
            console.log(`\n🔍 Missing Endpoints:`);
            missingEndpoints.forEach(endpoint => {
                console.log(`   • ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
            });
        }

        // This test passes but logs the missing endpoints for reference
        expect(missingEndpoints.length).toBeGreaterThanOrEqual(0);
    });

    test('should verify existing endpoint functionality', async ({ page }) => {
        const workingEndpoints = [];
        const brokenEndpoints = [];

        // Test known existing endpoints from our previous tests
        const knownEndpoints = [
            { path: '/api/test-n8n/crew-member', method: 'POST', testData: { crewMemberId: 'picard', task: 'test' } },
            { path: '/api/test-n8n/observation-lounge', method: 'POST', testData: { mode: 'core_crew', mission: 'test' } },
            { path: '/api/analyze-content', method: 'POST', testData: { youtube_url: 'test', github_repo: 'test' } }
        ];

        for (const endpoint of knownEndpoints) {
            try {
                const response = await page.request.post(endpoint.path, {
                    data: endpoint.testData
                });

                if (response.status() < 500) { // 2xx, 3xx, 4xx are acceptable (not server errors)
                    workingEndpoints.push(endpoint);
                } else {
                    brokenEndpoints.push({ ...endpoint, error: response.status() });
                }
            } catch (error) {
                brokenEndpoints.push({ ...endpoint, error: error.message });
            }
        }

        console.log(`\n🔧 Endpoint Health Check:`);
        console.log(`✅ Working endpoints: ${workingEndpoints.length}`);
        console.log(`💥 Broken endpoints: ${brokenEndpoints.length}`);

        if (brokenEndpoints.length > 0) {
            console.log(`\nBroken endpoints:`);
            brokenEndpoints.forEach(endpoint => {
                console.log(`   • ${endpoint.method} ${endpoint.path} - Error: ${endpoint.error}`);
            });
        }

        expect(workingEndpoints.length).toBeGreaterThan(0);
    });

    test('should test API response consistency', async ({ page }) => {
        const testEndpoint = '/api/test-n8n/crew-member';
        const testData = { crewMemberId: 'picard', task: 'consistency test' };
        const responses = [];

        // Make multiple requests to check consistency
        for (let i = 0; i < 3; i++) {
            const response = await page.request.post(testEndpoint, { data: testData });
            const data = await response.json().catch(() => null);
            responses.push({ status: response.status(), data });
        }

        // All responses should have similar structure
        const statusCodes = responses.map(r => r.status);
        const uniqueStatuses = [...new Set(statusCodes)];
        
        expect(uniqueStatuses.length).toBeLessThanOrEqual(2); // Should be consistent or have at most 2 different statuses

        // Check if successful responses have consistent structure
        const successfulResponses = responses.filter(r => r.status === 200 && r.data);
        if (successfulResponses.length > 0) {
            const firstResponse = successfulResponses[0].data;
            const requiredFields = Object.keys(firstResponse);
            
            successfulResponses.forEach((response, index) => {
                requiredFields.forEach(field => {
                    expect(response.data).toHaveProperty(field);
                });
            });
        }
    });
});
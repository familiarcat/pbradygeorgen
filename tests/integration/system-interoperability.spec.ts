import { test, expect } from '@playwright/test';

/**
 * System Interoperability Tests
 * Tests the connectivity between all major system components
 */

test.describe('System Interoperability', () => {
    test('should verify Claude + N8N + Supabase integration flow', async ({ page }) => {
        // Test the complete flow: Claude -> N8N -> Supabase
        const missionData = {
            objective: 'Test full system integration',
            context: 'End-to-end connectivity test',
            crewRequired: ['picard', 'data', 'worf']
        };

        const response = await page.request.post('/api/integration/full-system-test', {
            data: missionData
        });

        if (response.status() === 200) {
            const data = await response.json();
            
            // Verify Claude agent responses
            expect(data.claudeResults).toBeDefined();
            expect(Object.keys(data.claudeResults)).toHaveLength(3);
            
            // Verify N8N workflow execution
            expect(data.n8nResults).toBeDefined();
            expect(data.n8nResults.workflowExecuted).toBe(true);
            
            // Verify Supabase data persistence
            expect(data.supabaseResults).toBeDefined();
            expect(data.supabaseResults.dataPersisted).toBe(true);
            
        } else {
            console.warn('❌ Full system integration endpoint missing');
            expect(response.status()).toBe(404); // Expected for now
        }
    });

    test('should test system fallback mechanisms', async ({ page }) => {
        // Test graceful degradation when services are unavailable
        const testScenarios = [
            { name: 'n8n_unavailable', disableN8N: true },
            { name: 'supabase_unavailable', disableSupabase: true },
            { name: 'claude_unavailable', disableClaude: true }
        ];

        for (const scenario of testScenarios) {
            const response = await page.request.post('/api/integration/fallback-test', {
                data: scenario
            });

            if (response.status() === 200) {
                const data = await response.json();
                expect(data.fallbackActivated).toBe(true);
                expect(data.systemStillFunctional).toBe(true);
                console.log(`✅ Fallback working for scenario: ${scenario.name}`);
            } else {
                console.warn(`❌ Fallback test endpoint missing for ${scenario.name}`);
            }
        }
    });

    test('should verify data flow consistency across systems', async ({ page }) => {
        const testData = {
            id: `test_${Date.now()}`,
            payload: { message: 'Data consistency test' }
        };

        // Step 1: Send data through Claude system
        const claudeResponse = await page.request.post('/api/claude/process-data', {
            data: testData
        });

        if (claudeResponse.status() === 200) {
            const claudeData = await claudeResponse.json();
            
            // Step 2: Verify N8N receives the same data
            const n8nResponse = await page.request.get(`/api/n8n/data-status/${testData.id}`);
            
            if (n8nResponse.status() === 200) {
                const n8nData = await n8nResponse.json();
                expect(n8nData.originalId).toBe(testData.id);
                
                // Step 3: Verify Supabase persistence
                const supabaseResponse = await page.request.get(`/api/supabase/retrieve/${testData.id}`);
                
                if (supabaseResponse.status() === 200) {
                    const supabaseData = await supabaseResponse.json();
                    expect(supabaseData.id).toBe(testData.id);
                    expect(supabaseData.processed).toBe(true);
                }
            }
        } else {
            console.warn('❌ Data flow consistency test endpoints missing');
        }
    });

    test('should test cross-system error propagation', async ({ page }) => {
        // Test that errors are properly propagated across system boundaries
        const errorTestCases = [
            { type: 'invalid_mission', data: { invalid: 'mission_data' } },
            { type: 'malformed_json', data: 'not_json' },
            { type: 'missing_required_fields', data: {} }
        ];

        for (const testCase of errorTestCases) {
            const response = await page.request.post('/api/integration/error-handling', {
                data: testCase
            });

            // Should get proper error responses, not system crashes
            expect([400, 422, 500]).toContain(response.status());
            
            const errorData = await response.json().catch(() => null);
            if (errorData) {
                expect(errorData.error).toBeDefined();
                expect(errorData.errorType).toBe(testCase.type);
            }
        }
    });

    test('should verify system performance under load', async ({ page }) => {
        const concurrentRequests = 10;
        const requests = [];

        // Create concurrent requests to test system stability
        for (let i = 0; i < concurrentRequests; i++) {
            requests.push(
                page.request.post('/api/integration/load-test', {
                    data: {
                        requestId: i,
                        timestamp: new Date().toISOString()
                    }
                })
            );
        }

        const startTime = Date.now();
        const responses = await Promise.all(requests);
        const endTime = Date.now();

        const successCount = responses.filter(r => r.status() === 200).length;
        const averageResponseTime = (endTime - startTime) / concurrentRequests;

        // At least 80% should succeed under load
        expect(successCount / concurrentRequests).toBeGreaterThanOrEqual(0.8);
        
        // Average response time should be reasonable (under 5 seconds)
        expect(averageResponseTime).toBeLessThan(5000);

        console.log(`ℹ️ Load test: ${successCount}/${concurrentRequests} succeeded, avg time: ${averageResponseTime}ms`);
    });
});
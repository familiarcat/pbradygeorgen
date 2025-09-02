"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * N8N Workflow Connectivity Tests
 * Tests the specific N8N workflow integration issues identified in the test results
 */
test_1.test.describe('N8N Workflow Connectivity', () => {
    (0, test_1.test)('should diagnose mission scenario endpoint failures', async ({ page }) => {
        const failingScenarios = [
            'crisis_response',
            'technical_audit',
            'business_analysis'
        ];
        const diagnostics = [];
        for (const scenario of failingScenarios) {
            console.log(`🔍 Diagnosing ${scenario} scenario...`);
            const response = await page.request.post('/api/test-n8n/mission-scenario', {
                data: {
                    scenario: scenario,
                    crewMembers: ['picard', 'data', 'worf'],
                    urgency: 'medium'
                }
            });
            const diagnostic = {
                scenario,
                status: response.status(),
                headers: Object.fromEntries(response.headers()),
                timestamp: new Date().toISOString()
            };
            try {
                const responseData = await response.json();
                diagnostic.responseData = responseData;
            }
            catch (error) {
                diagnostic.responseError = error.message;
            }
            diagnostics.push(diagnostic);
            // Log detailed information for debugging
            console.log(`   Status: ${diagnostic.status}`);
            console.log(`   Headers: ${JSON.stringify(diagnostic.headers, null, 2)}`);
            if (diagnostic.responseData) {
                console.log(`   Response: ${JSON.stringify(diagnostic.responseData, null, 2)}`);
            }
        }
        // Analyze common failure patterns
        const statusCodes = diagnostics.map(d => d.status);
        const mostCommonStatus = statusCodes.reduce((a, b, i, arr) => arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b);
        console.log(`\n📊 Failure Analysis:`);
        console.log(`Most common status code: ${mostCommonStatus}`);
        const errorMessages = diagnostics
            .filter(d => d.responseData && d.responseData.error)
            .map(d => d.responseData.error);
        if (errorMessages.length > 0) {
            console.log(`Common error messages:`);
            errorMessages.forEach(msg => console.log(`   • ${msg}`));
        }
        // The test documents the issues found
        (0, test_1.expect)(diagnostics.length).toBe(3);
        (0, test_1.expect)(statusCodes.every(code => code !== 200)).toBe(true); // Confirms all are failing
    });
    (0, test_1.test)('should verify N8N webhook connectivity', async ({ page }) => {
        // Test direct webhook connectivity for working crew members
        const workingCrewMembers = [
            'picard', 'riker', 'data', 'geordi',
            'crusher', 'worf', 'troi', 'uhura', 'quark'
        ];
        const webhookResults = [];
        for (const crewId of workingCrewMembers) {
            console.log(`🔗 Testing webhook for ${crewId}...`);
            const response = await page.request.post(`/api/test-n8n/crew-member`, {
                data: {
                    crewMemberId: crewId,
                    task: 'webhook connectivity test',
                    webhookPath: `/${crewId}`
                }
            });
            const result = {
                crewId,
                status: response.status(),
                responseTime: Date.now() // Simple timing
            };
            try {
                const data = await response.json();
                result.success = data.success || false;
                result.webhookCalled = data.webhookCalled || false;
                result.n8nResponse = data.n8nResponse || null;
            }
            catch (error) {
                result.error = error.message;
            }
            webhookResults.push(result);
        }
        const successfulWebhooks = webhookResults.filter(r => r.status === 200);
        const failedWebhooks = webhookResults.filter(r => r.status !== 200);
        console.log(`\n🔗 Webhook Connectivity Results:`);
        console.log(`✅ Successful: ${successfulWebhooks.length}/${webhookResults.length}`);
        console.log(`❌ Failed: ${failedWebhooks.length}/${webhookResults.length}`);
        if (failedWebhooks.length > 0) {
            console.log(`Failed webhooks:`);
            failedWebhooks.forEach(w => {
                console.log(`   • ${w.crewId}: Status ${w.status}`);
            });
        }
        // Most webhooks should be working based on previous test results
        (0, test_1.expect)(successfulWebhooks.length).toBeGreaterThan(failedWebhooks.length);
    });
    (0, test_1.test)('should test N8N workflow execution flow', async ({ page }) => {
        // Test the complete workflow execution flow
        const testWorkflow = {
            workflowId: 'picard',
            input: {
                task: 'Execute strategic analysis workflow',
                context: 'Full workflow execution test',
                priority: 'high'
            }
        };
        console.log(`🚀 Testing complete workflow execution for ${testWorkflow.workflowId}...`);
        const startTime = Date.now();
        const response = await page.request.post('/api/test-n8n/crew-member', {
            data: {
                crewMemberId: testWorkflow.workflowId,
                task: testWorkflow.input.task,
                context: testWorkflow.input.context
            }
        });
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        const responseData = await response.json().catch(() => null);
        console.log(`   Execution time: ${executionTime}ms`);
        console.log(`   Response status: ${response.status()}`);
        if (responseData) {
            console.log(`   Workflow executed: ${responseData.n8nWorkflowExecuted || 'unknown'}`);
            console.log(`   Response received: ${responseData.success || false}`);
            // Check for workflow-specific details
            if (responseData.workflowDetails) {
                console.log(`   Workflow details: ${JSON.stringify(responseData.workflowDetails, null, 2)}`);
            }
        }
        (0, test_1.expect)(response.status()).toBe(200);
        (0, test_1.expect)(executionTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
    (0, test_1.test)('should verify N8N error handling and recovery', async ({ page }) => {
        // Test how the system handles N8N workflow errors
        const errorTestCases = [
            {
                name: 'invalid_crew_member',
                data: { crewMemberId: 'invalid_crew', task: 'test' }
            },
            {
                name: 'malformed_task',
                data: { crewMemberId: 'picard', task: null }
            },
            {
                name: 'empty_request',
                data: {}
            }
        ];
        const errorResults = [];
        for (const testCase of errorTestCases) {
            console.log(`🚨 Testing error case: ${testCase.name}...`);
            const response = await page.request.post('/api/test-n8n/crew-member', {
                data: testCase.data
            });
            const result = {
                testCase: testCase.name,
                status: response.status(),
                hasErrorHandling: false,
                errorMessage: null
            };
            try {
                const data = await response.json();
                result.hasErrorHandling = !!(data.error || data.message);
                result.errorMessage = data.error || data.message;
            }
            catch (e) {
                result.parseError = true;
            }
            errorResults.push(result);
            console.log(`   Status: ${result.status}`);
            console.log(`   Error handling: ${result.hasErrorHandling ? '✅' : '❌'}`);
            if (result.errorMessage) {
                console.log(`   Message: ${result.errorMessage}`);
            }
        }
        // System should handle errors gracefully (not crash with 500s)
        const serverErrors = errorResults.filter(r => r.status >= 500);
        (0, test_1.expect)(serverErrors.length).toBe(0);
        // Should provide meaningful error messages
        const handledErrors = errorResults.filter(r => r.hasErrorHandling);
        (0, test_1.expect)(handledErrors.length).toBeGreaterThan(0);
    });
    (0, test_1.test)('should test N8N workflow performance patterns', async ({ page }) => {
        // Test performance characteristics of different workflows
        const performanceTests = [
            { crewId: 'picard', expectedTime: 2000, description: 'Strategic analysis' },
            { crewId: 'data', expectedTime: 1000, description: 'Data processing' },
            { crewId: 'worf', expectedTime: 1500, description: 'Security analysis' }
        ];
        const performanceResults = [];
        for (const test of performanceTests) {
            const startTime = Date.now();
            const response = await page.request.post('/api/test-n8n/crew-member', {
                data: {
                    crewMemberId: test.crewId,
                    task: `Performance test for ${test.description}`
                }
            });
            const endTime = Date.now();
            const actualTime = endTime - startTime;
            const result = {
                crewId: test.crewId,
                description: test.description,
                expectedTime: test.expectedTime,
                actualTime,
                performanceRatio: actualTime / test.expectedTime,
                status: response.status()
            };
            performanceResults.push(result);
            console.log(`⚡ ${test.crewId} (${test.description}): ${actualTime}ms (expected: ${test.expectedTime}ms)`);
        }
        // Calculate overall performance metrics
        const avgPerformanceRatio = performanceResults.reduce((sum, r) => sum + r.performanceRatio, 0) / performanceResults.length;
        console.log(`\n📊 Overall Performance Ratio: ${avgPerformanceRatio.toFixed(2)}x expected time`);
        // Performance should be reasonable (within 3x expected time)
        (0, test_1.expect)(avgPerformanceRatio).toBeLessThan(3.0);
        // Most requests should succeed
        const successCount = performanceResults.filter(r => r.status === 200).length;
        (0, test_1.expect)(successCount).toBeGreaterThanOrEqual(performanceResults.length * 0.8);
    });
});
//# sourceMappingURL=n8n-workflow-connectivity.spec.js.map
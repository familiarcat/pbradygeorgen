/**
 * N8N API Client - Unified Client-Server Interaction System
 * =========================================================
 * 
 * This module provides a unified interface for interacting with n8n workflows
 * across both local and production environments. It includes:
 * 
 * - Environment management and switching
 * - Workflow testing and validation
 * - Crew member endpoint testing
 * - Comprehensive error handling and reporting
 * - Local and remote n8n instance management
 */

export interface N8NEnvironment {
    name: string;
    n8nBaseUrl: string;
    apiKey?: string;
    webhookSecret?: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
}

export interface TestResult {
    id: string;
    crewMemberId: string;
    webhookPath: string;
    task: string;
    status: 'success' | 'error' | 'timeout';
    responseTime?: number;
    statusCode?: number;
    responseBody?: any;
    error?: string;
    timestamp: string;
    environment: string;
    attempts: number;
}

export interface TestScenario {
    id: string;
    name: string;
    description: string;
    task: string;
    expectedOutcome: string;
    complexity: 'Low' | 'Medium' | 'High';
    category: string;
    crewMembers: string[];
}

export interface TestSuiteResult {
    environment: string;
    timestamp: string;
    totalTests: number;
    successfulTests: number;
    failedTests: number;
    successRate: number;
    results: TestResult[];
    summary: string;
}

// Helper function to create timeout signal safely
function createTimeoutSignal(timeout: number): AbortSignal | undefined {
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        try {
            return AbortSignal.timeout(timeout);
        } catch {
            return undefined;
        }
    }
    return undefined;
}

export class N8NConfig {
    private environments: Map<string, N8NEnvironment> = new Map();
    private currentEnvironment: string = 'local';

    constructor() {
        this.initializeDefaultEnvironments();
    }

    private initializeDefaultEnvironments() {
        // Local development environment
        this.environments.set('local', {
            name: 'local',
            n8nBaseUrl: 'http://localhost:5678',
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000,
        });

        // Production environment
        this.environments.set('production', {
            name: 'production',
            n8nBaseUrl: 'https://n8n.pbradygeorgen.com',
            timeout: 60000,
            retryAttempts: 5,
            retryDelay: 2000,
        });

        // Try to get current environment from environment variables
        const envFromVar = process.env.N8N_ENVIRONMENT || (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ? 'production' : 'local';
        this.currentEnvironment = envFromVar;
    }

    getCurrentEnvironment(): N8NEnvironment {
        const env = this.environments.get(this.currentEnvironment);
        if (!env) {
            throw new Error(`Environment '${this.currentEnvironment}' not found`);
        }
        return env;
    }

    switchEnvironment(environmentName: string): boolean {
        if (!this.environments.has(environmentName)) {
            console.error(`Environment '${environmentName}' not found`);
            return false;
        }

        this.currentEnvironment = environmentName;
        console.log(`✅ Switched to environment: ${environmentName}`);
        return true;
    }

    getAvailableEnvironments(): string[] {
        return Array.from(this.environments.keys());
    }

    getEnvironment(environmentName: string): N8NEnvironment | undefined {
        return this.environments.get(environmentName);
    }
}

export class N8NClient {
    private config: N8NConfig;
    private currentEnv: N8NEnvironment;

    constructor(config?: N8NConfig) {
        this.config = config || new N8NConfig();
        this.currentEnv = this.config.getCurrentEnvironment();
    }

    /**
     * Test connection to the current n8n instance
     */
    async testConnection(): Promise<{
        status: 'success' | 'error';
        message: string;
        responseTime?: number;
        statusCode?: number;
    }> {
        const startTime = Date.now();

        try {
            const response = await fetch(`${this.currentEnv.n8nBaseUrl}/healthz`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'N8N-Client/1.0',
                    'Content-Type': 'application/json',
                },
                signal: createTimeoutSignal(this.currentEnv.timeout),
            });

            const responseTime = Date.now() - startTime;

            if (response.ok) {
                return {
                    status: 'success',
                    message: 'Connected successfully',
                    responseTime,
                    statusCode: response.status,
                };
            } else {
                return {
                    status: 'error',
                    message: `HTTP ${response.status}`,
                    statusCode: response.status,
                };
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'TimeoutError') {
                    return {
                        status: 'error',
                        message: 'Connection timeout',
                    };
                }
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    return {
                        status: 'error',
                        message: 'Connection refused',
                    };
                }
                return {
                    status: 'error',
                    message: error.message,
                };
            }
            return {
                status: 'error',
                message: 'Unknown error occurred',
            };
        }
    }

    /**
     * Test a specific webhook endpoint
     */
    async testWebhook(
        webhookPath: string,
        payload: any,
        options?: {
            timeout?: number;
            retryAttempts?: number;
            retryDelay?: number;
        }
    ): Promise<TestResult> {
        const timeout = options?.timeout || this.currentEnv.timeout;
        const retryAttempts = options?.retryAttempts || this.currentEnv.retryAttempts;
        const retryDelay = options?.retryDelay || this.currentEnv.retryDelay;

        const webhookUrl = `${this.currentEnv.n8nBaseUrl}/webhook/${webhookPath}`;
        const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        for (let attempt = 1; attempt <= retryAttempts; attempt++) {
            try {
                const startTime = Date.now();

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'User-Agent': 'N8N-Client/1.0',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    signal: createTimeoutSignal(timeout),
                });

                const responseTime = Date.now() - startTime;

                let responseBody: any;
                try {
                    responseBody = await response.json();
                } catch {
                    responseBody = await response.text();
                }

                if (response.ok) {
                    return {
                        id: testId,
                        crewMemberId: payload.crewMemberId || 'unknown',
                        webhookPath,
                        task: payload.task || 'unknown',
                        status: 'success',
                        responseTime,
                        statusCode: response.status,
                        responseBody,
                        timestamp: new Date().toISOString(),
                        environment: this.currentEnv.name,
                        attempts: attempt,
                    };
                } else {
                    console.warn(`⚠️ Attempt ${attempt} failed: HTTP ${response.status}`);

                    if (attempt === retryAttempts) {
                        return {
                            id: testId,
                            crewMemberId: payload.crewMemberId || 'unknown',
                            webhookPath,
                            task: payload.task || 'unknown',
                            status: 'error',
                            statusCode: response.status,
                            responseBody,
                            error: `HTTP ${response.status}`,
                            timestamp: new Date().toISOString(),
                            environment: this.currentEnv.name,
                            attempts: attempt,
                        };
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Attempt ${attempt} error:`, error);

                if (attempt === retryAttempts) {
                    return {
                        id: testId,
                        crewMemberId: payload.crewMemberId || 'unknown',
                        webhookPath,
                        task: payload.task || 'unknown',
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Unknown error',
                        timestamp: new Date().toISOString(),
                        environment: this.currentEnv.name,
                        attempts: attempt,
                    };
                }
            }

            // Wait before retry (except on last attempt)
            if (attempt < retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }

        // This should never be reached, but just in case
        return {
            id: testId,
            crewMemberId: payload.crewMemberId || 'unknown',
            webhookPath,
            task: payload.task || 'unknown',
            status: 'error',
            error: 'Max retry attempts exceeded',
            timestamp: new Date().toISOString(),
            environment: this.currentEnv.name,
            attempts: retryAttempts,
        };
    }

    /**
     * Get list of available workflows
     */
    async getWorkflows(): Promise<{
        status: 'success' | 'error';
        workflows?: any[];
        message?: string;
        statusCode?: number;
    }> {
        try {
            const response = await fetch(`${this.currentEnv.n8nBaseUrl}/api/v1/workflows`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'N8N-Client/1.0',
                    'Content-Type': 'application/json',
                },
                signal: createTimeoutSignal(this.currentEnv.timeout),
            });

            if (response.ok) {
                const workflows = await response.json();
                return {
                    status: 'success',
                    workflows,
                };
            } else {
                return {
                    status: 'error',
                    message: `HTTP ${response.status}`,
                    statusCode: response.status,
                };
            }
        } catch (error) {
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Switch to a different environment
     */
    switchEnvironment(environmentName: string): boolean {
        const success = this.config.switchEnvironment(environmentName);
        if (success) {
            this.currentEnv = this.config.getCurrentEnvironment();
        }
        return true;
    }

    /**
     * Get current environment information
     */
    getCurrentEnvironment(): N8NEnvironment {
        return this.currentEnv;
    }

    /**
     * Get available environments
     */
    getAvailableEnvironments(): string[] {
        return this.config.getAvailableEnvironments();
    }
}

export class N8NTestRunner {
    private client: N8NClient;
    private results: TestResult[] = [];

    constructor(client: N8NClient) {
        this.client = client;
    }

    /**
     * Run test for a specific crew member
     */
    async runCrewMemberTest(
        crewMemberId: string,
        webhookPath: string,
        task: string,
        additionalPayload?: any
    ): Promise<TestResult> {
        const payload = {
            crewMemberId,
            webhookPath,
            task,
            timestamp: new Date().toISOString(),
            testMode: true,
            source: 'n8n-test-runner',
            ...additionalPayload,
        };

        console.log(`🧪 Testing ${crewMemberId} with task: ${task}`);
        const result = await this.client.testWebhook(webhookPath, payload);

        this.results.push(result);
        return result;
    }

    /**
     * Run comprehensive automated test suite
     */
    async runAutomatedTestSuite(scenarios: TestScenario[]): Promise<TestSuiteResult> {
        console.log(`🤖 Running automated test suite with ${scenarios.length} scenarios`);

        for (let i = 0; i < scenarios.length; i++) {
            const scenario = scenarios[i];
            console.log(`\n📋 Scenario ${i + 1}/${scenarios.length}: ${scenario.name}`);

            for (const crewMemberId of scenario.crewMembers) {
                const result = await this.runCrewMemberTest(
                    crewMemberId,
                    `crew-${crewMemberId}`,
                    scenario.task,
                    {
                        scenario: scenario.name,
                        scenarioId: scenario.id,
                        expectedOutcome: scenario.expectedOutcome,
                        complexity: scenario.complexity,
                        category: scenario.category,
                    }
                );

                // Display result
                if (result.status === 'success') {
                    console.log(`  ✅ ${crewMemberId}: ${result.responseTime}ms`);
                } else {
                    console.log(`  ❌ ${crewMemberId}: ${result.error || 'Unknown error'}`);
                }

                // Add delay between tests (except on last test)
                if (i < scenarios.length - 1 || crewMemberId !== scenario.crewMembers[scenario.crewMembers.length - 1]) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        return this.generateReport();
    }

    /**
     * Generate comprehensive test report
     */
    generateReport(): TestSuiteResult {
        const totalTests = this.results.length;
        const successfulTests = this.results.filter(r => r.status === 'success').length;
        const failedTests = totalTests - successfulTests;
        const successRate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;

        const summary = `
📊 N8N Test Report
==================

Environment: ${this.client.getCurrentEnvironment().name}
Base URL: ${this.client.getCurrentEnvironment().n8nBaseUrl}
Timestamp: ${new Date().toLocaleString()}

Summary:
- Total Tests: ${totalTests}
- Successful: ${successfulTests}
- Failed: ${failedTests}
- Success Rate: ${successRate.toFixed(1)}%
`;

        return {
            environment: this.client.getCurrentEnvironment().name,
            timestamp: new Date().toISOString(),
            totalTests,
            successfulTests,
            failedTests,
            successRate,
            results: [...this.results],
            summary,
        };
    }

    /**
     * Get all test results
     */
    getResults(): TestResult[] {
        return [...this.results];
    }

    /**
     * Clear test results
     */
    clearResults(): void {
        this.results = [];
    }
}

// Export singleton instances for easy use
export const n8nConfig = new N8NConfig();
export const n8nClient = new N8NClient(n8nConfig);
export const n8nTestRunner = new N8NTestRunner(n8nClient);

// Export default instances
export default {
    config: n8nConfig,
    client: n8nClient,
    testRunner: n8nTestRunner,
};

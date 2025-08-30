import { Page, expect } from '@playwright/test';

/**
 * Test Utilities and Helpers for N8N Testing System
 * Provides reusable functions for common test operations
 */

export interface TestCrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

export interface TestScenario {
    id: string;
    name: string;
    description: string;
    complexity: 'Low' | 'Medium' | 'High';
    expectedOutcome: string;
}

export const CREW_MEMBERS: TestCrewMember[] = [
    {
        id: 'picard',
        name: 'Captain Jean-Luc Picard',
        role: 'Strategic Leadership',
        webhookPath: 'crew-captain-jean-luc-picard',
        description: 'Strategic business analysis and mission planning'
    },
    {
        id: 'riker',
        name: 'Commander William Riker',
        role: 'Tactical Execution',
        webhookPath: 'crew-commander-william-riker',
        description: 'Tactical planning and mission execution'
    },
    {
        id: 'data',
        name: 'Commander Data',
        role: 'Data Analysis',
        webhookPath: 'crew-commander-data',
        description: 'Logical analysis and data processing'
    },
    {
        id: 'geordi',
        name: 'Lieutenant Commander Geordi La Forge',
        role: 'Technical Implementation',
        webhookPath: 'crew-lieutenant-commander-geordi-la-forge',
        description: 'Technical solutions and engineering'
    },
    {
        id: 'crusher',
        name: 'Dr. Beverly Crusher',
        role: 'Psychological Insights',
        webhookPath: 'crew-dr-beverly-crusher',
        description: 'Human factors and psychological analysis'
    },
    {
        id: 'worf',
        name: 'Lieutenant Worf',
        role: 'Security & Tactical',
        webhookPath: 'crew-lieutenant-worf',
        description: 'Security analysis and tactical planning'
    }
];

export const TEST_SCENARIOS: TestScenario[] = [
    {
        id: 'strategic-analysis',
        name: 'Strategic Business Analysis',
        description: 'High-level business strategy and market analysis',
        complexity: 'High',
        expectedOutcome: 'Comprehensive strategic insights and recommendations'
    },
    {
        id: 'tactical-execution',
        name: 'Tactical Execution Planning',
        description: 'Operational planning and execution strategies',
        complexity: 'Medium',
        expectedOutcome: 'Detailed execution plan with timeline and resources'
    },
    {
        id: 'data-analysis',
        name: 'Data Analysis & Logic',
        description: 'Data processing and logical analysis',
        complexity: 'Medium',
        expectedOutcome: 'Data-driven insights and logical conclusions'
    },
    {
        id: 'psychological-insights',
        name: 'Psychological Insights',
        description: 'Human behavior and psychological analysis',
        complexity: 'Low',
        expectedOutcome: 'Behavioral insights and recommendations'
    },
    {
        id: 'security-analysis',
        name: 'Security & Tactical Analysis',
        description: 'Security assessment and tactical planning',
        complexity: 'High',
        expectedOutcome: 'Security analysis and tactical recommendations'
    },
    {
        id: 'technical-implementation',
        name: 'Technical Implementation',
        description: 'Technical solution design and implementation',
        complexity: 'Medium',
        expectedOutcome: 'Technical specifications and implementation plan'
    }
];

/**
 * Navigate to a specific page and wait for it to load
 */
export async function navigateToPage(page: Page, path: string, expectedTitle?: string) {
    await page.goto(path);

    if (expectedTitle) {
        await page.waitForSelector(`h1:has-text("${expectedTitle}"), h2:has-text("${expectedTitle}")`);
    }

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
}

/**
 * Wait for and verify a crew member card is visible
 */
export async function verifyCrewMemberCard(page: Page, crewMember: TestCrewMember) {
    const card = page.locator('div').filter({ hasText: crewMember.name }).first();
    await expect(card).toBeVisible();

    // Verify role and description
    await expect(card.locator(`text=${crewMember.role}`)).toBeVisible();
    await expect(card.locator(`text=${crewMember.description}`)).toBeVisible();

    // Verify test button is present
    const testButton = card.locator('button:has-text("🚀 Test")');
    await expect(testButton).toBeVisible();

    return card;
}

/**
 * Execute a crew member test and wait for results
 */
export async function executeCrewMemberTest(page: Page, crewMember: TestCrewMember) {
    const card = await verifyCrewMemberCard(page, crewMember);
    const testButton = card.locator('button:has-text("🚀 Test")');

    // Click test button
    await testButton.click();

    // Wait for test to complete
    await page.waitForTimeout(3000);

    // Verify results are displayed
    await expect(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();

    return true;
}

/**
 * Switch environment in the unified testing interface
 */
export async function switchEnvironment(page: Page, environment: 'local' | 'production') {
    const envButton = page.locator(`button:has-text("${environment}")`);
    await expect(envButton).toBeVisible();
    await envButton.click();

    // Verify environment has changed
    await expect(page.locator(`p:has-text("Current: ${environment}")`)).toBeVisible();
}

/**
 * Run the full automated test suite
 */
export async function runFullTestSuite(page: Page) {
    const runButton = page.locator('button:has-text("🚀 Run Full Test Suite")');
    await expect(runButton).toBeVisible();

    // Click run button
    await runButton.click();

    // Wait for tests to start running
    await page.waitForTimeout(3000);

    // Verify test execution is in progress
    await expect(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();

    return true;
}

/**
 * Test connection to n8n server
 */
export async function testN8NConnection(page: Page) {
    const testConnectionButton = page.locator('button:has-text("🔍 Test Connection")');
    await expect(testConnectionButton).toBeVisible();

    // Click test connection button
    await testConnectionButton.click();

    // Wait for connection test to complete
    await page.waitForTimeout(2000);

    // Verify connection status is displayed
    await expect(page.locator('p:has-text("Base URL:")')).toBeVisible();

    return true;
}

/**
 * Verify test results are properly formatted
 */
export async function verifyTestResults(page: Page) {
    const resultsSection = page.locator('h3:has-text("📊 Test Results")');
    await expect(resultsSection).toBeVisible();

    // Verify result details are shown
    await expect(page.locator('text=crew-captain-jean-luc-picard')).toBeVisible();

    return true;
}

/**
 * Test responsive design on different viewport sizes
 */
export async function testResponsiveDesign(page: Page) {
    const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1280, height: 720, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);

        // Verify the interface is still usable
        await expect(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();

        // Check that crew member cards are still accessible
        await expect(page.locator('h4:has-text("Captain Jean-Luc Picard")')).toBeVisible();
    }

    // Return to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
}

/**
 * Generate test data for API testing
 */
export function generateTestData(crewMemberId: string, task: string, complexity: 'Low' | 'Medium' | 'High' = 'Medium') {
    return {
        crewMemberId,
        webhookPath: CREW_MEMBERS.find(cm => cm.id === crewMemberId)?.webhookPath || '',
        task,
        scenario: `Test scenario for ${task}`,
        expectedOutcome: `Expected outcome for ${task}`,
        complexity
    };
}

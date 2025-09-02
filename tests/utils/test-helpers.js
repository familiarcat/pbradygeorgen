"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_SCENARIOS = exports.CREW_MEMBERS = void 0;
exports.navigateToPage = navigateToPage;
exports.verifyCrewMemberCard = verifyCrewMemberCard;
exports.executeCrewMemberTest = executeCrewMemberTest;
exports.switchEnvironment = switchEnvironment;
exports.runFullTestSuite = runFullTestSuite;
exports.testN8NConnection = testN8NConnection;
exports.verifyTestResults = verifyTestResults;
exports.testResponsiveDesign = testResponsiveDesign;
exports.generateTestData = generateTestData;
const test_1 = require("@playwright/test");
exports.CREW_MEMBERS = [
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
exports.TEST_SCENARIOS = [
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
async function navigateToPage(page, path, expectedTitle) {
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
async function verifyCrewMemberCard(page, crewMember) {
    const card = page.locator('div').filter({ hasText: crewMember.name }).first();
    await (0, test_1.expect)(card).toBeVisible();
    // Verify role and description
    await (0, test_1.expect)(card.locator(`text=${crewMember.role}`)).toBeVisible();
    await (0, test_1.expect)(card.locator(`text=${crewMember.description}`)).toBeVisible();
    // Verify test button is present
    const testButton = card.locator('button:has-text("🚀 Test")');
    await (0, test_1.expect)(testButton).toBeVisible();
    return card;
}
/**
 * Execute a crew member test and wait for results
 */
async function executeCrewMemberTest(page, crewMember) {
    const card = await verifyCrewMemberCard(page, crewMember);
    const testButton = card.locator('button:has-text("🚀 Test")');
    // Click test button
    await testButton.click();
    // Wait for test to complete
    await page.waitForTimeout(3000);
    // Verify results are displayed
    await (0, test_1.expect)(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    return true;
}
/**
 * Switch environment in the unified testing interface
 */
async function switchEnvironment(page, environment) {
    const envButton = page.locator(`button:has-text("${environment}")`);
    await (0, test_1.expect)(envButton).toBeVisible();
    await envButton.click();
    // Verify environment has changed
    await (0, test_1.expect)(page.locator(`p:has-text("Current: ${environment}")`)).toBeVisible();
}
/**
 * Run the full automated test suite
 */
async function runFullTestSuite(page) {
    const runButton = page.locator('button:has-text("🚀 Run Full Test Suite")');
    await (0, test_1.expect)(runButton).toBeVisible();
    // Click run button
    await runButton.click();
    // Wait for tests to start running
    await page.waitForTimeout(3000);
    // Verify test execution is in progress
    await (0, test_1.expect)(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    return true;
}
/**
 * Test connection to n8n server
 */
async function testN8NConnection(page) {
    const testConnectionButton = page.locator('button:has-text("🔍 Test Connection")');
    await (0, test_1.expect)(testConnectionButton).toBeVisible();
    // Click test connection button
    await testConnectionButton.click();
    // Wait for connection test to complete
    await page.waitForTimeout(2000);
    // Verify connection status is displayed
    await (0, test_1.expect)(page.locator('p:has-text("Base URL:")')).toBeVisible();
    return true;
}
/**
 * Verify test results are properly formatted
 */
async function verifyTestResults(page) {
    const resultsSection = page.locator('h3:has-text("📊 Test Results")');
    await (0, test_1.expect)(resultsSection).toBeVisible();
    // Verify result details are shown
    await (0, test_1.expect)(page.locator('text=crew-captain-jean-luc-picard')).toBeVisible();
    return true;
}
/**
 * Test responsive design on different viewport sizes
 */
async function testResponsiveDesign(page) {
    const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1280, height: 720, name: 'Desktop' }
    ];
    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        // Verify the interface is still usable
        await (0, test_1.expect)(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();
        // Check that crew member cards are still accessible
        await (0, test_1.expect)(page.locator('h4:has-text("Captain Jean-Luc Picard")')).toBeVisible();
    }
    // Return to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
}
/**
 * Generate test data for API testing
 */
function generateTestData(crewMemberId, task, complexity = 'Medium') {
    return {
        crewMemberId,
        webhookPath: exports.CREW_MEMBERS.find(cm => cm.id === crewMemberId)?.webhookPath || '',
        task,
        scenario: `Test scenario for ${task}`,
        expectedOutcome: `Expected outcome for ${task}`,
        complexity
    };
}
//# sourceMappingURL=test-helpers.js.map
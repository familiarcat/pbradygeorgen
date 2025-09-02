"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * End-to-End Tests for Unified N8N Testing Interface
 * Tests the complete user workflow from navigation to test execution
 */
test_1.test.describe('Unified N8N Testing Interface', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Navigate to the unified testing page before each test
        await page.goto('/unified-testing');
        // Wait for the page to load completely
        await page.waitForSelector('h2:has-text("🤖 Unified N8N Testing Console")');
    });
    (0, test_1.test)('should display the unified testing console with all sections', async ({ page }) => {
        // Verify main sections are present
        await (0, test_1.expect)(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h3:has-text("🌍 Environment Management")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h3:has-text("🧪 Quick Testing")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h3:has-text("🤖 Automated Test Suite")')).toBeVisible();
    });
    (0, test_1.test)('should allow environment switching between local and production', async ({ page }) => {
        // Check that environment buttons are present
        const localButton = page.locator('button:has-text("local")');
        const productionButton = page.locator('button:has-text("production")');
        await (0, test_1.expect)(localButton).toBeVisible();
        await (0, test_1.expect)(productionButton).toBeVisible();
        // Test switching to production
        await productionButton.click();
        // Verify production is selected (should have different styling)
        await (0, test_1.expect)(page.locator('p:has-text("Current: production")')).toBeVisible();
    });
    (0, test_1.test)('should display all crew member cards in quick testing section', async ({ page }) => {
        // Verify all 6 crew member cards are present
        const crewCards = page.locator('h4');
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Captain Jean-Luc Picard' })).toBeVisible();
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Commander William Riker' })).toBeVisible();
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Commander Data' })).toBeVisible();
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Lieutenant Commander Geordi La Forge' })).toBeVisible();
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Dr. Beverly Crusher' })).toBeVisible();
        await (0, test_1.expect)(crewCards.filter({ hasText: 'Counselor Deanna Troi' })).toBeVisible();
    });
    (0, test_1.test)('should allow testing individual crew members', async ({ page }) => {
        // Find and click the test button for Captain Picard
        const picardCard = page.locator('div').filter({ hasText: 'Captain Jean-Luc Picard' }).first();
        const testButton = picardCard.locator('button:has-text("🚀 Test")');
        await (0, test_1.expect)(testButton).toBeVisible();
        await testButton.click();
        // Wait for test to complete (this might take a moment)
        await page.waitForTimeout(2000);
        // Verify test results are displayed
        await (0, test_1.expect)(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    });
    (0, test_1.test)('should display automated test suite scenarios', async ({ page }) => {
        // Verify test scenarios are present
        await (0, test_1.expect)(page.locator('h4:has-text("Strategic Business Analysis")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h4:has-text("Tactical Execution Planning")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h4:has-text("Data Analysis & Logic")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h4:has-text("Psychological Insights")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h4:has-text("Security & Tactical Analysis")')).toBeVisible();
        await (0, test_1.expect)(page.locator('h4:has-text("Technical Implementation")')).toBeVisible();
    });
    (0, test_1.test)('should allow running the full automated test suite', async ({ page }) => {
        // Find and click the run test suite button
        const runButton = page.locator('button:has-text("🚀 Run Full Test Suite")');
        await (0, test_1.expect)(runButton).toBeVisible();
        await runButton.click();
        // Wait for tests to start running
        await page.waitForTimeout(3000);
        // Verify test execution is in progress
        await (0, test_1.expect)(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    });
    (0, test_1.test)('should display test results with proper formatting', async ({ page }) => {
        // First run a quick test to generate results
        const picardCard = page.locator('div').filter({ hasText: 'Captain Jean-Luc Picard' }).first();
        const testButton = picardCard.locator('button:has-text("🚀 Test")');
        await testButton.click();
        // Wait for results
        await page.waitForTimeout(3000);
        // Verify results section is displayed
        const resultsSection = page.locator('h3:has-text("📊 Test Results")');
        await (0, test_1.expect)(resultsSection).toBeVisible();
        // Verify result details are shown
        await (0, test_1.expect)(page.locator('text=crew-captain-jean-luc-picard')).toBeVisible();
    });
    (0, test_1.test)('should handle connection testing functionality', async ({ page }) => {
        // Find and click the test connection button
        const testConnectionButton = page.locator('button:has-text("🔍 Test Connection")');
        await (0, test_1.expect)(testConnectionButton).toBeVisible();
        await testConnectionButton.click();
        // Wait for connection test to complete
        await page.waitForTimeout(2000);
        // Verify connection status is displayed
        await (0, test_1.expect)(page.locator('p:has-text("Base URL:")')).toBeVisible();
    });
    (0, test_1.test)('should be responsive on mobile devices', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        // Verify the interface is still usable on mobile
        await (0, test_1.expect)(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();
        // Check that crew member cards are still accessible
        await (0, test_1.expect)(page.locator('h4:has-text("Captain Jean-Luc Picard")')).toBeVisible();
    });
    (0, test_1.test)('should maintain state during navigation', async ({ page }) => {
        // Set production environment
        const productionButton = page.locator('button:has-text("production")');
        await productionButton.click();
        // Navigate away and back
        await page.goto('/');
        await page.goto('/unified-testing');
        // Verify environment selection is maintained
        await (0, test_1.expect)(page.locator('p:has-text("Current: production")')).toBeVisible();
    });
});
//# sourceMappingURL=unified-testing.spec.js.map
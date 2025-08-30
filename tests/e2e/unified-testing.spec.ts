import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Unified N8N Testing Interface
 * Tests the complete user workflow from navigation to test execution
 */
test.describe('Unified N8N Testing Interface', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the unified testing page before each test
        await page.goto('/unified-testing');

        // Wait for the page to load completely
        await page.waitForSelector('h2:has-text("🤖 Unified N8N Testing Console")');
    });

    test('should display the unified testing console with all sections', async ({ page }) => {
        // Verify main sections are present
        await expect(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();
        await expect(page.locator('h3:has-text("🌍 Environment Management")')).toBeVisible();
        await expect(page.locator('h3:has-text("🧪 Quick Testing")')).toBeVisible();
        await expect(page.locator('h3:has-text("🤖 Automated Test Suite")')).toBeVisible();
    });

    test('should allow environment switching between local and production', async ({ page }) => {
        // Check that environment buttons are present
        const localButton = page.locator('button:has-text("local")');
        const productionButton = page.locator('button:has-text("production")');

        await expect(localButton).toBeVisible();
        await expect(productionButton).toBeVisible();

        // Test switching to production
        await productionButton.click();

        // Verify production is selected (should have different styling)
        await expect(page.locator('p:has-text("Current: production")')).toBeVisible();
    });

    test('should display all crew member cards in quick testing section', async ({ page }) => {
        // Verify all 6 crew member cards are present
        const crewCards = page.locator('h4');

        await expect(crewCards.filter({ hasText: 'Captain Jean-Luc Picard' })).toBeVisible();
        await expect(crewCards.filter({ hasText: 'Commander William Riker' })).toBeVisible();
        await expect(crewCards.filter({ hasText: 'Commander Data' })).toBeVisible();
        await expect(crewCards.filter({ hasText: 'Lieutenant Commander Geordi La Forge' })).toBeVisible();
        await expect(crewCards.filter({ hasText: 'Dr. Beverly Crusher' })).toBeVisible();
        await expect(crewCards.filter({ hasText: 'Counselor Deanna Troi' })).toBeVisible();
    });

    test('should allow testing individual crew members', async ({ page }) => {
        // Find and click the test button for Captain Picard
        const picardCard = page.locator('div').filter({ hasText: 'Captain Jean-Luc Picard' }).first();
        const testButton = picardCard.locator('button:has-text("🚀 Test")');

        await expect(testButton).toBeVisible();
        await testButton.click();

        // Wait for test to complete (this might take a moment)
        await page.waitForTimeout(2000);

        // Verify test results are displayed
        await expect(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    });

    test('should display automated test suite scenarios', async ({ page }) => {
        // Verify test scenarios are present
        await expect(page.locator('h4:has-text("Strategic Business Analysis")')).toBeVisible();
        await expect(page.locator('h4:has-text("Tactical Execution Planning")')).toBeVisible();
        await expect(page.locator('h4:has-text("Data Analysis & Logic")')).toBeVisible();
        await expect(page.locator('h4:has-text("Psychological Insights")')).toBeVisible();
        await expect(page.locator('h4:has-text("Security & Tactical Analysis")')).toBeVisible();
        await expect(page.locator('h4:has-text("Technical Implementation")')).toBeVisible();
    });

    test('should allow running the full automated test suite', async ({ page }) => {
        // Find and click the run test suite button
        const runButton = page.locator('button:has-text("🚀 Run Full Test Suite")');

        await expect(runButton).toBeVisible();
        await runButton.click();

        // Wait for tests to start running
        await page.waitForTimeout(3000);

        // Verify test execution is in progress
        await expect(page.locator('h3:has-text("📊 Test Results")')).toBeVisible();
    });

    test('should display test results with proper formatting', async ({ page }) => {
        // First run a quick test to generate results
        const picardCard = page.locator('div').filter({ hasText: 'Captain Jean-Luc Picard' }).first();
        const testButton = picardCard.locator('button:has-text("🚀 Test")');
        await testButton.click();

        // Wait for results
        await page.waitForTimeout(3000);

        // Verify results section is displayed
        const resultsSection = page.locator('h3:has-text("📊 Test Results")');
        await expect(resultsSection).toBeVisible();

        // Verify result details are shown
        await expect(page.locator('text=crew-captain-jean-luc-picard')).toBeVisible();
    });

    test('should handle connection testing functionality', async ({ page }) => {
        // Find and click the test connection button
        const testConnectionButton = page.locator('button:has-text("🔍 Test Connection")');

        await expect(testConnectionButton).toBeVisible();
        await testConnectionButton.click();

        // Wait for connection test to complete
        await page.waitForTimeout(2000);

        // Verify connection status is displayed
        await expect(page.locator('p:has-text("Base URL:")')).toBeVisible();
    });

    test('should be responsive on mobile devices', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify the interface is still usable on mobile
        await expect(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();

        // Check that crew member cards are still accessible
        await expect(page.locator('h4:has-text("Captain Jean-Luc Picard")')).toBeVisible();
    });

    test('should maintain state during navigation', async ({ page }) => {
        // Set production environment
        const productionButton = page.locator('button:has-text("production")');
        await productionButton.click();

        // Navigate away and back
        await page.goto('/');
        await page.goto('/unified-testing');

        // Verify environment selection is maintained
        await expect(page.locator('p:has-text("Current: production")')).toBeVisible();
    });
});

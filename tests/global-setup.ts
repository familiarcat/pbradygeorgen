import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * This runs once before all tests and sets up the testing environment
 */
async function globalSetup(config: FullConfig) {
    console.log('🚀 Setting up global test environment...');

    // Check if our Next.js app is running
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Test if the app is accessible
        await page.goto(baseURL);

        // Wait for the app to load
        await page.waitForSelector('nav', { timeout: 10000 });

        console.log(`✅ Application is accessible at ${baseURL}`);

        // Optional: Set up any global test data or authentication
        // await setupTestData(page);

        await browser.close();
    } catch (error) {
        console.warn(`⚠️ Warning: Could not verify application at ${baseURL}:`, error);
        console.log('💡 Make sure to run "npm run dev" before running tests');
    }

    console.log('✅ Global setup completed');
}

export default globalSetup;

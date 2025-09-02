"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Global teardown for Playwright tests
 * This runs once after all tests and cleans up the testing environment
 */
async function globalTeardown(config) {
    console.log('🧹 Cleaning up global test environment...');
    // Clean up any test data or resources
    // await cleanupTestData();
    // Optional: Generate test summary report
    console.log('📊 Test execution completed');
    console.log('💡 View detailed results at: test-results/');
    console.log('✅ Global teardown completed');
}
exports.default = globalTeardown;
//# sourceMappingURL=global-teardown.js.map
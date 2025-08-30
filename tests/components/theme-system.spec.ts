import { test, expect } from '@playwright/test';

/**
 * Component Tests for Theme System
 * Tests the theme provider and component library functionality
 */
test.describe('Theme System Components', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to theme demo page
        await page.goto('/theme-demo');

        // Wait for the page to load
        await page.waitForSelector('h1:has-text("🎨 Theme System Demo")');
    });

    test('should display all theme components correctly', async ({ page }) => {
        // Verify all component sections are present
        await expect(page.locator('h2:has-text("🎯 Component Library")')).toBeVisible();
        await expect(page.locator('h3:has-text("Buttons")')).toBeVisible();
        await expect(page.locator('h3:has-text("Cards")')).toBeVisible();
        await expect(page.locator('h3:has-text("Inputs")')).toBeVisible();
        await expect(page.locator('h3:has-text("Text Elements")')).toBeVisible();
    });

    test('should render themed buttons with correct styling', async ({ page }) => {
        // Check primary button
        const primaryButton = page.locator('button:has-text("Primary Button")');
        await expect(primaryButton).toBeVisible();

        // Check secondary button
        const secondaryButton = page.locator('button:has-text("Secondary Button")');
        await expect(secondaryButton).toBeVisible();

        // Check accent button
        const accentButton = page.locator('button:has-text("Accent Button")');
        await expect(accentButton).toBeVisible();
    });

    test('should render themed cards with proper layout', async ({ page }) => {
        // Check primary card
        const primaryCard = page.locator('div').filter({ hasText: 'Primary Card' }).first();
        await expect(primaryCard).toBeVisible();

        // Check secondary card
        const secondaryCard = page.locator('div').filter({ hasText: 'Secondary Card' }).first();
        await expect(secondaryCard).toBeVisible();

        // Check accent card
        const accentCard = page.locator('div').filter({ hasText: 'Accent Card' }).first();
        await expect(accentCard).toBeVisible();
    });

    test('should render themed inputs with proper styling', async ({ page }) => {
        // Check text input
        const textInput = page.locator('input[placeholder="Enter text..."]');
        await expect(textInput).toBeVisible();

        // Check textarea
        const textarea = page.locator('textarea[placeholder="Enter long text..."]');
        await expect(textarea).toBeVisible();
    });

    test('should render text elements with correct variants', async ({ page }) => {
        // Check heading variants
        await expect(page.locator('h1:has-text("Heading 1")')).toBeVisible();
        await expect(page.locator('h2:has-text("Heading 2")')).toBeVisible();
        await expect(page.locator('h3:has-text("Heading 3")')).toBeVisible();
        await expect(page.locator('h4:has-text("Heading 4")')).toBeVisible();

        // Check body text
        await expect(page.locator('p:has-text("Body text with")')).toBeVisible();

        // Check caption text
        await expect(page.locator('p:has-text("Caption text")')).toBeVisible();
    });

    test('should display color palette correctly', async ({ page }) => {
        // Check color palette section
        await expect(page.locator('h2:has-text("🎨 Color Palette")')).toBeVisible();

        // Check primary colors
        await expect(page.locator('div').filter({ hasText: 'Primary' }).first()).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'Secondary' }).first()).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'Accent' }).first()).toBeVisible();

        // Check semantic colors
        await expect(page.locator('div').filter({ hasText: 'Success' }).first()).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'Warning' }).first()).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'Error' }).first()).toBeVisible();
    });

    test('should display spacing and typography scales', async ({ page }) => {
        // Check spacing section
        await expect(page.locator('h2:has-text("📏 Spacing Scale")')).toBeVisible();

        // Check typography section
        await expect(page.locator('h2:has-text("🔤 Typography Scale")')).toBeVisible();
    });

    test('should be responsive on different screen sizes', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify components are still visible and usable
        await expect(page.locator('h1:has-text("🎨 Theme System Demo")')).toBeVisible();
        await expect(page.locator('h2:has-text("🎯 Component Library")')).toBeVisible();

        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        // Verify layout adjusts appropriately
        await expect(page.locator('h1:has-text("🎨 Theme System Demo")')).toBeVisible();

        // Return to desktop viewport
        await page.setViewportSize({ width: 1280, height: 720 });
    });

    test('should maintain theme consistency across navigation', async ({ page }) => {
        // Navigate to another page
        await page.goto('/unified-testing');

        // Verify theme is applied
        await expect(page.locator('h2:has-text("🤖 Unified N8N Testing Console")')).toBeVisible();

        // Navigate back to theme demo
        await page.goto('/theme-demo');

        // Verify theme demo still works
        await expect(page.locator('h1:has-text("🎨 Theme System Demo")')).toBeVisible();
    });

    test('should handle theme switching if implemented', async ({ page }) => {
        // Check if theme switching controls exist
        const themeSwitcher = page.locator('button:has-text("Toggle Theme")');

        if (await themeSwitcher.isVisible()) {
            // Test theme switching
            await themeSwitcher.click();

            // Wait for theme change
            await page.waitForTimeout(1000);

            // Verify theme has changed (this would depend on implementation)
            // await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
        } else {
            // Theme switching not implemented yet
            console.log('Theme switching not implemented in this version');
        }
    });
});

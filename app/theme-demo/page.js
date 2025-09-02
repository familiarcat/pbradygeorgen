"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThemeDemoPage;
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
function ThemeDemoPage() {
    const theme = (0, ThemeProvider_1.useTheme)();
    return (<div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)`,
            padding: theme.spacing.xl,
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <ComponentLibrary_1.Card variant="primary" style={{ marginBottom: theme.spacing.xl }}>
                    <ComponentLibrary_1.Flex direction="column" align="center" gap={theme.spacing.md}>
                        <ComponentLibrary_1.Text variant="h1" color="primary">
                            🎨 Theme System Demo
                        </ComponentLibrary_1.Text>
                        <ComponentLibrary_1.Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                            Universal styling system for consistent UI across the entire application
                        </ComponentLibrary_1.Text>
                    </ComponentLibrary_1.Flex>
                </ComponentLibrary_1.Card>

                {/* Component Showcase */}
                <ComponentLibrary_1.Grid columns={2} gap={theme.spacing.xl}>
                    {/* Buttons Section */}
                    <ComponentLibrary_1.Card variant="secondary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Buttons</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                                <ComponentLibrary_1.Button variant="primary" size="lg">
                                    <ComponentLibrary_1.Icon icon="🚀" size="md"/>
                                    Primary Button
                                </ComponentLibrary_1.Button>

                                <ComponentLibrary_1.Button variant="secondary" size="md">
                                    <ComponentLibrary_1.Icon icon="⚡" size="sm"/>
                                    Secondary Button
                                </ComponentLibrary_1.Button>

                                <ComponentLibrary_1.Button variant="accent" size="sm">
                                    <ComponentLibrary_1.Icon icon="🎯" size="sm"/>
                                    Accent Button
                                </ComponentLibrary_1.Button>

                                <ComponentLibrary_1.Button variant="success" size="md">
                                    <ComponentLibrary_1.Icon icon="✅" size="sm"/>
                                    Success Button
                                </ComponentLibrary_1.Button>

                                <ComponentLibrary_1.Button variant="warning" size="md">
                                    <ComponentLibrary_1.Icon icon="⚠️" size="sm"/>
                                    Warning Button
                                </ComponentLibrary_1.Button>

                                <ComponentLibrary_1.Button variant="error" size="md">
                                    <ComponentLibrary_1.Icon icon="❌" size="sm"/>
                                    Error Button
                                </ComponentLibrary_1.Button>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>

                    {/* Inputs Section */}
                    <ComponentLibrary_1.Card variant="accent">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Inputs</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                                <ComponentLibrary_1.Input value="" onChange={() => { }} placeholder="Text input placeholder" type="text"/>

                                <ComponentLibrary_1.Input value="" onChange={() => { }} placeholder="Textarea placeholder" type="textarea" rows={3}/>

                                <ComponentLibrary_1.Input value="" onChange={() => { }} placeholder="Email input" type="email"/>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>

                    {/* Typography Section */}
                    <ComponentLibrary_1.Card variant="primary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Typography</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                                <ComponentLibrary_1.Text variant="h1" color="primary">Heading 1</ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="h2" color="secondary">Heading 2</ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="h3" color="tertiary">Heading 3</ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="h4" color="primary">Heading 4</ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="body" color="primary">Body text with normal weight</ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="caption" color="secondary">Caption text for smaller details</ComponentLibrary_1.Text>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>

                    {/* Badges Section */}
                    <ComponentLibrary_1.Card variant="secondary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Badges</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Flex direction="row" gap={theme.spacing.sm} wrap>
                                <ComponentLibrary_1.Badge variant="primary" size="sm">Primary</ComponentLibrary_1.Badge>
                                <ComponentLibrary_1.Badge variant="secondary" size="md">Secondary</ComponentLibrary_1.Badge>
                                <ComponentLibrary_1.Badge variant="accent" size="lg">Accent</ComponentLibrary_1.Badge>
                                <ComponentLibrary_1.Badge variant="success" size="sm">Success</ComponentLibrary_1.Badge>
                                <ComponentLibrary_1.Badge variant="warning" size="md">Warning</ComponentLibrary_1.Badge>
                                <ComponentLibrary_1.Badge variant="error" size="lg">Error</ComponentLibrary_1.Badge>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>

                    {/* Layout Components */}
                    <ComponentLibrary_1.Card variant="accent">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Layout Components</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Grid columns={2} gap={theme.spacing.sm}>
                                <div style={{
            background: theme.colors.background.tertiary,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            textAlign: 'center'
        }}>
                                    Grid Item 1
                                </div>
                                <div style={{
            background: theme.colors.background.tertiary,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            textAlign: 'center'
        }}>
                                    Grid Item 2
                                </div>
                            </ComponentLibrary_1.Grid>

                            <ComponentLibrary_1.Flex direction="row" gap={theme.spacing.sm} justify="space-between">
                                <div style={{
            background: theme.colors.background.tertiary,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            flex: 1,
            textAlign: 'center'
        }}>
                                    Flex Item 1
                                </div>
                                <div style={{
            background: theme.colors.background.tertiary,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            flex: 1,
            textAlign: 'center'
        }}>
                                    Flex Item 2
                                </div>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>

                    {/* Theme Info */}
                    <ComponentLibrary_1.Card variant="primary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">Theme Information</ComponentLibrary_1.Text>

                            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                                <ComponentLibrary_1.Text variant="body" color="secondary">
                                    <strong>Primary Color:</strong> {theme.colors.primary}
                                </ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="body" color="secondary">
                                    <strong>Secondary Color:</strong> {theme.colors.secondary}
                                </ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="body" color="secondary">
                                    <strong>Accent Color:</strong> {theme.colors.accent}
                                </ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="body" color="secondary">
                                    <strong>Font Family:</strong> {theme.typography.fontFamily}
                                </ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="body" color="secondary">
                                    <strong>Base Spacing:</strong> {theme.spacing.md}
                                </ComponentLibrary_1.Text>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>
                </ComponentLibrary_1.Grid>

                {/* Usage Instructions */}
                <ComponentLibrary_1.Card variant="secondary" style={{ marginTop: theme.spacing.xl }}>
                    <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                        <ComponentLibrary_1.Text variant="h3" color="primary">How to Use</ComponentLibrary_1.Text>

                        <ComponentLibrary_1.Text variant="body" color="secondary">
                            1. Import components from <code>@/theme/ComponentLibrary</code>
                        </ComponentLibrary_1.Text>
                        <ComponentLibrary_1.Text variant="body" color="secondary">
                            2. Use the <code>useTheme()</code> hook to access theme values
                        </ComponentLibrary_1.Text>
                        <ComponentLibrary_1.Text variant="body" color="secondary">
                            3. All components automatically use consistent styling
                        </ComponentLibrary_1.Text>
                        <ComponentLibrary_1.Text variant="body" color="secondary">
                            4. Customize with additional style props when needed
                        </ComponentLibrary_1.Text>
                    </ComponentLibrary_1.Flex>
                </ComponentLibrary_1.Card>
            </div>
        </div>);
}
//# sourceMappingURL=page.js.map